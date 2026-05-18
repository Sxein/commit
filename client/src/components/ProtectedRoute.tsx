import { useAuth } from "@/hooks/useAuth";
import { Navigate } from 'react-router-dom';
import { Loader2 } from "lucide-react";

export default function ProtectedRoute({ children } : { children: React.ReactNode }) {
    const { user, isPending } = useAuth();
    if (isPending) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-slate-500" />
            </div>
        );
    }
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    
    return <>{children}</>;
}