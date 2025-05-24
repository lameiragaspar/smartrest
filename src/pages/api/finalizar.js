import { writeFile } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { NextResponse } from 'next/server';
import { db } from '@/lib/conetc';

export const config = {
  api: {
    bodyParser: false, // desabilita o bodyParser padrão
  },
};

export async function POST(req) {
  try {
    const formData = await req.formData();
    const mesa_id = formData.get('mesa_id');
    const comprovativo = formData.get('comprovativo'); // tipo: File

    if (!mesa_id || !comprovativo) {
      return NextResponse.json({ erro: 'Comprovativo ausente.' }, { status: 400 });
    }

    // Gera nome único para o arquivo
    const fileExt = comprovativo.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = path.join(process.cwd(), 'public/comprovativos', fileName);

    // Salva o arquivo localmente (em /public/comprovativos/)
    const bytes = await comprovativo.arrayBuffer();
    await writeFile(filePath, Buffer.from(bytes));

    // Zera status da mesa
    const conn = await db();
    await conn.execute('UPDATE mesas SET status = ? WHERE id = ?', ['available', mesa_id]);

    // Apaga os pedidos da mesa (assumindo tabela `pedidos`)
    await conn.execute('DELETE FROM request WHERE mesa_id = ?', [mesa_id]);
    await conn.execute('DELETE FROM request_itens WHERE mesa_id = ?', [mesa_id]);

    // Registra o comprovativo no banco (opcional)
    await conn.execute(`
      INSERT INTO comprovaty (table_id, caminho_arquivo, created_at)
      VALUES (?, ?, NOW())
    `, [mesa_id, `/comprovativos/${fileName}`]);

    return NextResponse.json({ mensagem: 'Pagamento confirmado e mesa liberada!' });

  } catch (error) {
    console.error('Erro ao finalizar:', error);
    return NextResponse.json({ erro: 'Erro interno ao finalizar.' }, { status: 500 });
  }
}
