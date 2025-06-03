// src/app/api/admin/tables/route.js
import { db } from '@/lib/conetc';

export async function GET() {
  try {
    const [rows] = await db.query(`
      SELECT 
        t.id,
        t.table_number,
        t.status,
        t.people_count AS capacity,
        (
          SELECT COUNT(*) 
          FROM orders o 
          WHERE o.table_id = t.table_number AND o.status != 'entregue'
        ) AS orders
      FROM tables t
      ORDER BY t.table_number ASC
    `);

    return Response.json(Array.isArray(rows) ? rows : []);
  } catch (error) {
    console.error('Erro ao buscar mesas:', error);
    return Response.json([], { status: 500 });
  }
}
