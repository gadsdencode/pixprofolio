import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import bcrypt from "bcryptjs";
import passport from "./auth";
import { isAuthenticated } from "./auth";
import { loginSchema, registerSchema, invoiceSchema, type InvoiceResponse, insertContactInquirySchema } from "@shared/schema";
import { z } from "zod";
import { storage } from "./storage";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/register", async (req, res) => {
    try {
      // Only validate the fields we need on the server
      const serverRegisterSchema = z.object({
        name: z.string().min(2, "Name must be at least 2 characters"),
        email: z.string().email("Please enter a valid email address"),
        password: z.string()
          .min(8, "Password must be at least 8 characters")
          .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
          .regex(/[a-z]/, "Password must contain at least one lowercase letter")
          .regex(/[0-9]/, "Password must contain at least one number"),
      });

      const validation = serverRegisterSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({
          success: false,
          error: validation.error.errors[0].message,
        });
      }

      const { name, email, password } = validation.data;

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: "An account with this email already exists",
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user (default to client role for new registrations)
      const user = await storage.createUser({
        name,
        email,
        password: hashedPassword,
        role: "client", // New users are clients by default
        provider: "local",
      });

      res.json({ 
        success: true, 
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        }
      });
    } catch (error: any) {
      console.error("Registration error:", error);
      res.status(500).json({ 
        success: false, 
        error: error.message || "Failed to create account" 
      });
    }
  });

  app.post("/api/login", (req, res, next) => {
    const validation = loginSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: validation.error.errors[0].message,
      });
    }

    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) {
        return res.status(500).json({ 
          success: false, 
          error: "Authentication error" 
        });
      }

      if (!user) {
        return res.status(401).json({ 
          success: false, 
          error: info?.message || "Invalid email or password" 
        });
      }

      req.logIn(user, (err) => {
        if (err) {
          return res.status(500).json({ 
            success: false, 
            error: "Failed to establish session" 
          });
        }

        // Ensure session is saved before responding
        req.session.save((saveErr) => {
          if (saveErr) {
            console.error("Failed to save session:", saveErr);
            return res.status(500).json({ 
              success: false, 
              error: "Failed to save session" 
            });
          }

          res.json({ 
            success: true, 
            user: {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
            }
          });
        });
      });
    })(req, res, next);
  });

  app.post("/api/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ 
          success: false, 
          error: "Failed to logout" 
        });
      }
      
      // Destroy session to clean up database
      req.session.destroy((destroyErr) => {
        if (destroyErr) {
          console.error("Failed to destroy session:", destroyErr);
        }
        res.json({ success: true });
      });
    });
  });

  app.get("/api/auth/status", (req, res) => {
    if (req.isAuthenticated()) {
      res.json({ 
        authenticated: true,
        user: {
          id: (req.user as any).id,
          email: (req.user as any).email,
          name: (req.user as any).name,
          role: (req.user as any).role,
          provider: (req.user as any).provider,
          profilePicture: (req.user as any).profilePicture,
        }
      });
    } else {
      res.json({ authenticated: false });
    }
  });

  // Google OAuth routes
  app.get("/api/auth/google", 
    passport.authenticate("google", { scope: ["profile", "email"] })
  );

  app.get("/api/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/login?error=oauth_failed" }),
    (req, res) => {
      // Successful authentication, redirect based on role
      const user = req.user as any;
      if (user?.role === "owner") {
        res.redirect("/owner-dashboard");
      } else {
        res.redirect("/client-dashboard");
      }
    }
  );

  // Stripe invoice creation endpoint (protected)
  app.post("/api/create-invoice", isAuthenticated, async (req, res) => {
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

  // Get all invoices (protected)
  app.get("/api/invoices", isAuthenticated, async (req, res) => {
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

  // Get all portfolio items (public endpoint)
  app.get("/api/portfolio", async (req, res) => {
    try {
      const items = await storage.getAllPortfolioItems();
      res.json(items);
    } catch (error: any) {
      console.error("Error fetching portfolio items:", error);
      res.status(500).json({ error: error.message || "Failed to fetch portfolio items" });
    }
  });

  // Get all contact inquiries for owner
  app.get("/api/contact-inquiries", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      if (user?.role !== "owner") {
        return res.status(403).json({ error: "Access denied" });
      }
      const inquiries = await storage.getAllContactInquiries();
      res.json(inquiries);
    } catch (error: any) {
      console.error("Error fetching contact inquiries:", error);
      res.status(500).json({ error: error.message || "Failed to fetch contact inquiries" });
    }
  });

  // Get client's own project requests
  app.get("/api/client/requests", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      if (user?.role !== "client") {
        return res.status(403).json({ error: "Access denied" });
      }
      const requests = await storage.getContactInquiriesByEmail(user.email);
      res.json(requests);
    } catch (error: any) {
      console.error("Error fetching client requests:", error);
      res.status(500).json({ error: error.message || "Failed to fetch requests" });
    }
  });

  // Get client's portfolio items (placeholder for now)
  app.get("/api/client/portfolio", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      if (user?.role !== "client") {
        return res.status(403).json({ error: "Access denied" });
      }
      // For now, return empty array - this would be populated with actual portfolio items
      res.json([]);
    } catch (error: any) {
      console.error("Error fetching portfolio:", error);
      res.status(500).json({ error: error.message || "Failed to fetch portfolio" });
    }
  });

  // Get client's invoices
  app.get("/api/client/invoices", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      if (user?.role !== "client") {
        return res.status(403).json({ error: "Access denied" });
      }
      const invoices = await storage.getInvoicesByEmail(user.email);
      res.json(invoices);
    } catch (error: any) {
      console.error("Error fetching client invoices:", error);
      res.status(500).json({ error: error.message || "Failed to fetch invoices" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
