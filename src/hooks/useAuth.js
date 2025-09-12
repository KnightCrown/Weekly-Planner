import { useState, useEffect } from 'react';
import { onAuthStateChange, signOut, getCurrentUser } from '../lib/firebaseAuth';

/**
 * Custom hook for managing authentication state
 * @returns {Object} Authentication state and methods
 */
export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Seed with current user if available
    const current = getCurrentUser();
    if (current) {
      setUser(current);
    }

    // Subscribe to Firebase Auth state changes
    const unsubscribe = onAuthStateChange((firebaseUser) => {
      setUser(firebaseUser || null);
      setLoading(false);
    });

    return () => {
      try { unsubscribe && unsubscribe(); } catch (_) {}
    };
  }, []);

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
    signOut: handleSignOut,
    isAuthenticated: !!user,
  };
}