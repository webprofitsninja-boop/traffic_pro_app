import React, { createContext, useContext } from 'react';

interface AppContextType {
  // Add any app-level state here if needed
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

export const DemoAppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const value: AppContextType = {};

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
