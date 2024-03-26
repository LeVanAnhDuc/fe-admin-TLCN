import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
    isLoggedIn: boolean;
    setLogin: (userNameUser: string, tokenType: string, accessToken: string) => void;
    setLogout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const savedIsLogin = localStorage.getItem('isLogin');

    const [isLoggedIn, setLoggedIn] = useState<boolean>(savedIsLogin ? JSON.parse(savedIsLogin) : false);

    const setLogin = (userNameUser: string, tokenType: string, accessToken: string) => {
        setLoggedIn(true);
        localStorage.setItem('isLogin', JSON.stringify(true));
        localStorage.setItem('tokenType', tokenType);
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('userNameUser', userNameUser);
    };

    const setLogout = () => {
        setLoggedIn(false);
        localStorage.setItem('isLogin', JSON.stringify(false));
        localStorage.removeItem('tokenType');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userNameUser');
    };

    return <AuthContext.Provider value={{ isLoggedIn, setLogin, setLogout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw Error;
    }
    return context;
};
