import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkPremium = useCallback(async (currentSession) => {
    if (!currentSession) {
      setIsPremium(false);
      return false;
    }
    const { data, error } = await supabase.rpc('has_active_premium');
    const value = !error && data === true;
    setIsPremium(value);
    return value;
  }, []);

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return;
      setSession(data.session);
      await checkPremium(data.session);
      if (active) setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      // On sort du callback avant d'appeler Supabase, pour eviter un blocage connu.
      setTimeout(() => {
        if (active) checkPremium(newSession);
      }, 0);
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, [checkPremium]);

  const refreshPremium = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    return checkPremium(data.session);
  }, [checkPremium]);

  const signInWithEmail = useCallback(async (email) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/connexion`,
        shouldCreateUser: true,
      },
    });
    return { error };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setIsPremium(false);
  }, []);

  const value = {
    session,
    user: session ? session.user : null,
    isPremium,
    loading,
    signInWithEmail,
    signOut,
    refreshPremium,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit etre utilise dans un AuthProvider');
  }
  return context;
}
