import { db } from '@/lib/conetc';
import { NextResponse } from 'next/server';

// POST - Cria um novo chamado
export async function POST(req) {
  try {
    const body = await req.json();
    const { table_number, reason, status = 'pendente' } = body;

    if (!table_number || !reason) {
      return NextResponse.json(
        { error: 'Número da mesa e motivo são obrigatórios' },
        { status: 400 }
      );
    }

    // Inserção direta na tabela 'calls' com o número da mesa
    const [result] = await db.execute(
      'INSERT INTO calls (table_id, reason, status, created_at) VALUES (?, ?, ?, NOW())',
      [table_number, reason, status]
    );

    return NextResponse.json(
      { success: true, id: result.insertId, message: 'Chamado registrado com sucesso!' },
      { status: 201 }
    );
  } catch (error) {
    console.error('[API_CHAT_POST]', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

// GET - Lista todos os chamados de uma mesa
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const tableNumber = searchParams.get('table_number');

    if (!tableNumber) {
      return NextResponse.json({ error: 'Número da mesa é obrigatório' }, { status: 400 });
    }

    // Buscar chamados diretamente pelo número da mesa
    const [calls] = await db.execute(
      'SELECT id, reason, status, created_at FROM call WHERE table_id = ? ORDER BY created_at DESC',
      [tableNumber]
    );

    return NextResponse.json(calls, { status: 200 });
  } catch (error) {
    console.error('[API_CHAT_GET]', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
