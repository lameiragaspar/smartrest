import { db } from '@/lib/conetc';

export async function POST(request) {
  const { mesa } = await request.json();

  if (!mesa || isNaN(mesa)) {
    return Response.json({ error: 'Digite um número válido da mesa' }, { status: 400 });
  }

  try {
    // Verifica se a mesa já existe
    const [existe] = await db.query('SELECT id FROM tables WHERE table_number = ?', [mesa]);

    // Se não existe, insere
    if (existe.length === 0) {
      await db.query('INSERT INTO tables (table_number) VALUES (?)', [mesa]);
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Erro ao salvar mesa:', error);
    return Response.json({ error: 'Erro ao salvar mesa' }, { status: 500 });
  }
}
