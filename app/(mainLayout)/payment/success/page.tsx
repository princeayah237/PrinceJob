import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function PaymentSuccessPage() {
    return (
        <div className="min-h-[80vh] w-full flex items-center justify-center">
            <Card className="max-w-md w-full text-center">
                <CardHeader>
                    <div className="flex justify-center mb-4">
                        <CheckCircle2 className="size-16 text-green-500" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Payment Successful!</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        Your job post has been successfully processed and is now live on our platform.
                    </p>
                </CardContent>
                <CardFooter>
                    <Button className="w-full" asChild>
                        <Link href="/">Return to Dashboard</Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
