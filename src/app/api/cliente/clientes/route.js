import { db } from '@/lib/conetc';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const mesa = searchParams.get('mesa');

  if (!mesa) {
    return new Response(
      JSON.stringify({ error: 'Parâmetro "mesa" é obrigatório.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const [rows] = await db.query(
      'SELECT id, name FROM clients WHERE table_number = ?',
      [mesa]
    );

    return new Response(JSON.stringify(rows), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Erro ao buscar clientes:', error);
    return new Response(
      JSON.stringify({ error: 'Erro ao buscar clientes.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
