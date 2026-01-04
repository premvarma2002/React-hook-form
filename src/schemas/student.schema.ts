import { z } from "zod";

export const studentSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),

  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),

  mobile: z.string().regex(/^[6-9]\d{9}$/, "Invalid Indian mobile number"),

  dob: z.string().min(1, "Date of birth is required"),

  gender: z.enum(["male", "female", "other"]),

  course: z.string().min(1, "Please select a course"),

  address: z.string().min(10, "Address must be at least 10 characters"),

  terms: z.literal(true).refine(() => true, {
    message: "You must accept terms",
  }),
});

export type StudentFormData = z.infer<typeof studentSchema>;
