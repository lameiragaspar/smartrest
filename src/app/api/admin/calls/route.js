import { db } from '@/lib/conetc';

export async function GET() {
  try {
    const [rows] = await db.query(`
      SELECT c.id, t.table_number AS table, c.reason, c.status,
             TIMESTAMPDIFF(MINUTE, c.created_at, NOW()) AS minutesAgo
      FROM calls c
      JOIN tables t ON c.table_id = t.id
      ORDER BY c.created_at DESC
    `);

    const formatted = rows.map((call) => ({
      id: call.id,
      table: call.table,
      reason: call.reason,
      status: call.status === 'waiting' ? 'Pendente' : 'Resolvido',
      time: `${call.minutesAgo} min atrás`,
    }));

    return Response.json(formatted);
  } catch (error) {
    console.error('Erro ao buscar chamados:', error);
    return Response.json([], { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const { id } = await request.json();
    if (!id) {
      return Response.json({ error: 'ID inválido' }, { status: 400 });
    }

    await db.query('UPDATE calls SET status = "attended" WHERE id = ?', [id]);

    return Response.json({ success: true });
  } catch (error) {
    console.error('Erro ao atualizar chamado:', error);
    return Response.json({ error: 'Erro interno' }, { status: 500 });
  }
}
