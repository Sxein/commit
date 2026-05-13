import { useQueryClient, useQuery } from "@tanstack/react-query"
import { getMe, logout } from "@/services/api";


export const useAuth = () => {
    const queryClient = useQueryClient();

    const { data: user, isPending } =  useQuery({
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
    return { user, isPending, logoutUser };
}