import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';

import GagglApi from './services/gaggl-api';
import SessionService from './services/session';

interface AuthContextType {
  user: User | null;
  signIn: (email: string, password: string, callback: VoidFunction) => void;
  signOut: (callback: VoidFunction) => void;
  signUp: (signUpRequest: SignUpRequest, callback: VoidFunction) => void;
}

export const AuthContext = React.createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(SessionService.getCurrentUser());

  const signIn = async (email: string, password: string, callback: VoidFunction) => {
    const { data: session } = await GagglApi.signIn(email, password);
    SessionService.saveSession(session);
    setUser(SessionService.getCurrentUser());
    callback();
  };

  const signOut = async (callback: VoidFunction) => {
    await GagglApi.signOut();
    SessionService.removeSession();
    setUser(null);
    callback();
  };

  const signUp = async (signUpRequest: SignUpRequest, callback: VoidFunction) => {
    const { data: session } = await GagglApi.signUp(signUpRequest);
    SessionService.saveSession(session);
    setUser(SessionService.getCurrentUser());
    callback();
  };

  const value = { user, signIn, signOut, signUp };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return React.useContext(AuthContext);
}

export function RequireAuth({ children }: { children: JSX.Element }) {
  const auth = useAuth();
  const location = useLocation();
  if (!auth.user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}
