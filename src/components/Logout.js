'use client';

import { signOut } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function Logout() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const success = await signOut();
      if (success) {
        console.log('Sesión cerrada');
        router.push("/login");
      }
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className=" text-white py-2 px-4 rounded cursor-pointer "
    >
      Cerrar sesión
    </button>
  );
}
