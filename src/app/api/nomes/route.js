
import { db } from '@/lib/bd';

export async function POST(request) {
  const { mesa, nomes } = await request.json();

  if (!mesa || !Array.isArray(nomes) || nomes.length === 0) {
    return Response.json({ error: 'Dados incompletos' }, { status: 400 });
  }

  try {
    const insertPromises = nomes.map((nome) => {
      return db.execute(
        'INSERT INTO nomes (mesa, nome) VALUES (?, ?)',
        [mesa, nome]
      );
    });

    await Promise.all(insertPromises);

    return Response.json({ success: true });
  } catch (error) {
    console.error('Erro ao salvar nomes:', error);
    return Response.json({ error: 'Erro ao salvar nomes' }, { status: 500 });
  }
}
