import { createContext, useContext } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getMe } from '@/services/api';
import { logout } from '@/services/api';

interface User {
    userId: number;
    email: string;
}

interface AuthContextType {
    user: User | null;
    isPending: boolean;
    logoutUser: () => Promise<void>;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {

    const queryClient = useQueryClient();

    const { data : user, isPending} = useQuery({
        queryKey: ['AuthUser'],
        queryFn: getMe,
        retry: false, // Disable retries to handle auth errors immediately
    })

    const logoutUser = async () => {
        try {
            await logout();
            queryClient.setQueryData(['AuthUser'], null);
        } catch (error) {
            console.error('Error logging out:', error);
            throw error;
        }
    };

    if (isPending) {
        return <div className="flex h-screen items-center justify-center">Loading App...</div>;
    }

    return (
        <AuthContext value={{ user, isPending, logoutUser }}>
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