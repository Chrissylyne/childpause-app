import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

// Charge les situations depuis Supabase. Les titres sont visibles par tous,
// les contenus des situations Premium seulement pour un abonne actif (regle cote base).
export function useSituations(isPremium, ready) {
  const [state, setState] = useState({ items: [], loading: true, error: false });

  const load = useCallback(async () => {
    setState((previous) => ({ ...previous, loading: true, error: false }));
    const [meta, contents] = await Promise.all([
      supabase.from('situations').select('*').order('position', { ascending: true }),
      supabase.from('situation_contents').select('*'),
    ]);

    if (meta.error || contents.error || !meta.data || !contents.data) {
      setState({ items: [], loading: false, error: true });
      return;
    }

    const contentById = new Map(contents.data.map((row) => [row.situation_id, row]));
    const items = meta.data.map((row) => {
      const content = contentById.get(row.id);
      return {
        id: row.id,
        emoji: row.emoji,
        free: !row.premium,
        fr: {
          title: row.title_fr,
          subtitle: row.subtitle_fr,
          content: content ? content.content_fr : null,
        },
        de: {
          title: row.title_de,
          subtitle: row.subtitle_de,
          content: content ? content.content_de : null,
        },
      };
    });
    setState({ items, loading: false, error: false });
  }, []);

  useEffect(() => {
    if (ready) load();
  }, [load, ready, isPremium]);

  return { ...state, reload: load };
}
