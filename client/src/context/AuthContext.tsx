import { createContext, useContext, useState, useEffect } from 'react';
import { getMe } from '@/services/api';
import { logout } from '@/services/api';

interface User {
    userId: number;
    email: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    logoutUser: () => Promise<void>;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const data = await getMe();
                setUser(data);
            }
            catch (error) {
                console.error('Error checking authentication:', error);
                setUser(null);
            }
            finally {
                setIsLoading(false);
            }
        };
        checkAuth();
    }, []);

    const logoutUser = async () => {
        try {
            await logout();
            setUser(null);
        } catch (error) {
            console.error('Error logging out:', error);
            throw error;
        }
    };

    return (
        <AuthContext value={{ user, isLoading, setUser, logoutUser }}>
            {children}
        </AuthContext>
    );
}
// Custom hook to use the AuthContext
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}