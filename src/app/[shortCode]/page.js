import { supabase } from '@/lib/supabaseClient';
import { redirect } from 'next/navigation';

export default async function Page({ params }) {
  if (!params) return <h1>URL no encontrada</h1>;

  const { shortCode } = params;

  const { data, error } = await supabase
    .from('short_urls')
    .select('original_url, clicks')
    .eq('short_code', shortCode)
    .single();

  if (error || !data) {
    return <h1>URL no encontrada</h1>;
  }

  // Incrementar el contador de clics
  await supabase
    .from('short_urls')
    .update({ clicks: data.clicks + 1 })
    .eq('short_code', shortCode);

  // Redirigir a la URL original
  redirect(data.original_url);
}
