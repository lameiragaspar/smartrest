import { db } from '@/lib/bd'; //conexão com o banco

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const mesa = searchParams.get('mesa');

  if (!mesa) {
    return Response.json({ error: 'Mesa não informada' }, { status: 400 });
  }

  try {
    const [rows] = await db.execute(
      'SELECT quantidade_pessoas FROM mesa WHERE numero = ?',
      [mesa]
    );

    if (rows.length === 0) {
      return Response.json({ error: 'Mesa não encontrada' }, { status: 404 });
    }

    return Response.json(rows[0]);
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Erro no banco de dados' }, { status: 500 });
  }
}
