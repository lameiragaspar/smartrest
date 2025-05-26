import { db } from '@/lib/conetc';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    const { table_id, reason, status = 'wainting' } = body;

    if (!table_id || !reason) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 });
    }

    const [result] = await db.execute(
      'INSERT INTO calls (table_id, reason, status) VALUES (?, ?, ?)',
      [table_id, reason, status]
    );

    return NextResponse.json({ success: true, id: result.insertId }, { status: 200 });
  } catch (error) {
    console.error('[API_CHAT_POST]', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}