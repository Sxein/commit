import { useNavigate } from "react-router-dom";
import { login } from "../services/api";
import { Input } from "@/components/ui/input";
import { useQueryClient } from "@tanstack/react-query"; 
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
import AuthCard from "@/components/AuthCard";

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
            toast.success("Successfully logged in", {position: "top-center"});
            navigate('/');
            
        } catch (error) {
            console.error('Error Logging in:', error);
            toast.error("Incorrect email or password!", {position: "top-center"});
        }
    }
    return (
        <div className="flex min-h-screen items-center justify-center">
            <AuthCard
                title="Login to your account"
                description="Enter your email below to login to your account"
                actionText="Sign Up"
                actionRoute={() => navigate('/register')}
                submitText="Log in"
                formType="login-form"
            >
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
            </AuthCard>
        </div>
  )
}