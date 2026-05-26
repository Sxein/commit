import { useNavigate } from "react-router-dom";
import { register } from "@/services/api";
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
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import z from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

const formSchema = z.object({
    email: z.email({message: "Please enter a valid email."}),
    password: z.string()
        .min(8, { message: "Password must be at least 8 characters long." })
        .max(100, { message: "Password must not exceed 100 characters long."})
        .regex(/[A-Z]/, { message: "Must contain at least one uppercase letter." })
        .regex(/[a-z]/, { message: "Must contain at least one lowercase letter." })
        .regex(/[0-9]/, { message: "Must contain at least one number." })
        .regex(/[^A-Za-z0-9]/, { message: "Must contain at least one special character." })
})
export default function Register() {

    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver :  zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    });

    const onSubmit = async (input: z.infer<typeof formSchema>) => {
        try {
            const {email, password } = input
            const data = await register(email, password);

            toast.success("Register Successfully! Please Sign In.", {position: "top-center", style:{background: 'green', color: 'white'}});
            navigate('/login');
            
        } catch (error) {
            console.error('Error registering', error);
            toast.error("Failed to Register", {position: "top-center", style: {background: 'red', color: 'white'}});
        }
    };

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
                        Register
                    </Button>
                </div>
            </CardFooter>
            </Card>
        </div>
  )
}