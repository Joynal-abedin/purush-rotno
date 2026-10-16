import { getDb } from './src/db/client.js';
import * as schema from './src/db/schema.js';
import { eq } from 'drizzle-orm';

export interface Env {
  DB: D1Database;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const db = getDb(env.DB);

    // Get products
    if (url.pathname === '/api/products' && request.method === 'GET') {
      const products = await db.select().from(schema.products).where(eq(schema.products.isPublished, true));
      return Response.json({ success: true, products });
    }

    // Get single product
    if (url.pathname.startsWith('/api/products/') && request.method === 'GET') {
      const id = url.pathname.split('/').pop();
      if (!id) return new Response('Bad Request', { status: 400 });
      const product = await db.select().from(schema.products).where(eq(schema.products.id, id)).get();
      if (!product) return Response.json({ success: false, message: 'Not found' }, { status: 404 });
      return Response.json({ success: true, product });
    }

    // Get settings
    if (url.pathname === '/api/settings' && request.method === 'GET') {
      // Simplification: hardcoded settings for now as settings schema needs definition
      return Response.json({ success: true, settings: { brandName: 'পুরুষ রত্ন' } });
    }
    
    return new Response('Not Found', { status: 404 });
  },
};
