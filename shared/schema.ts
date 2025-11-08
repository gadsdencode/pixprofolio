import { z } from "zod";

export const invoiceSchema = z.object({
  clientName: z.string().min(2, "Client name must be at least 2 characters"),
  clientEmail: z.string().email("Please enter a valid email address"),
  serviceDescription: z.string().min(10, "Description must be at least 10 characters"),
  amount: z.number().positive("Amount must be a positive number"),
});

export type InvoiceRequest = z.infer<typeof invoiceSchema>;

export interface InvoiceResponse {
  success: boolean;
  invoiceUrl?: string;
  invoiceId?: string;
  error?: string;
}
