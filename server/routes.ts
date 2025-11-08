import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { invoiceSchema, type InvoiceResponse } from "@shared/schema";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function registerRoutes(app: Express): Promise<Server> {
  // Stripe invoice creation endpoint
  app.post("/api/create-invoice", async (req, res) => {
    try {
      // Validate request body
      const validation = invoiceSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({
          success: false,
          error: validation.error.errors[0].message,
        });
      }

      const { clientName, clientEmail, serviceDescription, amount } = validation.data;

      // Step 1: Create or retrieve customer
      const customers = await stripe.customers.list({
        email: clientEmail,
        limit: 1,
      });

      let customer;
      if (customers.data.length > 0) {
        customer = customers.data[0];
      } else {
        customer = await stripe.customers.create({
          name: clientName,
          email: clientEmail,
        });
      }

      // Step 2: Create invoice
      const invoice = await stripe.invoices.create({
        customer: customer.id,
        collection_method: "send_invoice",
        days_until_due: 30,
      });

      // Step 3: Add invoice item
      await stripe.invoiceItems.create({
        customer: customer.id,
        invoice: invoice.id,
        amount: Math.round(amount * 100),
        currency: "usd",
        description: serviceDescription,
      });

      // Step 4: Finalize invoice
      const finalizedInvoice = await stripe.invoices.finalizeInvoice(invoice.id);

      // Step 5: Send the invoice
      await stripe.invoices.sendInvoice(finalizedInvoice.id);

      const response: InvoiceResponse = {
        success: true,
        invoiceUrl: finalizedInvoice.hosted_invoice_url || undefined,
        invoiceId: finalizedInvoice.id,
      };

      res.json(response);
    } catch (error: any) {
      console.error("Error creating invoice:", error);
      const response: InvoiceResponse = {
        success: false,
        error: error.message || "Failed to create invoice",
      };
      res.status(500).json(response);
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
