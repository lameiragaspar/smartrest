import { NextResponse } from 'next/server';
import { db } from '@/lib/conetc';

export async function GET() {
  try {
    const [rows] = await db.execute(
      "SELECT id, name FROM users WHERE role = 'garcon'"
    );

    return NextResponse.json({ garcons: rows });
  } catch (error) {
    console.error('Erro ao buscar garçons:', error);
    return NextResponse.json({ error: 'Erro ao buscar garçons' }, { status: 500 });
  }
}