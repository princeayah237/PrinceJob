"use server"

import { requireUser } from "./utils/requireUser"
import { z } from 'zod'
import { companySchema, JobSchema, jobSeekerSchema } from "./utils/zodSchemas";
import { prisma } from "./utils/db";
import { redirect } from "next/navigation";
import arcjet, { detectBot, shield } from "./utils/arcjet";
import { request } from "@arcjet/next";


const aj = arcjet.withRule(
    shield({
        mode: "LIVE",
    })
)
    .withRule(
        detectBot({
            mode: "LIVE",
            allow: []
        })
    );
import { inngest } from "./utils/inngest";


export async function createCompany(data: z.infer<typeof companySchema>) {
    const session = await requireUser();

    const req = await request();

    const decision = await aj.protect(req);

    if (decision.isDenied()) {
        throw new Error("Forbidden");
    }

    const validateData = companySchema.parse(data);

    await prisma.user.update({
        where: {
            id: session.id,
        },
        data: {
            onboardingCompleted: true,
            userType: 'COMPANY',
            Company: {
                create: {
                    ...validateData,
                },
            },
        },
    });

    return redirect("/");
}

export async function createJobSeeker(data: z.infer<typeof
    jobSeekerSchema>) {
    const user = await requireUser();

    const req = await request();

    const decision = await aj.protect(req);

    if (decision.isDenied()) {
        throw new Error("Forbidden");
    }

    const validateData = jobSeekerSchema.parse(data);

    await prisma.user.update({
        where: {
            id: user.id as string,
        },
        data: {
            onboardingCompleted: true,
            userType: "JOB_SEEKER",
            JobSeeker: {
                create: {
                    ...validateData,
                },
            },

        },
    });

    await inngest.send({
        name: "jobseeker/onboarded",
        data: {
            userId: user.id,
            email: user.email,
        },
    });

    return redirect("/");
}

export async function createJob(data: z.infer<typeof JobSchema>) {
    const user = await requireUser();

    const req = await request();

    const decision = await aj.protect(req);

    if (decision.isDenied()) {
        throw new Error("Forbidden");
    }

    const validateData = JobSchema.parse(data);

    const company = await prisma.company.findUnique({
        where: {
            userId: user.id
        },
        select: {
            id: true
        }
    })

    if (!company?.id) {
        return redirect("/");
    }

    const job = await prisma.jobPost.create({
        data: {
            JobDescription: validateData.JobDescription,
            jobTitle: validateData.jobTitle,
            employmentType: validateData.employmentType,
            location: validateData.location,
            salaryFrom: validateData.salaryFrom,
            salaryTo: validateData.salaryTo,
            listingDuration: validateData.listingDuration,
            benefits: validateData.benefits,
            companyId: company.id,
        },
    });

    return redirect(`/payment?jobId=${job.id}`);
}

export async function validatePayment(jobId: string) {
    const user = await requireUser();

    const job = await prisma.jobPost.findUnique({
        where: {
            id: jobId,
        },
        select: {
            company: {
                select: {
                    userId: true,
                },
            },
        },
    });

    if (!job || job.company.userId !== user.id) {
        throw new Error("Unauthorized or Job not found");
    }

    await prisma.jobPost.update({
        where: {
            id: jobId,
        },
        data: {
            status: "PUBLISHED",
        },
    });

    return redirect("/payment/success");
}
