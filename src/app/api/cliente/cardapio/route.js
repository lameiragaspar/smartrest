import { db } from '@/lib/conetc';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const categoria = searchParams.get('categoria');

  try {
    let query = 'SELECT * FROM products WHERE available = 1';
    let values = [];

    if (categoria && categoria !== '1') {
      query += ' AND categories = ?';
      values.push(categoria);
    }

    query += ' ORDER BY name ASC';

    const [rows] = await db.query(query, values);

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

