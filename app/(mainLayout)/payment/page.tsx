import { auth } from "@/app/utils/auth";
import { prisma } from "@/app/utils/db";
import { requireUser } from "@/app/utils/requireUser";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { redirect } from "next/navigation";
import Image from "next/image";
import { validatePayment } from "@/app/action";
import Link from "next/link";

interface iAppProps {
    searchParams: Promise<{ jobId: string }>;
}

export default async function PaymentPage({ searchParams }: iAppProps) {
    const { jobId } = await searchParams;
    const user = await requireUser();

    const job = await prisma.jobPost.findUnique({
        where: {
            id: jobId,
        },
        include: {
            company: true,
        },
    });

    if (!job || job.company.userId !== user.id) {
        return redirect("/");
    }

    const price = job.listingDuration * 1; // $1 per day

    return (
        <div className="min-h-[80vh] w-full flex items-center justify-center py-10">
            <Card className="max-w-md w-full">
                <CardHeader>
                    <CardTitle className="text-2xl">Payment Summary</CardTitle>
                    <CardDescription>
                        Review your job listing details before processing payment.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="relative size-16">
                            <Image
                                src={job.company.logo}
                                alt={job.company.name}
                                fill
                                className="rounded-lg object-contain"
                            />
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg">{job.company.name}</h3>
                            <p className="text-sm text-muted-foreground">{job.jobTitle}</p>
                        </div>
                    </div>

                    <div className="space-y-2 border-t pt-4">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Listing Duration</span>
                            <span className="font-medium">{job.listingDuration} Days</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Price per day</span>
                            <span className="font-medium">$1.00</span>
                        </div>
                        <div className="flex justify-between border-t pt-2 text-lg font-bold">
                            <span>Total Amount</span>
                            <span>${price}.00</span>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-3">
                    <form action={async () => {
                        "use server";
                        await validatePayment(jobId);
                    }} className="w-full">
                        <Button type="submit" className="w-full" size="lg">
                            Pay Now
                        </Button>
                    </form>
                    <Button variant="outline" className="w-full" asChild>
                        <Link href="/payment/cancel">Cancel Payment</Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
