import { db } from '@/lib/conetc';

export async function POST(request) {
  const { mesa, nomes } = await request.json();

  if (!mesa || !Array.isArray(nomes) || nomes.length === 0) {
    return Response.json({ error: 'Dados incompletos' }, { status: 400 });
  }

  try {
    // Remove nomes antigos da mesa (evita duplicação)
    await db.execute('DELETE FROM clients WHERE table_number = ?', [mesa]);

    // Insere os novos nomes
    const insertPromises = nomes.map((nome) => {
      return db.execute('INSERT INTO clients (table_number, name) VALUES (?, ?)', [mesa, nome]);
    });

    await Promise.all(insertPromises);

    return Response.json({ success: true });
  } catch (error) {
    console.error('Erro ao salvar nomes:', error);
    return Response.json({ error: 'Erro ao salvar nomes' }, { status: 500 });
  }
}
