import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('marketEdgeUser');
    const savedPremium = localStorage.getItem('marketEdgePremium');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    if (savedPremium) {
      setIsPremium(JSON.parse(savedPremium));
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userData = {
        id: Date.now(),
        name: email.split('@')[0],
        email,
        investmentPortfolio: {
          totalValue: 50000,
          todayChange: 1250.50,
          todayChangePercent: 2.56
        }
      };
      
      setUser(userData);
      localStorage.setItem('marketEdgeUser', JSON.stringify(userData));
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const register = async (name, email, password) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userData = {
        id: Date.now(),
        name,
        email,
        investmentPortfolio: {
          totalValue: 0,
          todayChange: 0,
          todayChangePercent: 0
        }
      };
      
      setUser(userData);
      localStorage.setItem('marketEdgeUser', JSON.stringify(userData));
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    setIsPremium(false);
    localStorage.removeItem('marketEdgeUser');
    localStorage.removeItem('marketEdgePremium');
  };

  const upgradeToPremium = () => {
    setIsPremium(true);
    localStorage.setItem('marketEdgePremium', 'true');
  };

  const value = {
    user,
    isPremium,
    isLoading,
    login,
    register,
    logout,
    upgradeToPremium
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}