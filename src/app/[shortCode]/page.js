import { createClient } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function Page({ params }) {
  if (!params) return null; // Asegura que params está definido

  const { shortCode } = await params; // Asegura que params sea esperado correctamente

  const { data, error } = await supabase
    .from('short_urls')
    .select('original_url')
    .eq('short_code', shortCode)
    .single();

  if (error || !data) {
    return <h1>URL no encontrada</h1>;
  }

  // Redirecciona a la URL original
  return (
    <meta httpEquiv="refresh" content={`0;url=${data.original_url}`} />
  );
}

