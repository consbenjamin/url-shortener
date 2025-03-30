'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { checkSession } from '@/lib/auth';
import Logout from '@/components/Logout';
import { createShortenedURL, fetchRecentURLs } from '@/lib/url';
import { Link, Clipboard, ExternalLink, Clock, Menu, X } from 'lucide-react';
import { motion } from "framer-motion";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortenedUrl, setShortenedUrl] = useState('');
  const [recentUrls, setRecentUrls] = useState([]);
  const [error, setError] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copyMessage, setCopyMessage] = useState('');
  const [copiedUrl, setCopiedUrl] = useState(null);
  const [loadingShorten, setLoadingShorten] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const verifySession = async () => {
      const user = await checkSession();
      if (!user || !user.id) {  // Verificar que realmente tenga un ID
        router.push('/login');
      } else {
        setLoading(false);
        await loadRecentUrls(user.id);
      }
    };
  
    verifySession();
  }, [router]);

  const loadRecentUrls = async (userId) => {
    if (!userId) {
      console.error("El userId es requerido para obtener URLs recientes");
      return;  // Evitar que se haga la petición con un userId inválido
    }
    
    try {
      const urls = await fetchRecentURLs(userId);
      setRecentUrls(urls);
    } catch (err) {
      console.error("Error al obtener las URLs recientes", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoadingShorten(true);
    
    if (!originalUrl) {
      setError('Por favor ingresa una URL.');
      setLoadingShorten(false);
      return;
    }
  
    try {
      const result = await createShortenedURL(originalUrl);
      if (result.shortenedUrl) {
        setShortenedUrl(result.shortenedUrl);
          const user = await checkSession();
          if (user?.id) {
            await loadRecentUrls(user.id);
          }
      }
    } catch (err) {
      setError('Hubo un error al acortar el URL.');
      console.error(err);
    }
    setLoadingShorten(false);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopiedUrl(text); // Guardamos la URL copiada
        setTimeout(() => setCopiedUrl(null), 2000); // Se resetea después de 2 seg
      })
      .catch(err => {
        console.error('Error al copiar: ', err);
      });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-950 text-zinc-50">
        <div className="animate-spin rounded-full size-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-50">
      <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-900/95 backdrop-blur">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
          <div className="flex gap-2 items-center text-xl font-bold">
            <Link className="size-6 text-blue-400" />
            <span className="hidden sm:inline">LinkBrief</span>
            <span className="sm:hidden">LB</span>
          </div>
          
          <div className="sm:hidden">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Abrir menú</span>
              {mobileMenuOpen ? (
                <X className="block size-6" />
              ) : (
                <Menu className="block size-6" />
              )}
            </button>
          </div>
          
          <div className="hidden sm:flex items-center gap-4">
            <Logout />
          </div>
        </div>
        
        {mobileMenuOpen && (
          <div className="sm:hidden bg-zinc-900 border-b border-zinc-800">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <div className="px-3 py-2">
                <Logout />
              </div>
            </div>
          </div>
        )}
      </header>
      
      <motion.main 
        className="flex-1"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <section className="w-full py-8 md:py-16 lg:py-24 bg-zinc-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="space-y-2 max-w-4xl mx-auto">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter">
                  Acorta tus enlaces en segundos
                </h1>
                <p className="mx-auto max-w-[700px] text-zinc-400 text-sm sm:text-base md:text-lg">
                  Crea enlaces cortos y memorables que redirijan a tus URLs largas. Perfecto para redes sociales, emails y más.
                </p>
              </div>
              
              <div className="w-full max-w-2xl mt-4 px-4 sm:px-0">
                <form onSubmit={handleSubmit} className="flex w-full flex-col gap-2 sm:flex-row">
                  <div className="flex-1">
                    <input
                      type="url"
                      placeholder="Pega tu URL larga aquí"
                      value={originalUrl}
                      onChange={(e) => setOriginalUrl(e.target.value)}
                      required
                      className="h-12 w-full flex rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                  <button 
                    type="submit"
                    className="h-12 mt-2 sm:mt-0 items-center justify-center rounded-md bg-blue-600 px-4 sm:px-8 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:pointer-events-none disabled:opacity-50"
                    disabled={loadingShorten}
                  >
                    {loadingShorten ? (
                      <div className="size-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      "Acortar URL"
                    )}
                  </button>
                </form>
                
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                
                {shortenedUrl && shortenedUrl.startsWith('http') && (
                  <div className="mt-4 p-3 sm:p-4 bg-zinc-800 rounded-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
                    <a 
                      href={shortenedUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-400 font-medium hover:underline text-sm sm:text-base break-all"
                    >
                      {shortenedUrl}
                    </a>
                    <button 
                      onClick={() => copyToClipboard(shortenedUrl)}
                      className="inline-flex size-8 items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-900 ml-auto"
                    >
                      {copyMessage === shortenedUrl ? "✅" : <Clipboard className="size-4" />}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
        
        <section className="w-full py-8 md:py-16 lg:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto flex max-w-3xl flex-col items-center gap-2 sm:gap-4 text-center">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tighter">
                URLs acortadas recientemente
              </h2>
              <p className="max-w-[700px] text-zinc-400 text-sm sm:text-base md:text-lg">
                Aquí están tus enlaces acortados más recientes. Haz clic para copiar o visitar.
              </p>
            </div>
            
            <div className="mx-auto mt-6 sm:mt-8 max-w-5xl">
              <div className="rounded-lg border border-zinc-800 bg-zinc-900 shadow-md overflow-hidden">
                <div className="p-3 sm:p-6">
                  <div className="flex flex-col gap-3 sm:gap-4">
                    {recentUrls.length > 0 ? (
                      recentUrls.map((url) => {
                        const fullShortUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/${url.short_code}`;
                        return (
                          <div
                            key={url.id}
                            className="flex flex-col gap-2 rounded-lg border border-zinc-800 p-3 sm:p-4 hover:bg-zinc-800/50 transition-colors"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                              <span className="font-medium text-blue-400 text-sm break-all">{fullShortUrl}</span>
                              <button 
                                onClick={() => copyToClipboard(fullShortUrl)}
                                className="relative inline-flex size-8 items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-900 ml-auto"
                              >
                                <Clipboard className="size-4" />
                                <span className="sr-only">Copiar</span>

                                <span
                                  className={`absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-800 text-white text-xs px-2 py-1 rounded-md transition-opacity ${
                                    copiedUrl === fullShortUrl ? "opacity-100 scale-100" : "opacity-0 scale-90"
                                  }`}
                                >
                                  ¡Copiado!
                                </span>
                              </button>
                            </div>
                            
                            
                            <div className="flex items-center gap-2 text-xs sm:text-sm text-zinc-400">
                              <ExternalLink className="size-3.5 flex-shrink-0" />
                              <span className="truncate">{url.original_url}</span>
                            </div>
                            
                            {/* Metadata */}
                            <div className="flex items-center gap-2 text-xs sm:text-sm text-zinc-400 mt-1 border-t border-zinc-800 pt-2">
                              <Clock className="size-3.5 flex-shrink-0" />
                              <span>{new Date(url.created_at).toLocaleDateString()}</span>
                              {url.clicks !== undefined && (
                                <div className="ml-auto flex items-center gap-1">
                                  <span className="text-xs font-medium">{url.clicks}</span>
                                  <span className="text-xs">clicks</span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-center text-zinc-400 py-4">No hay URLs recientes.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </motion.main>
      
      <footer className="w-full border-t border-zinc-800 py-4 sm:py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center gap-2 sm:gap-4 md:flex-row md:gap-8">
          <p className="text-center text-xs sm:text-sm leading-loose text-zinc-400 md:text-left">
            © {new Date().getFullYear()} LinkBrief. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}