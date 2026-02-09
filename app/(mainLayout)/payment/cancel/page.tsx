import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { XCircle } from "lucide-react";
import Link from "next/link";

export default function PaymentCancelPage() {
    return (
        <div className="min-h-[80vh] w-full flex items-center justify-center">
            <Card className="max-w-md w-full text-center">
                <CardHeader>
                    <div className="flex justify-center mb-4">
                        <XCircle className="size-16 text-red-500" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Payment Cancelled</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        The payment process was cancelled. No charges were made, and your job post remains in draft.
                    </p>
                </CardContent>
                <CardFooter>
                    <Button className="w-full" asChild>
                        <Link href="/">Back to Home</Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
