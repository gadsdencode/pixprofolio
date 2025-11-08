import { 
  users,
  clients, 
  invoices, 
  portfolioItems, 
  contactInquiries,
  type User,
  type InsertUser,
  type Client, 
  type InsertClient,
  type Invoice,
  type InsertInvoice,
  type PortfolioItem,
  type InsertPortfolioItem,
  type ContactInquiry,
  type InsertContactInquiry,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUserById(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User>;
  updateUserProvider(id: number, providerData: { provider: string; providerId: string; profilePicture?: string | null }): Promise<User>;

  // Client operations
  getClient(id: number): Promise<Client | undefined>;
  getClientByEmail(email: string): Promise<Client | undefined>;
  createClient(client: InsertClient): Promise<Client>;
  updateClientStripeId(id: number, stripeCustomerId: string): Promise<Client>;

  // Invoice operations
  getInvoice(id: number): Promise<Invoice | undefined>;
  getInvoicesByClientId(clientId: number): Promise<Invoice[]>;
  getAllInvoices(): Promise<Invoice[]>;
  createInvoice(invoice: InsertInvoice): Promise<Invoice>;
  updateInvoiceStatus(id: number, status: string): Promise<Invoice>;

  // Portfolio operations
  getAllPortfolioItems(): Promise<PortfolioItem[]>;
  getPortfolioItemsByCategory(category: string): Promise<PortfolioItem[]>;
  getFeaturedPortfolioItems(): Promise<PortfolioItem[]>;
  createPortfolioItem(item: InsertPortfolioItem): Promise<PortfolioItem>;
  updatePortfolioItem(id: number, item: Partial<InsertPortfolioItem>): Promise<PortfolioItem>;
  deletePortfolioItem(id: number): Promise<void>;

  // Contact inquiry operations
  getAllContactInquiries(): Promise<ContactInquiry[]>;
  getContactInquiry(id: number): Promise<ContactInquiry | undefined>;
  getContactInquiriesByEmail(email: string): Promise<ContactInquiry[]>;
  createContactInquiry(inquiry: InsertContactInquiry): Promise<ContactInquiry>;
  updateContactInquiryStatus(id: number, status: string): Promise<ContactInquiry>;

  // Additional invoice operations
  getInvoicesByEmail(email: string): Promise<Invoice[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUserById(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db
      .insert(users)
      .values(user)
      .returning();
    return newUser;
  }

  async updateUser(id: number, user: Partial<InsertUser>): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set({ ...user, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }

  async updateUserProvider(id: number, providerData: { provider: string; providerId: string; profilePicture?: string | null }): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set({ 
        provider: providerData.provider,
        providerId: providerData.providerId,
        profilePicture: providerData.profilePicture,
        updatedAt: new Date()
      })
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }

  // Client operations
  async getClient(id: number): Promise<Client | undefined> {
    const [client] = await db.select().from(clients).where(eq(clients.id, id));
    return client || undefined;
  }

  async getClientByEmail(email: string): Promise<Client | undefined> {
    const [client] = await db.select().from(clients).where(eq(clients.email, email));
    return client || undefined;
  }

  async createClient(client: InsertClient): Promise<Client> {
    const [newClient] = await db
      .insert(clients)
      .values(client)
      .returning();
    return newClient;
  }

  async updateClientStripeId(id: number, stripeCustomerId: string): Promise<Client> {
    const [client] = await db
      .update(clients)
      .set({ stripeCustomerId })
      .where(eq(clients.id, id))
      .returning();
    return client;
  }

  // Invoice operations
  async getInvoice(id: number): Promise<Invoice | undefined> {
    const [invoice] = await db.select().from(invoices).where(eq(invoices.id, id));
    return invoice || undefined;
  }

  async getInvoicesByClientId(clientId: number): Promise<Invoice[]> {
    return await db.select().from(invoices).where(eq(invoices.clientId, clientId)).orderBy(desc(invoices.createdAt));
  }

  async getAllInvoices(): Promise<Invoice[]> {
    return await db.select().from(invoices).orderBy(desc(invoices.createdAt));
  }

  async createInvoice(invoice: InsertInvoice): Promise<Invoice> {
    const [newInvoice] = await db
      .insert(invoices)
      .values(invoice)
      .returning();
    return newInvoice;
  }

  async updateInvoiceStatus(id: number, status: string): Promise<Invoice> {
    const [invoice] = await db
      .update(invoices)
      .set({ status, updatedAt: new Date() })
      .where(eq(invoices.id, id))
      .returning();
    return invoice;
  }

  // Portfolio operations
  async getAllPortfolioItems(): Promise<PortfolioItem[]> {
    return await db.select().from(portfolioItems).orderBy(portfolioItems.displayOrder);
  }

  async getPortfolioItemsByCategory(category: string): Promise<PortfolioItem[]> {
    return await db.select().from(portfolioItems).where(eq(portfolioItems.category, category)).orderBy(portfolioItems.displayOrder);
  }

  async getFeaturedPortfolioItems(): Promise<PortfolioItem[]> {
    return await db.select().from(portfolioItems).where(eq(portfolioItems.featured, 1)).orderBy(portfolioItems.displayOrder);
  }

  async createPortfolioItem(portfolioItem: InsertPortfolioItem): Promise<PortfolioItem> {
    const [newItem] = await db
      .insert(portfolioItems)
      .values(portfolioItem)
      .returning();
    return newItem;
  }

  async updatePortfolioItem(id: number, item: Partial<InsertPortfolioItem>): Promise<PortfolioItem> {
    const [portfolioItem] = await db
      .update(portfolioItems)
      .set(item)
      .where(eq(portfolioItems.id, id))
      .returning();
    return portfolioItem;
  }

  async deletePortfolioItem(id: number): Promise<void> {
    await db.delete(portfolioItems).where(eq(portfolioItems.id, id));
  }

  // Contact inquiry operations
  async getAllContactInquiries(): Promise<ContactInquiry[]> {
    return await db.select().from(contactInquiries).orderBy(desc(contactInquiries.createdAt));
  }

  async getContactInquiry(id: number): Promise<ContactInquiry | undefined> {
    const [inquiry] = await db.select().from(contactInquiries).where(eq(contactInquiries.id, id));
    return inquiry || undefined;
  }

  async getContactInquiriesByEmail(email: string): Promise<ContactInquiry[]> {
    return await db.select().from(contactInquiries).where(eq(contactInquiries.email, email)).orderBy(desc(contactInquiries.createdAt));
  }

  async createContactInquiry(inquiry: InsertContactInquiry): Promise<ContactInquiry> {
    const [newInquiry] = await db
      .insert(contactInquiries)
      .values(inquiry)
      .returning();
    return newInquiry;
  }

  async updateContactInquiryStatus(id: number, status: string): Promise<ContactInquiry> {
    const [inquiry] = await db
      .update(contactInquiries)
      .set({ status })
      .where(eq(contactInquiries.id, id))
      .returning();
    return inquiry;
  }

  // Additional invoice operations
  async getInvoicesByEmail(email: string): Promise<Invoice[]> {
    // First get the client by email
    const [client] = await db.select().from(clients).where(eq(clients.email, email));
    if (!client) {
      return [];
    }
    // Then get all invoices for that client
    return await db.select().from(invoices).where(eq(invoices.clientId, client.id)).orderBy(desc(invoices.createdAt));
  }
}

export const storage = new DatabaseStorage();
