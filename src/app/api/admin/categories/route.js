// src/app/api/admin/categories/route.js
import { db } from '@/lib/conetc';

export async function GET() {
  try {
    const [rows] = await db.query('SELECT id, name FROM categories ORDER BY name ASC');
    return Response.json(Array.isArray(rows) ? rows : []);
  } catch (err) {
    console.error('Erro ao buscar categorias:', err);
    return Response.json([], { status: 500 });
  }
}
