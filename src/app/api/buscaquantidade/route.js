import { db } from '@/lib/conetc';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const mesa = searchParams.get('mesa');

  if (!mesa) {
    return Response.json({ error: 'Número da mesa não informado' }, { status: 400 });
  }

  try {
    const [rows] = await db.query(
      'SELECT people_count FROM tables WHERE table_number = ?',
      [mesa]
    );

    if (rows.length === 0) {
      return Response.json({ error: 'Mesa não encontrada' }, { status: 404 });
    }

    return Response.json({ quantidade_pessoas: rows[0].people_count });
  } catch (error) {
    console.error('Erro ao buscar quantidade:', error);
    return Response.json({ error: 'Erro no servidor' }, { status: 500 });
  }
}
