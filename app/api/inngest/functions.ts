import { inngest } from "@/app/utils/inngest";
import { prisma } from "@/app/utils/db";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendPeriodicJobEmails = inngest.createFunction(
    { id: "send-periodic-job-emails" },
    { event: "jobseeker/onboarded" },
    async ({ event, step }: { event: any; step: any }) => {
        const { userId, email } = event.data;

        for (let i = 0; i < 15; i++) {
            await step.sleep("2d-wait", "2 days");

            const recentJobs = await step.run("fetch-recent-jobs", async () => {
                return await prisma.jobPost.findMany({
                    where: {
                        status: "PUBLISHED",
                    },
                    select: {
                        id: true,
                        jobTitle: true,
                        salaryFrom: true,
                        salaryTo: true,
                        employmentType: true,
                        location: true,
                        company: {
                            select: {
                                name: true,
                                logo: true,
                            },
                        },
                    },
                    orderBy: {
                        createdAt: "desc",
                    },
                    take: 3,
                });
            });

            if (recentJobs.length > 0) {
                await step.run("send-email", async () => {
                    await resend.emails.send({
                        from: "JobPrince <onboarding@resend.dev>",
                        to: email,
                        subject: "Latest Job Opportunities for You!",
                        html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Hello!</h2>
                <p>Here are the latest job opportunities on JobPrince that might interest you:</p>
                <div style="margin-top: 20px;">
                  ${recentJobs
                                .map(
                                    (job: any) => `
                    <div style="border: 1px solid #e2e8f0; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                      <h3 style="margin: 0;">${job.jobTitle}</h3>
                      <p style="color: #64748b; margin: 5px 0;">${job.company.name} • ${job.location}</p>
                      <p style="margin: 5px 0;">${job.employmentType}</p>
                      <a href="${process.env.NEXT_PUBLIC_URL}/job/${job.id}" style="display: inline-block; background-color: #000; color: #fff; padding: 8px 16px; border-radius: 4px; text-decoration: none; margin-top: 10px;">View Job</a>
                    </div>
                  `
                                )
                                .join("")}
                </div>
                <p style="margin-top: 20px;">Good luck with your search!</p>
                <p>Best regards,<br/>The JobPrince Team</p>
              </div>
            `,
                    });
                });
            }
        }
    }
);
