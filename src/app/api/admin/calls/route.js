import { db } from '@/lib/conetc';

export async function GET() {
  try {
    const [rows] = await db.query(`
      SELECT 
        c.id,
        t.table_number AS table_number,
        c.reason,
        c.status,
        TIMESTAMPDIFF(MINUTE, c.created_at, NOW()) AS minutesAgo
      FROM calls c
      JOIN tables t ON c.table_id = t.id
      ORDER BY c.created_at DESC
    `);


    const formatted = rows.map((call) => ({
      id: call.id,
      table: call.table_number, // esse campo estava errado também
      reason: call.reason,
      status: call.status, // <- Corrigido aqui
      time: call.minutesAgo <= 0
        ? 'agora mesmo'
        : `${call.minutesAgo} min atrás`,
    }));


    return Response.json(formatted);
  } catch (error) {
    console.error('Erro ao buscar chamados:', error);
    return Response.json({ error: 'Erro interno' }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const { id } = await request.json();

    if (!id || typeof id !== 'number') {
      return Response.json({ error: 'ID inválido' }, { status: 400 });
    }

    const [result] = await db.query(
      'UPDATE calls SET status = "atendido" WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return Response.json({ error: 'Chamado não encontrado' }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Erro ao atualizar chamado:', error);
    return Response.json({ error: 'Erro interno' }, { status: 500 });
  }
}
