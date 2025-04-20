import { db } from '../../../lib/bd';

export async function GET() {
  try {
    const [rows] = await db.query('SELECT * FROM produtos');
    if (rows.length === 0) {
      return new Response(JSON.stringify({ error: 'Nenhum produto encontrado.' }), { status: 404 });
    }
    return new Response(JSON.stringify(rows), {
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
