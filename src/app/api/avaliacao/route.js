import { db } from '@/lib/conetc';

export async function POST(req) {
  try {
    const { mesa_id, nota, comentario } = await req.json();

    if (!mesa_id || !nota ) {
      return new Response(
        JSON.stringify({ error: 'Dados incompletos' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    await db.query(
      'INSERT INTO assessment (table_id, stars,comment, created_at) VALUES (?, ?, ?, NOW())',
      [mesa_id, nota, comentario]
    );

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Erro ao registrar avaliação:', error);
    return new Response(
      JSON.stringify({ error: 'Erro interno no servidor.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
