import { db } from '@/lib/conetc';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const categoria = searchParams.get('categoria');

  try {
    let query = 'SELECT * FROM products';
    let values = [];

    // Verifica se foi passada uma categoria (diferente de 0)
    if (categoria && categoria !== '0') {
      query += ' WHERE categories = ?';
      values.push(categoria);
    }

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
