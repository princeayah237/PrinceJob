import { z } from 'zod';

export const companySchema = z.object({
    name: z.string().min(2, "Company name must be at least 2 characters long"),
    location: z.string().min(1, "Location must be defined"),
    about: z.string().min(10, "please provide some information about your company"),
    logo: z.string().min(1, "please upoad a logo"),
    website: z.string().url("please enter a valide url"),
    xAccount: z.string().optional(),
});