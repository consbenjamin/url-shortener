import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function createShortenedURL(originalUrl) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error("No hay sesión activa");

  const res = await fetch('/api/shorten', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.access_token}` // Enviar el token
    },
    body: JSON.stringify({ originalUrl }),
  });

  if (!res.ok) {
    throw new Error('Error al acortar la URL');
  }

  return res.json();
}

export async function fetchRecentURLs(userId) {
  if (!userId) {
    console.error('fetchRecentURLs: userId es undefined');
    return [];
  }

  const { data, error } = await supabase
    .from('short_urls')
    .select('id, original_url, short_code, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(5); 

  if (error) {
    console.error('Error al obtener URLs:', error);
    return [];
  }
  return data;
}
