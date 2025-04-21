import { db } from '@/lib/db'; // conexão com MySQL

export async function POST(req) {
  try {
    const { mesa, quantidade } = await req.json();

    if (!mesa || !quantidade) {
      return new Response(JSON.stringify({ error: 'Dados incompletos' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Salva ou atualiza mesa no banco
    await db.query(
      'INSERT INTO mesa (numero, quantidade_pessoas) VALUES (?, ?) ON DUPLICATE KEY UPDATE quantidade_pessoas = ?',
      [mesa, quantidade, quantidade]
    );

    return new Response(JSON.stringify({ message: 'Mesa registrada com sucesso' }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Erro interno' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
