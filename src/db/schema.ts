import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const products = sqliteTable('products', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  subtitle: text('subtitle'),
  regularPrice: integer('regularPrice').notNull(),
  offerPrice: integer('offerPrice').notNull(),
  description: text('description'),
  details: text('details'), // JSON stringified
  usage: text('usage'),     // JSON stringified
  images: text('images'),   // JSON stringified
  inStock: integer('inStock', { mode: 'boolean' }).default(true),
  isPublished: integer('isPublished', { mode: 'boolean' }).default(true),
  createdAt: text('createdAt').notNull(),
  updatedAt: text('updatedAt').notNull(),
});

export const orders = sqliteTable('orders', {
  id: text('id').primaryKey(),
  customerName: text('customerName').notNull(),
  customerPhone: text('customerPhone').notNull(),
  customerAddress: text('customerAddress').notNull(),
  items: text('items').notNull(), // JSON stringified
  totalAmount: real('totalAmount').notNull(),
  status: text('status').notNull(),
  createdAt: text('createdAt').notNull(),
});
