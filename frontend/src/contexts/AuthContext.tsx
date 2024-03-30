// src/contexts/AuthContext.tsx
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import React, { createContext, useContext, useState } from 'react';
import { JSONPayload } from '../components/feed/CreateCommentForm';
import { useNavigate } from 'react-router-dom';
interface User {
    username: string;
    userId: string;
    token: string;
}

interface AuthContextProps {
    user: User | null;
    login: (username: string, token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be within an AuthProvider');
    }
    return context;
}

export const AuthProvider: React.FC<any> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    const login = (username: string, token: string) => {
        const userData: User = {
            username: username,
            userId: jwtDecode<JSONPayload>(token).user_id,
            token: token,
        };
        setUser(userData);
        Cookies.set('token', token, { secure: false });
    };

    const logout = () => {
        setUser(null);
        Cookies.remove('token');
    }

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}
