import { db } from '@/lib/conetc';

export async function GET() {
  try {
    const [rows] = await db.query('SELECT * FROM products');

    return new Response(JSON.stringify(rows), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Erro ao buscar cardápio:', error);
    return new Response(
      JSON.stringify({ error: 'Erro ao buscar cardápio.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
