'use client';

import { signOut } from "@/lib/auth";  // Importa la función de signOut
import { useRouter } from "next/navigation";

export default function Logout() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const success = await signOut();  // Llama a la función signOut para cerrar sesión
      if (success) {
        console.log('Sesión cerrada');
        router.push("/login");  // Redirige al usuario a la página de login después de cerrar sesión
      }
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="p-3 bg-red-600 text-white font-semibold rounded-md shadow-md transition duration-200 hover:bg-red-700 hover:shadow-lg active:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-400"
    >
      Cerrar sesión
    </button>
  );
}
