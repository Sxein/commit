import { useAuth } from "@/context/AuthContext"
import { Navigate } from "react-router-dom"

export default function PublicRoute({ children } : { children: React.ReactNode }) {
    const { user } = useAuth();
    if (user) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
}