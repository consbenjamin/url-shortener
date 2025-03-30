import { supabase } from "@/lib/supabaseClient";

export async function createShortenedURL(originalUrl) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error("No hay sesión activa");

  // Verificar si la URL ya ha sido acortada por el usuario
  const { data: existingUrls, error } = await supabase
    .from('short_urls')
    .select('short_code')
    .eq('user_id', session.user.id)
    .eq('original_url', originalUrl)
    .maybeSingle();

  if (error) {
    console.error('Error al verificar URL existente:', error);
    throw new Error('Error al verificar URL existente');
  }

  if (existingUrls) {
    // Si la URL ya fue acortada, devolver el short_code existente
    return { shortenedUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/${existingUrls.short_code}` };
  }

  // Si la URL no ha sido acortada, proceder a acortarla
  const res = await fetch('/api/shorten', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.access_token}`
    },
    body: JSON.stringify({ originalUrl }),
  });

  if (!res.ok) {
    throw new Error('Error al acortar la URL');
  }

  return res.json();
}

export async function fetchRecentURLs(userId) {
  if (!userId) throw new Error('El userId es requerido para obtener URLs recientes');

  const { data, error } = await supabase
    .from('short_urls')
    .select('id, original_url, short_code, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) {
    console.error('Error al obtener URLs:', error);
    throw new Error('Error al obtener URLs');
  }

  return data || [];
}

