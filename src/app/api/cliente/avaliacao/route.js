import { db } from '@/lib/conetc';

export async function POST(req) {
  try {
    const { mesa_id, nota, comentario } = await req.json();

    if (
      !mesa_id ||
      !nota ||
      typeof mesa_id !== 'string' ||
      typeof nota !== 'number'
    ) {
      return new Response(
        JSON.stringify({ error: 'Dados inválidos ou incompletos.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const comentarioFinal = comentario?.trim() || null;

    // Verifica se a mesa existe na tabela `tables`
    const [rows] = await db.query(
      'SELECT table_number FROM tables WHERE table_number = ?',
      [mesa_id]
    );

    if (rows.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Mesa não encontrada.' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Insere avaliação usando diretamente o número da mesa
    await db.query(
      'INSERT INTO assessment (table_id, stars, comment, created_at) VALUES (?, ?, ?, NOW())',
      [mesa_id, nota, comentarioFinal]
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
