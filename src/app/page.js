"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, BarChart3, Clock, ExternalLink, Menu, X } from "lucide-react"

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-950 to-slate-900">
      {/* Navbar */}
      <header className="w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm fixed top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
              <ExternalLink className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-bold text-white">LinkBrief</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/login">
              <button className="text-white cursor-pointer">
                Iniciar Sesión
              </button>
            </Link>
            <Link href="/register">
              <button className=" text-white cursor-pointer">
                Registrarse
              </button>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            size="icon"
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-slate-900 border-b border-slate-800 py-4 px-4 absolute w-full">
            <nav className="flex flex-col gap-4">
              <div className="flex flex-col gap-2 pt-2">
                <Link href="/login">
                  <button className="w-full text-white">
                    Iniciar Sesión
                  </button>
                </Link>
                <Link href="/register">
                  <button className="w-full text-white">
                    Registrarse
                  </button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-24 pb-16 md:pt-26 md:pb-24">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 max-w-4xl leading-tight">
            <span className="bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">LinkBrief</span>{" "}
            - Acortador de URLs Inteligente
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl">
            Acorta tus URLs fácilmente, obtén estadísticas detalladas y controla el tráfico de manera eficiente con
            nuestra plataforma.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <button
              className="bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white px-8 py-6 text-lg rounded-2xl flex items-center cursor-pointer"
              onClick={() => (window.location.href = "/dashboard")}
            >
              Ir al Dashboard
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>

          {/* Dashboard Preview */}
          <div className="w-full max-w-5xl relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-xl blur opacity-30"></div>
            <div className="relative bg-slate-900 p-1 rounded-xl overflow-hidden border border-slate-800">
              <Image
                src="/images/dashboard-preview.png"
                priority
                alt="Vista previa del Dashboard"
                width={1200}
                height={800}
                className="rounded-lg w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-4 md:py-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Características Principales</h2>
          <p className="text-slate-300 max-w-2xl mx-auto">
            Descubre por qué LinkBrief es la mejor opción para gestionar y acortar tus URLs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:bg-slate-800 transition-colors">
            <div className="h-12 w-12 rounded-lg bg-blue-500/20 flex items-center justify-center mb-4">
              <Clock className="h-6 w-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Acortamiento Instantáneo</h3>
            <p className="text-slate-300">
              Acorta tus URLs en segundos con nuestro sistema optimizado y fácil de usar.
            </p>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:bg-slate-800 transition-colors">
            <div className="h-12 w-12 rounded-lg bg-cyan-500/20 flex items-center justify-center mb-4">
              <BarChart3 className="h-6 w-6 text-cyan-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Estadísticas Basicas</h3>
            <p className="text-slate-300">
              Analiza el rendimiento de tus enlaces con métricas avanzadas.
            </p>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:bg-slate-800 transition-colors">
            <div className="h-12 w-12 rounded-lg bg-purple-500/20 flex items-center justify-center mb-4">
              <ExternalLink className="h-6 w-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Enlaces Personalizados</h3>
            <p className="text-slate-300">Crea URLs personalizadas que reflejen tu marca y sean fáciles de recordar.</p>
          </div>
        </div>
      </section>

        <div className="container mx-auto p-6">
          <div className="border-t border-slate-800 pt-4 text-center text-slate-400">
            <p>© {new Date().getFullYear()} LinkBrief. Todos los derechos reservados.</p>
          </div>
        </div>
    </div>
  )
}

