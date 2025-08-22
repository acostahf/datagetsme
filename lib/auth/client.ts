import { createClient } from '@/lib/supabase/client'

// Get the correct redirect URL for magic links
function getRedirectUrl(): string {
  // In production, you can hardcode your production domain
  // or use an environment variable
  if (process.env.NODE_ENV === 'production') {
    // Use hardcoded production domain for reliable magic link redirects
    return 'https://datagetsme.vercel.app/auth/callback'
  }
  
  // In development, use localhost
  return `${window.location.origin}/auth/callback`
}

export async function signUp(email: string, password?: string) {
  const supabase = createClient()
  
  if (password) {
    // Traditional email/password signup
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    return { data, error }
  } else {
    // Magic link signup
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: getRedirectUrl(),
      },
    })
    return { data, error }
  }
}

export async function signIn(email: string, password?: string) {
  const supabase = createClient()
  
  if (password) {
    // Traditional email/password signin
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  } else {
    // Magic link signin
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: getRedirectUrl(),
      },
    })
    return { data, error }
  }
}

export async function signOut() {
  const supabase = createClient()
  
  const { error } = await supabase.auth.signOut()
  
  return { error }
}

export async function getCurrentUser() {
  const supabase = createClient()
  
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  return { user, error }
}