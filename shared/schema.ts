import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, decimal, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Users table for authentication (supports both local and OAuth)
export const users = pgTable("users", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  email: text("email").notNull().unique(),
  password: text("password"), // Hashed password (optional for OAuth users)
  name: text("name").notNull(),
  role: text("role").notNull().default("admin"), // admin, photographer
  provider: text("provider").notNull().default("local"), // local, google
  providerId: text("provider_id"), // OAuth provider's user ID
  profilePicture: text("profile_picture"), // URL to profile picture
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users, {
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters").optional(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  provider: z.string().optional(),
  providerId: z.string().optional(),
  profilePicture: z.string().optional(),
}).pick({
  email: true,
  password: true,
  name: true,
  role: true,
  provider: true,
  providerId: true,
  profilePicture: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

// Login schema for authentication
export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginCredentials = z.infer<typeof loginSchema>;

// Registration schema
export const registerSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string(),
  name: z.string().min(2, "Name must be at least 2 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type RegisterCredentials = z.infer<typeof registerSchema>;

// Clients table
export const clients = pgTable("clients", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  stripeCustomerId: text("stripe_customer_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const clientsRelations = relations(clients, ({ many }) => ({
  invoices: many(invoices),
}));

export const insertClientSchema = createInsertSchema(clients, {
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
}).pick({
  name: true,
  email: true,
  stripeCustomerId: true,
});

export type Client = typeof clients.$inferSelect;
export type InsertClient = z.infer<typeof insertClientSchema>;

// Invoices table
export const invoices = pgTable("invoices", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  clientId: integer("client_id").notNull().references(() => clients.id),
  stripeInvoiceId: text("stripe_invoice_id").notNull().unique(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("usd"),
  description: text("description").notNull(),
  status: text("status").notNull().default("draft"), // draft, sent, paid, void
  hostedInvoiceUrl: text("hosted_invoice_url"),
  dueDate: timestamp("due_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const invoicesRelations = relations(invoices, ({ one }) => ({
  client: one(clients, {
    fields: [invoices.clientId],
    references: [clients.id],
  }),
}));

export const insertInvoiceSchema = createInsertSchema(invoices).pick({
  clientId: true,
  stripeInvoiceId: true,
  amount: true,
  currency: true,
  description: true,
  status: true,
  hostedInvoiceUrl: true,
  dueDate: true,
});

export type Invoice = typeof invoices.$inferSelect;
export type InsertInvoice = z.infer<typeof insertInvoiceSchema>;

// Portfolio items table
export const portfolioItems = pgTable("portfolio_items", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  title: text("title").notNull(),
  category: text("category").notNull(), // Weddings, Portraits, Landscape, Events, Commercial, Realtor/Home Photography
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  featured: integer("featured").notNull().default(0), // 0 = not featured, 1 = featured
  displayOrder: integer("display_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPortfolioItemSchema = createInsertSchema(portfolioItems).pick({
  title: true,
  category: true,
  description: true,
  imageUrl: true,
  featured: true,
  displayOrder: true,
});

export type PortfolioItem = typeof portfolioItems.$inferSelect;
export type InsertPortfolioItem = z.infer<typeof insertPortfolioItemSchema>;

// Contact inquiries table
export const contactInquiries = pgTable("contact_inquiries", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  projectType: text("project_type").notNull(), // wedding, portrait, event, commercial, realtor
  desiredDate: text("desired_date").notNull(),
  message: text("message").notNull(),
  status: text("status").notNull().default("new"), // new, contacted, converted, closed
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertContactInquirySchema = createInsertSchema(contactInquiries).pick({
  fullName: true,
  email: true,
  projectType: true,
  desiredDate: true,
  message: true,
});

export type ContactInquiry = typeof contactInquiries.$inferSelect;
export type InsertContactInquiry = z.infer<typeof insertContactInquirySchema>;

// Invoice creation schemas for API
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
