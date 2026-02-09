import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Car } from "lucide-react";
import { id } from "zod/v4/locales";
import Image from 'next/image';
import ArcjetLogo from '@/public/arcjet.jpg'
import InngestLogo from '@/public/inngest-locale.png'
import { auth } from "@/app/utils/auth";
import { CreateJobForm } from "@/components/forms/onboarding/CreateJobForm";
import { prisma } from "@/app/utils/db";

import { requireUser } from "@/app/utils/requireUser";
import { redirect } from "next/navigation";

const companies = [
    {id: 0, name: 'Arcjet', logo: ArcjetLogo},
    {id: 1, name: 'Inngest', logo: InngestLogo},
    {id: 2, name: 'Arcjet', logo: ArcjetLogo},
    {id: 3, name: 'Inngest', logo: InngestLogo},
    {id: 4, name: 'Arcjet', logo: ArcjetLogo},
    {id: 5, name: 'Inngest', logo: InngestLogo},
];

const testimonials = [
    {
        quote: "Hiring top talent has never been easier thanks to JobPrince. The platform's intuitive interface and extensive candidate pool made our recruitment process seamless and efficient.",
        author: "Sarah Chen",
        position: "HR Manager at TechSolutions"
    },
    {
        quote: "As a job seeker, JobPrince provided me with unparalleled access to exciting career opportunities. The personalized job recommendations and user-friendly application process helped me land my dream job in no time.",
        author: "David Lee",
        position: "Software Engineer at Innovatech",
    },
    {
        quote: "JobPrince has revolutionized the way we approach hiring. The platform's advanced filtering options and candidate matching algorithms ensured that we found the perfect fit for our team quickly and efficiently.",
        author: "Emily Davis",
        position: "Talent Acquisition Specialist at CreativeWorks",
    },
];

const stats = [
    {
        id: 0, value: '10K+', label: 'Monthly active job seekers' 
    },
    { id: 1, value: '48h', label: 'Average time to hire' },
    { id: 2, value: '95%', label: 'Employer satisfaction rate' },
    { id: 3, value: '500+', label: 'Companies hiring through JobPrince' },
];

async function getCompany(userId: string) {
    const data = await prisma.company.findUnique({
        where: {
            userId: userId,
        },
        select: {
            name: true,
            location: true,
            about: true,
            logo: true,
            xAccount: true,
            website: true,
        },
    });

    if(!data) {
        return redirect("/");
    }
    return data;
}

export default async function PostJobPage() {
    const session = await requireUser();
    const data = await getCompany(session.id as string);
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-5 ">
            <CreateJobForm companyLocation={data.location} companyName={data.name} companyAbout={data.about} companyLogo={data.logo} companyWebsite={data.website} companyXAccount={data.xAccount} />
            <div className="col-span-1">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl">Trusted by Industry Leaders</CardTitle>
                        <CardDescription>Join thounsands of companies hiring top talent</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Company Logos*/}

                        <div className="grid grid-cols-3 gap-4">
                            {companies.map((company) => (
                                <div key={company.id} >
                                    <Image src={company.logo} alt={company.name} width={80} height={80} className="rounded-lg opacity-75 transition-opacity hover:opacity-100"/>
                                </div>
                            ))}

                        </div>

                        <div className="space-y-4">
                            {testimonials.map((testimonial, index) => (
                                <blockquote key={index} className="border-l-2 border-primary pl-4">
<p className="text-sm text-muted-foreground italic">"{testimonial.quote}"

</p>
<footer className="mt-2 text-sm font-medium">
    - {testimonial.author}, {testimonial.position}
</footer>
                                </blockquote>
                            )
                            )}

                        </div>

                        {/*we will render stats here*/}

                        <div className="grid grid-cols-2 gap-4">
                            {stats.map((stat) => (
                                <div key={stat.id} className="rounded-lg bg-muted p-4">
                                    <h4 className="text-2xl font-bold">{stat.value}</h4>
                                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                                </div>
                                ))}
                        </div>
                    </CardContent>
                </Card>

            </div>

        </div>
    )
}