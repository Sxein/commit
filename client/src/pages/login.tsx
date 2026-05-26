import { useNavigate } from "react-router-dom";
import { login } from "../services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQueryClient } from "@tanstack/react-query"; 
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import z from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

const formSchema =  z.object({
    email: z.email({message: "Enter a valid email"}),
    password: z.string().min(1, {message:"Please enter your password"} )
})
export default function Login() {

    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    })

    const onSubmit = async (input: z.infer<typeof formSchema>) => {
        try {
            const {email, password } = input
            const data = await login(email, password);
            queryClient.setQueryData(['AuthUser'], data);
            toast.success("Successfully logged in", {position: "top-center", style:{background: 'green', color: 'white'}});
            navigate('/');
            
        } catch (error) {
            console.error('Error Logging in:', error);
            toast.error("Failed to login", {position: "top-center", style: {background: 'red', color: 'white'}});
        }
    }
    return (
        <div className = "flex min-h-screen items-center justify-center">
            <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle>Login to your account</CardTitle>
                <CardDescription>
                Enter your email below to login to your account
                </CardDescription>
                <CardAction>
                <Button variant="link" onClick={() => navigate('/register')}>
                    Sign Up
                </Button>
                </CardAction>
            </CardHeader>
            <CardContent>
                <form id="login-form" onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <Controller
                            name="email"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="login-form-email">
                                        Email
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="login-form-email"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Enter your email"
                                        autoComplete="email"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                        
                        <Controller
                            name="password"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="login-form-password">
                                        Password
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="login-form-password"
                                        type="password"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Enter your password"
                                        autoComplete="current-password"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                    </FieldGroup>
                </form>
            </CardContent>
            
            <CardFooter>
                <div className="w-full">
                    <Button type="submit" form="login-form" className="w-full">
                        Log in
                    </Button>
                </div>
            </CardFooter>
            </Card>
        </div>
  )
}