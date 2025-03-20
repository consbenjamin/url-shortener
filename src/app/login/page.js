"use client"

import { signInWithEmail } from "@/lib/auth"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Link, User, Lock } from "lucide-react"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const user = await signInWithEmail(email, password)
      if (user) {
        console.log("Usuario autenticado:", user)
        router.push("/dashboard")
      }
    } catch (err) {
      setError("Credenciales incorrectas. Por favor, verifica tu email y contraseña.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-900/95 backdrop-blur">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
          <div className="flex gap-2 items-center text-xl font-bold">
            <Link className="size-6 text-blue-400" />
            <span className="hidden sm:inline">LinkBrief</span>
            <span className="sm:hidden">LB</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md rounded-lg border border-zinc-800 bg-zinc-900 p-6 sm:p-8 shadow-lg">
          <h2 className="text-xl sm:text-2xl font-semibold text-center text-zinc-50 mb-6">Iniciar sesión</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-zinc-400 text-sm mb-1">
                Correo electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="size-4 text-zinc-500" />
                </div>
                <input
                  type="email"
                  id="email"
                  placeholder="Correo electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-3 py-2 h-12 rounded-md border border-zinc-700 bg-zinc-800 text-zinc-50 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-zinc-400 text-sm mb-1">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="size-4 text-zinc-500" />
                </div>
                <input
                  type="password"
                  id="password"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-3 py-2 h-12 rounded-md border border-zinc-700 bg-zinc-800 text-zinc-50 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
                />
              </div>
            </div>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200 disabled:bg-zinc-700 disabled:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
            >
              {loading ? "Iniciando sesión..." : "Iniciar sesión"}
            </button>
          </form>

          <div className="mt-6 space-y-4">
            <p className="text-center text-zinc-400 text-sm">
              ¿No tienes cuenta?{" "}
              <a href="/register" className="text-blue-400 hover:text-blue-300 hover:underline transition-colors">
                Regístrate
              </a>
            </p>

            <div className="flex items-center justify-center">
              <a href="#" className="text-blue-400 text-sm hover:text-blue-300 hover:underline transition-colors">
                ¿Olvidaste tu contraseña?
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-zinc-800 py-4 sm:py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center gap-2 sm:gap-4">
          <p className="text-center text-xs sm:text-sm leading-loose text-zinc-400">
            © {new Date().getFullYear()} LinkBrief. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}

