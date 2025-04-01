import { supabase } from "@/lib/supabaseClient";

export async function createShortenedURL(originalUrl, customSlug = '') {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error("No hay sesión activa");

  // Verificar si el usuario ya acortó esta URL
  const { data: existingUrls, error: existingError } = await supabase
    .from('short_urls')
    .select('short_code')
    .eq('user_id', session.user.id)
    .eq('original_url', originalUrl)
    .maybeSingle();

  if (existingError) {
    console.error('Error al verificar URL existente:', existingError);
    throw new Error('Error al verificar URL existente');
  }

  if (existingUrls) {
    return { shortenedUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/${existingUrls.short_code}` };
  }

  // Si el usuario ingresó un custom slug, verificar que no exista
  if (customSlug) {
    const { data: existingSlug, error: slugError } = await supabase
      .from('short_urls')
      .select('id')
      .eq('short_code', customSlug)
      .maybeSingle();

    if (slugError) {
      console.error('Error al verificar el slug:', slugError);
      throw new Error('Error al verificar el slug');
    }

    if (existingSlug) {
      return { error: 'El slug ya está en uso. Elige otro.' };
    }
  }

  // Generar un slug aleatorio si no se proporciona uno
  const shortCode = customSlug || Math.random().toString(36).substr(2, 6);

  const res = await fetch('/api/shorten', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.access_token}`
    },
    body: JSON.stringify({ originalUrl, shortCode }),
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
    .select('id, original_url, short_code, created_at, clicks')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) {
    console.error('Error al obtener URLs:', error);
    throw new Error('Error al obtener URLs');
  }

  return data || [];
}

export async function incrementClickCount(shortCode) {
  const { error } = await supabase
    .from('short_urls')
    .update({ clicks: supabase.raw('clicks + 1') })
    .eq('short_code', shortCode);

  if (error) {
    console.error('Error al incrementar clics:', error);
  }
}


