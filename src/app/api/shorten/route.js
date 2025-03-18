import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(req) {
  try {
    const { originalUrl } = await req.json();
    if (!originalUrl) {
      return Response.json({ error: 'URL requerida' }, { status: 400 });
    }

    // Obtener el token de autenticación desde los headers
    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return Response.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Obtener el usuario autenticado desde el token
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return Response.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Generar un código corto único
    const shortCode = Math.random().toString(36).substring(2, 8);

    // Guardar en Supabase con el `user_id`
    const { data, error } = await supabase
      .from('short_urls')
      .insert([{ original_url: originalUrl, short_code: shortCode, user_id: user.id }])
      .select();

    if (error) throw error;

    return Response.json({ shortenedUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/${shortCode}` });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
