import { createContext, useState, useEffect, ReactNode } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token on page load:", token); // ✅ Debugging
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const login = (token: string) => {
    console.log("Login function called with token:", token); // ✅ Debugging
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    console.log("Logging out..."); // ✅ Debugging
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  console.log("AuthContext updated, isAuthenticated:", isAuthenticated); // ✅ Debugging

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
