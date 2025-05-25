import { db } from '@/lib/conetc';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const mesa = searchParams.get('mesa');

    if (!mesa) {
      return new Response(
        JSON.stringify({ error: 'Mesa não informada' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const [result] = await db.query(
      "SELECT status FROM orders WHERE table_id = ? ORDER BY created_at DESC LIMIT 1",
      [mesa]
    );

    if (result.length === 0) {
      return new Response(
        JSON.stringify({ status: null }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ status: result[0].status }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Erro ao buscar status do pedido:', error);
    return new Response(
      JSON.stringify({ error: 'Erro interno no servidor.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
