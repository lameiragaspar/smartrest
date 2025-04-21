import { db } from '@/lib/bd'; // conexão com MySQL

export async function POST(req) {
  try {
    const { mesa, quantidade } = await req.json();

    if (!mesa || !quantidade) {
      return new Response(JSON.stringify({ error: 'Dados incompletos' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await db.query(
      'INSERT INTO mesa (numero, quantidade_pessoas) VALUES (?, ?) ON DUPLICATE KEY UPDATE quantidade_pessoas = ?',
      [mesa, quantidade, quantidade]
    );

    return new Response(JSON.stringify({ message: 'Mesa registrada com sucesso' }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Erro ao registrar no banco' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}