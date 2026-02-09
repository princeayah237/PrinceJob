import { serve } from "inngest/next";
import { inngest } from "@/app/utils/inngest";
import { sendPeriodicJobEmails } from "./functions";

export const { GET, POST, PUT } = serve({
    client: inngest,
    functions: [sendPeriodicJobEmails],
});
