import { supabase } from "./supabaseClient";

// Iniciar sesión con correo y contraseña
export const signInWithEmail = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('Error al iniciar sesión:', error.message);
    return null;
  }

  console.log('Respuesta de autenticación:', data);
  return data?.user; // Devuelve el usuario autenticado
};

// Registrar un nuevo usuario con correo y contraseña
export const signUpWithEmail = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.error('Error al registrar usuario:', error.message);
    return null;
  }

  console.log('Usuario registrado correctamente:', data);
  return data?.user; // Devuelve el usuario registrado
};

// Cerrar sesión
export const signOut = async () => {
  // Elimina el token de Supabase en las cookies
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Error al cerrar sesión en Supabase:', error.message);
    return false;
  }

  // También eliminamos el token de localStorage
  localStorage.removeItem('supabase.auth.token');  // Elimina el token almacenado en localStorage
  console.log('Sesión cerrada correctamente');

  return true;
};
// Verificar si hay una sesión activa
export async function checkSession() {
  const { data, error } = await supabase.auth.getSession();
  
  if (error || !data.session) {
    console.error('Error al obtener la sesión:', error);
    return null;
  }

  return data.session.user; // Asegurar que devuelve el usuario
}

// Obtener el usuario autenticado
export const getUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error) {
    console.error('Error al obtener el usuario:', error.message);
    return null;
  }

  return user; // Devuelve el usuario autenticado o null si no hay sesión
};

