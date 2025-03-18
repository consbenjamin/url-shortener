'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { checkSession } from '@/lib/auth';
import Logout from '@/components/Logout';
import { createShortenedURL, fetchRecentURLs } from '@/lib/url';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortenedUrl, setShortenedUrl] = useState('');
  const [recentUrls, setRecentUrls] = useState([]);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const verifySession = async () => {
      const user = await checkSession(); // Obtiene el usuario autenticado
      if (!user) {
        router.push('/login');
      } else {
        setLoading(false);
        await loadRecentUrls(user.id); // Carga las URLs del usuario
      }
    };
  
    verifySession();
  }, [router]);

  const loadRecentUrls = async (userId) => {
    try {
      const urls = await fetchRecentURLs(userId);
      setRecentUrls(urls);
    } catch (err) {
      console.error('Error al obtener las URLs recientes', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!originalUrl) {
      setError('Por favor ingresa una URL.');
      return;
    }
  
    try {
      const result = await createShortenedURL(originalUrl);
      if (result.shortenedUrl) {
        setShortenedUrl(result.shortenedUrl);

        // Obtener el usuario autenticado antes de recargar las URLs
        const user = await checkSession();
        if (user) {
          await loadRecentUrls(user.id);
        }
      }
    } catch (err) {
      setError('Hubo un error al acortar el URL.');
      console.error(err);
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-6">Bienvenido al Dashboard</h1>
      
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-medium mb-4">Acorta tu enlace</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="url" className="block text-gray-600">URL original</label>
            <input
              type="url"
              id="url"
              placeholder="Ingresa la URL aquí"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
          >
            Acortar URL
          </button>
        </form>

        {shortenedUrl && (
          <div className="mt-4">
            <h3 className="font-medium text-gray-700">URL acortada:</h3>
            <a href={shortenedUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              {shortenedUrl}
            </a>
          </div>
        )}
      </div>

      {/* Lista de URLs recientes */}
      <div className="mt-6 max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-medium mb-4">Últimas URLs acortadas</h2>
        <ul className="space-y-2">
          {recentUrls.length > 0 ? (
            recentUrls.map((url) => (
              <li key={url.id} className="text-sm text-gray-800">
                <a 
                  href={`${process.env.NEXT_PUBLIC_BASE_URL}/${url.short_code}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-600 hover:underline"
                >
                  {`${process.env.NEXT_PUBLIC_BASE_URL}/${url.short_code}`}
                </a> → {url.original_url}
              </li>
            ))
          ) : (
            <p className="text-gray-600">No hay URLs recientes.</p>
          )}
        </ul>
      </div>

      <div className="mt-6">
        <Logout />
      </div>
    </div>
  );
}
