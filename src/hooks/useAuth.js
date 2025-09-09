import { useState, useEffect } from 'react';
import { supabase, signInWithGoogle, signOut, getCurrentUser } from '../lib/supabase';

/**
 * Custom hook for managing authentication state
 * @returns {Object} Authentication state and methods
 */
export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    getCurrentUser()?.then(user => {
      setUser(user);
      setLoading(false);
    });

    // Listen for auth changes only if supabase is configured
    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          setUser(session?.user || null);
          setLoading(false);
        }
      );

      return () => subscription?.unsubscribe();
    } else {
      setLoading(false);
    }
  }, []);

  const handleSignIn = async () => {
    try {
      setLoading(true);
      await signInWithGoogle();
    } catch (error) {
      console.error('Sign in error:', error);
      setLoading(false);
      
      // Show user-friendly error message
      if (error.message?.includes('provider is not enabled')) {
        alert('Google sign-in is not configured. Please enable Google OAuth in your Supabase project dashboard under Authentication > Providers.');
      } else if (error.message?.includes('OAuth configuration error')) {
        alert('OAuth configuration error. Please check your Google OAuth settings in Supabase Dashboard.');
      } else {
        alert('Sign-in failed. Please check your configuration and try again.');
      }
    }
  };

  const handleSignOut = async () => {
    try {
      setLoading(true);
      await signOut();
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    signIn: handleSignIn,
    signOut: handleSignOut,
    isAuthenticated: !!user,
  };
}