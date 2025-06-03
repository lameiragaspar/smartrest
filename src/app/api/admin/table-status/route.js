// src/app/api/admin/table-status/route.js
import { db } from '@/lib/conetc'; 

export async function PUT(request) {
  try {
    const { tableId, newStatus } = await request.json();

    if (!tableId || !newStatus) {
      return Response.json({ message: 'ID da mesa e novo status são obrigatórios.' }, { status: 400 });
    }

    const allowedStatuses = ['livre', 'ocupado', 'reservado', 'usado'];
    if (!allowedStatuses.includes(newStatus)) {
      return Response.json({ message: 'Status inválido fornecido.' }, { status: 400 });
    }

    // No seu SQL, a tabela `tables` tem `id` e `status`
    const [result] = await db.query(
      'UPDATE tables SET status = ? WHERE id = ?',
      [newStatus, tableId]
    );

    if (result.affectedRows === 0) {
      return Response.json({ message: 'Mesa não encontrada ou nenhum status alterado.' }, { status: 404 });
    }


    return Response.json({ message: 'Status da mesa atualizado com sucesso!' });

  } catch (error) {
    console.error('Erro ao atualizar status da mesa:', error);
    return Response.json({ message: 'Erro interno do servidor ao atualizar status da mesa.', error: error.message }, { status: 500 });
  }
}