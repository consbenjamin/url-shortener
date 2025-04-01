import { supabase } from "@/lib/supabaseClient";


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
  return data?.user;
};


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
  return data?.user;
};


export const signOut = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Error al cerrar sesión en Supabase:', error.message);
    return false;
  }

  localStorage.removeItem('supabase.auth.token');
  console.log('Sesión cerrada correctamente');

  return true;
};

export async function checkSession() {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    return null;
  }
  return data.user;
}

export const getUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error) {
    console.error('Error al obtener el usuario:', error.message);
    return null;
  }

  return user;
};

