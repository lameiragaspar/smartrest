import { db } from '@/lib/conetc';

export async function POST(request) {
  try {
    const { searchParams } = new URL(request.url);
    const mesa = searchParams.get('table');
    const { quantidade } = await request.json();

    if (!mesa || !quantidade) {
      return Response.json({ error: 'Mesa e quantidade são obrigatórios' }, { status: 400 });
    }

    const [result] = await db.query(
      'UPDATE tables SET people_count = ? WHERE table_number = ?',
      [quantidade, mesa]
    );

    if (result.affectedRows === 0) {
      return Response.json({ error: 'Mesa não encontrada' }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Erro ao atualizar quantidade:', error);
    return Response.json({ error: 'Erro no servidor' }, { status: 500 });
  }
}
