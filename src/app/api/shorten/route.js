import { supabase } from "@/lib/supabaseClient";

export async function POST(req) {
  try {
    const { originalUrl, shortCode } = await req.json();
    if (!originalUrl) {
      return Response.json({ error: 'URL requerida' }, { status: 400 });
    }

    // Obtener el token de autenticación
    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return Response.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return Response.json({ error: 'No autorizado' }, { status: 401 });
    }

    if (shortCode) {
      const { data: existingSlug } = await supabase 
        .from('short_urls')
        .select('id')
        .eq('short_code', shortCode)
        .maybeSingle();

      if (existingSlug) {
        return Response.json({ error: 'El slug ya está en uso. Elige otro.' }, { status: 400 });
      }
    }

    // Generar un slug aleatorio si no hay custom slug
    const finalShortCode = shortCode || Math.random().toString(36).substring(2, 8);

    // Guardar en Supabase
    const { data, error } = await supabase
      .from('short_urls')
      .insert([{ original_url: originalUrl, short_code: finalShortCode, user_id: user.id }])
      .select();

    if (error) throw error;

    return Response.json({ shortenedUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/${finalShortCode}` });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
