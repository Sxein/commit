import { useNavigate } from "react-router-dom";
import { register } from "@/services/api";

import { Input } from "@/components/ui/input";  

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
import AuthCard from "@/components/AuthCard";

const formSchema = z.object({
    email: z.email({message: "Please enter a valid email."}),
    password: z.string()
        .min(8, { message: "Password must be at least 8 characters long." })
        .max(100, { message: "Password must not exceed 100 characters long."})
        .regex(/[A-Z]/, { message: "Must contain at least one uppercase letter." })
        .regex(/[a-z]/, { message: "Must contain at least one lowercase letter." })
        .regex(/[0-9]/, { message: "Must contain at least one number." })
        .regex(/[^A-Za-z0-9]/, { message: "Must contain at least one special character." }),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Password do not match",
    path: ["confirmPassword"], 
})
export default function Register() {

    const navigate = useNavigate();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver :  zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: ""
        }
    });

    const onSubmit = async (input: z.infer<typeof formSchema>) => {
        try {
            const {email, password } = input
            await register(email, password);

            toast.success("Register Successfully! Please Sign In.", {position: "top-center", style:{background: 'green', color: 'white'}});
            navigate('/login');
            
        } catch (error) {
            console.error('Error registering', error);
            toast.error("Failed to Register", {position: "top-center", style: {background: 'red', color: 'white'}});
        }
    };

    return (
        <div className = "flex min-h-screen items-center justify-center">
            <AuthCard
            title = "Register for an account"
            description="Enter your details below to create an account"
            actionText="Log In"
            actionRoute={()=>navigate('/login')}
            submitText="Register"
            formType="register-form"
            >
                <form id="register-form" onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <Controller
                            name="email"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="register-form-email">
                                        Email
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="register-form-email"
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
                                    <FieldLabel htmlFor="register-form-password">
                                        Password
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="register-form-password"
                                        type="password"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Enter your password"
                                        autoComplete="new-password"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                        <Controller
                            name="confirmPassword"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="register-form-confirm-password">
                                        Confirm your password
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="register-form-confirm-password"
                                        type="password"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Enter your password"
                                        autoComplete="new-password"
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