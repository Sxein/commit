import { useState } from "react"
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { register } from "../services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";


import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"

export default function Register() {
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const navigate = useNavigate();
    const { setUser } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const data = await register(email, password);
            setUser(data.user);
            navigate('/login');
        } catch (error) {
            console.error('Error registering:', error);
        }
    }
    return (
        <div className = "flex min-h-screen items-center justify-center">
            <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle>Register for an account</CardTitle>
                <CardDescription>
                Enter your details below to create an account
                </CardDescription>
                <CardAction>
                <Button variant="link" onClick={() => navigate('/login')}>
                    Log in
                </Button>
                </CardAction>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-6">
                    <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    </div>
                    <div className="grid gap-2">
                    <div className="flex items-center">
                        <Label htmlFor="password">Password</Label>
                    </div>
                    <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    </div>
                </div>
                <Button className="mt-6 w-full" type="submit">
                    Register
                </Button>
                </form>
            </CardContent>

            </Card>
        </div>
  )
}