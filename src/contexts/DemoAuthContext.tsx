import React, { createContext, useContext } from 'react';

interface AuthContextType {
  user: { id: string; email: string } | null;
  session: any;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<any>;
  updateEmail: (email: string) => Promise<any>;
  updatePassword: (password: string) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Export useAuth so components can import from either file
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

// Also export as AuthProvider so it matches the old import name
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Demo user with owner email
  const user = {
    id: 'demo-owner-id',
    email: 'webprofitsninja@gmail.com'
  };

  const value: AuthContextType = {
    user,
    session: null,
    loading: false,
    signUp: async () => ({ data: null, error: null }),
    signIn: async () => ({ data: null, error: null }),
    signOut: async () => {},
    resetPassword: async () => ({ data: null, error: null }),
    updateEmail: async () => ({ data: null, error: null }),
    updatePassword: async () => ({ data: null, error: null }),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const DemoAuthProvider = AuthProvider;
