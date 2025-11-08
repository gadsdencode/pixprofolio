import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { invoiceSchema, type InvoiceResponse, insertContactInquirySchema } from "@shared/schema";
import { storage } from "./storage";

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

      // Step 1: Create or retrieve customer in database
      let dbClient = await storage.getClientByEmail(clientEmail);
      
      // Step 2: Create or retrieve Stripe customer
      const customers = await stripe.customers.list({
        email: clientEmail,
        limit: 1,
      });

      let stripeCustomer;
      if (customers.data.length > 0) {
        stripeCustomer = customers.data[0];
      } else {
        stripeCustomer = await stripe.customers.create({
          name: clientName,
          email: clientEmail,
        });
      }

      // Step 3: Save client to database if new
      if (!dbClient) {
        dbClient = await storage.createClient({
          name: clientName,
          email: clientEmail,
          stripeCustomerId: stripeCustomer.id,
        });
      } else if (!dbClient.stripeCustomerId) {
        // Update Stripe customer ID if missing
        dbClient = await storage.updateClientStripeId(dbClient.id, stripeCustomer.id);
      }

      // Step 4: Create Stripe invoice
      const stripeInvoice = await stripe.invoices.create({
        customer: stripeCustomer.id,
        collection_method: "send_invoice",
        days_until_due: 30,
      });

      // Step 5: Add invoice item
      await stripe.invoiceItems.create({
        customer: stripeCustomer.id,
        invoice: stripeInvoice.id,
        amount: Math.round(amount * 100),
        currency: "usd",
        description: serviceDescription,
      });

      // Step 6: Finalize invoice
      const finalizedInvoice = await stripe.invoices.finalizeInvoice(stripeInvoice.id);

      // Step 7: Send the invoice
      await stripe.invoices.sendInvoice(finalizedInvoice.id);

      // Step 8: Save invoice to database
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 30);

      await storage.createInvoice({
        clientId: dbClient.id,
        stripeInvoiceId: finalizedInvoice.id,
        amount: amount.toString(),
        currency: "usd",
        description: serviceDescription,
        status: "sent",
        hostedInvoiceUrl: finalizedInvoice.hosted_invoice_url || null,
        dueDate,
      });

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

  // Get all invoices
  app.get("/api/invoices", async (req, res) => {
    try {
      const invoices = await storage.getAllInvoices();
      res.json(invoices);
    } catch (error: any) {
      console.error("Error fetching invoices:", error);
      res.status(500).json({ error: error.message || "Failed to fetch invoices" });
    }
  });

  // Contact form submission endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      const validation = insertContactInquirySchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({
          success: false,
          error: validation.error.errors[0].message,
        });
      }

      const inquiry = await storage.createContactInquiry(validation.data);
      res.json({ success: true, inquiry });
    } catch (error: any) {
      console.error("Error saving contact inquiry:", error);
      res.status(500).json({ success: false, error: error.message || "Failed to save contact inquiry" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
