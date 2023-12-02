// AuthContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
    isLoggedIn: boolean;
    login: (userNameUser: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}
// bọc nơi chứa dữ liệu
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const savedIsLogin = localStorage.getItem('isLogin');

    const [isLoggedIn, setLoggedIn] = useState<boolean>(savedIsLogin ? JSON.parse(savedIsLogin) : false);

    const login = (userNameUser: string) => {
        // Perform your login logic here
        setLoggedIn(true);
        localStorage.setItem('isLogin', JSON.stringify(true));
        localStorage.setItem('userNameUser', userNameUser);
    };

    const logout = () => {
        // Perform your logout logic here
        setLoggedIn(false);
        localStorage.setItem('isLogin', JSON.stringify(false));
    };

    return <AuthContext.Provider value={{ isLoggedIn, login, logout }}>{children}</AuthContext.Provider>;
};
// Gọi dữ liệu muốn sài
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
