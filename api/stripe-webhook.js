import crypto from 'node:crypto';
import { createClient } from '@supabase/supabase-js';

// Le corps brut est necessaire pour verifier la signature Stripe.
export const config = { api: { bodyParser: false } };

const TOLERANCE_SECONDS = 300;

async function readRawBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

function verifySignature(rawBody, header, secret) {
  if (!header || !secret) return false;
  const pairs = String(header).split(',').map((part) => part.split('='));
  const timestamp = pairs.find(([key]) => key === 't')?.[1];
  const signatures = pairs.filter(([key]) => key === 'v1').map(([, value]) => value);
  if (!timestamp || signatures.length === 0) return false;

  const age = Math.abs(Date.now() / 1000 - Number(timestamp));
  if (!Number.isFinite(age) || age > TOLERANCE_SECONDS) return false;

  const expected = crypto
    .createHmac('sha256', secret)
    .update(Buffer.from(`${timestamp}.`))
    .update(rawBody)
    .digest();

  return signatures.some((signature) => {
    const candidate = Buffer.from(signature, 'hex');
    return candidate.length === expected.length && crypto.timingSafeEqual(candidate, expected);
  });
}

function planFromSubscription(subscription) {
  const item = subscription?.items?.data?.[0];
  const interval = item?.price?.recurring?.interval ?? item?.plan?.interval;
  if (interval === 'year') return 'annual';
  if (interval === 'month') return 'monthly';
  return null;
}

function periodEndFromSubscription(subscription) {
  const timestamp =
    subscription?.current_period_end ?? subscription?.items?.data?.[0]?.current_period_end;
  return timestamp ? new Date(timestamp * 1000).toISOString() : null;
}

async function handleCheckoutCompleted(supabase, session) {
  if (session?.mode !== 'subscription') return;

  const email = String(session.customer_details?.email || session.customer_email || '')
    .trim()
    .toLowerCase();
  if (!email) {
    console.error('Checkout sans e-mail', session.id);
    return;
  }

  const paid =
    session.payment_status === 'paid' || session.payment_status === 'no_payment_required';

  const { error } = await supabase.from('entitlements').upsert(
    {
      email,
      stripe_customer_id: session.customer ?? null,
      stripe_subscription_id: session.subscription ?? null,
      status: paid ? 'active' : 'inactive',
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'email' }
  );
  if (error) throw new Error(error.message);
}

async function handleSubscriptionChange(supabase, subscription) {
  if (!subscription?.customer || !subscription?.id) return;

  const changes = {
    status: subscription.status,
    stripe_subscription_id: subscription.id,
    updated_at: new Date().toISOString(),
  };
  const plan = planFromSubscription(subscription);
  if (plan) changes.plan = plan;
  const periodEnd = periodEndFromSubscription(subscription);
  if (periodEnd) changes.current_period_end = periodEnd;

  // On ne touche que la ligne dont l'abonnement est le meme (ou pas encore connu),
  // pour qu'un ancien abonnement annule ne ferme pas un nouvel abonnement actif.
  const { data, error } = await supabase
    .from('entitlements')
    .update(changes)
    .eq('stripe_customer_id', subscription.customer)
    .or(`stripe_subscription_id.eq.${subscription.id},stripe_subscription_id.is.null`)
    .select('email');
  if (error) throw new Error(error.message);

  if (!data || data.length === 0) {
    console.log('Evenement abonnement sans ligne correspondante, ignore', subscription.id);
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).send('Method not allowed');
  }

  const { STRIPE_WEBHOOK_SECRET, SUPABASE_URL, SUPABASE_SECRET_KEY } = process.env;
  if (!STRIPE_WEBHOOK_SECRET || !SUPABASE_URL || !SUPABASE_SECRET_KEY) {
    console.error('Configuration manquante: variables d environnement');
    return res.status(500).send('Server not configured');
  }

  // Plusieurs secrets possibles, separes par des virgules (mode test et mode reel de Stripe).
  const secrets = String(STRIPE_WEBHOOK_SECRET)
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);

  const rawBody = await readRawBody(req);
  const signatureHeader = req.headers['stripe-signature'];
  if (!secrets.some((secret) => verifySignature(rawBody, signatureHeader, secret))) {
    return res.status(400).send('Invalid signature');
  }

  let event;
  try {
    event = JSON.parse(rawBody.toString('utf8'));
  } catch {
    return res.status(400).send('Invalid payload');
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  try {
    const object = event.data?.object;
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(supabase, object);
        break;
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        await handleSubscriptionChange(supabase, object);
        break;
      default:
        break;
    }
    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook en erreur', event.id, event.type, error.message);
    return res.status(500).send('Webhook handler failed');
  }
}