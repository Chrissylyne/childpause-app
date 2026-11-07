// Formulaire de contact : transmet le message par e-mail a l'adresse de ChildPause via Resend.
// Variables d'environnement (Vercel) :
//   RESEND_API_KEY : cle API Resend
//   CONTACT_TO     : adresse qui recoit les messages (avec l'expediteur de test de Resend,
//                    ce doit etre l'e-mail du compte Resend)
//   CONTACT_FROM   : facultatif, par defaut 'ChildPause <onboarding@resend.dev>'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const clean = (value, max) => (typeof value === 'string' ? value.trim().slice(0, max) : '');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  const { RESEND_API_KEY, CONTACT_TO, CONTACT_FROM } = process.env;
  if (!RESEND_API_KEY || !CONTACT_TO) {
    return res.status(500).json({ error: 'not_configured' });
  }

  const body = typeof req.body === 'string' ? safeParse(req.body) : req.body || {};

  // Champ piege : un humain ne le remplit pas. On repond "ok" sans rien envoyer.
  if (clean(body.website, 200)) {
    return res.status(200).json({ ok: true });
  }

  const name = clean(body.name, 100);
  const email = clean(body.email, 200);
  const message = clean(body.message, 5000);

  if (!name || !EMAIL_PATTERN.test(email) || message.length < 10) {
    return res.status(400).json({ error: 'invalid_input' });
  }

  // Empeche l'injection d'en-tetes dans le sujet.
  const safeName = name.replace(/[\r\n]+/g, ' ');

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: CONTACT_FROM || 'ChildPause <onboarding@resend.dev>',
        to: [CONTACT_TO],
        reply_to: email,
        subject: `Message via childpause.online : ${safeName}`,
        text: `Nom : ${safeName}\nE-mail : ${email}\n\n${message}`,
      }),
    });

    if (!response.ok) {
      return res.status(502).json({ error: 'send_failed' });
    }
    return res.status(200).json({ ok: true });
  } catch {
    return res.status(502).json({ error: 'send_failed' });
  }
}

function safeParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}
