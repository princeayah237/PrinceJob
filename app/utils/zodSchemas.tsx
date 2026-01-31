import { z } from 'zod';

export const companySchema = z.object({
    name: z.string().min(2, "Company name must be at least 2 characters long"),
    location: z.string().min(1, "Location must be defined"),
    about: z.string().min(10, "please provide some information about your company"),
    logo: z.string().min(1, "please upoad a logo"),
    website: z.string().url("please enter a valide url"),
    xAccount: z.string().optional(),
});

export const jobSeekerSchema = z.object({
name: z.string().min(2, "Name must be at least 2 characters"),
about: z.string().min(10, "please provide more information about your self"),
resume: z.string().min(1, "please upload your resume"),
});

export const JobSchema = z.object({
   jobTitle: z.string().min(2, "Job title must be atlease 2 charackters long"),
   employmentType: z.string().min(1, "please select an employment type"),
   location: z.string().min(1, "please select location"),
   salaryFrom: z.number().min(1, "Salary from is required"),
   salaryTo: z.number().min(1, "Salary To is required"),
   JobDescription: z.string().min(1, "Job description is required"),
   listingDuration: z.number().min(1, "Listing duration is required"),
   benefits: z.array(z.string()).min(1, "Please select at least one benefit"),
   companyName: z.string().min(1, "Company name is required"),
   companyLocation: z.string().min(1, "Company Location is required"),
   companyAbout: z.string().min(10, "Company description is required"),
   companyLogo: z.string().min(1, "companyLogo is required"),
   companyWebsite: z.string().min(1, "Company website is required"),
   companyXAccount: z.string().optional(),

});
