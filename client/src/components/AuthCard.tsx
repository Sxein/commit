import type { ReactNode } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
interface AuthCardProps {
    title: string;
    description: string;
    actionText: string;
    actionRoute: () => void;
    submitText: string;
    formType: string;
    children: ReactNode;
}


export default function AuthCard({title, description, actionText, actionRoute, submitText, formType, children} : AuthCardProps) {
    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
                <CardAction>
                <Button variant="link" onClick={actionRoute}>
                    {actionText}
                </Button>
                </CardAction>
            </CardHeader>
            <CardContent>
                {children}
            </CardContent>
            <CardFooter>
                <div className="w-full">
                    <Button type="submit" form={formType} className="w-full">
                       {submitText}
                    </Button>
                </div>
            </CardFooter>
            </Card>
    )
}