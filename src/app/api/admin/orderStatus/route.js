import { db } from "@/lib/conetc";
import { NextResponse } from 'next/server';

// --- Atualizar status do pedido ---
export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const { status: newStatus } = await request.json();

    if (!id || !newStatus) {
      return NextResponse.json(
        { message: 'ID do pedido e novo status são obrigatórios.' },
        { status: 400 }
      );
    }

    const [result] = await db.query(
      'UPDATE orders SET status = ? WHERE id = ?',
      [newStatus, id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: 'Pedido não encontrado.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Status atualizado com sucesso.' });
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    return NextResponse.json(
      { message: 'Erro interno', error: error.message },
      { status: 500 }
    );
  }
}
