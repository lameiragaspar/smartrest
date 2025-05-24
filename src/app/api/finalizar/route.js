import { writeFile } from 'fs/promises';
import path from 'path';
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
        const now = new Date();
        const timestamp = now.toISOString().replace(/[:.]/g, '-');
        const fileName = `comprovativo-${timestamp}.${fileExt}`;
        const filePath = path.join(process.cwd(), 'public/comprovativos', fileName);

        // Salva o arquivo localmente (em /public/comprovativos/)
        const bytes = await comprovativo.arrayBuffer();
        await writeFile(filePath, Buffer.from(bytes));

        // Zera status da mesa
        await db.execute('UPDATE tables SET status = ? WHERE id = ?', ['available', mesa_id]);

        await db.execute(`INSERT INTO comprovaty (table_id, caminho_arquivo, created_at) VALUES (?, ?, NOW())`, [mesa_id, `/comprovativos/${fileName}`]);

        return NextResponse.json({ mensagem: 'Pagamento confirmado e mesa liberada!' });

    } catch (error) {
        console.error('Erro ao finalizar:', error);
        return NextResponse.json({ erro: 'Erro interno ao finalizar.' }, { status: 500 });
    }
}
