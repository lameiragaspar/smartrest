import { writeFile } from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';
import { db } from '@/lib/conetc';

export const config = {
    api: {
        bodyParser: false,
    },
};

export async function POST(req) {
    try {
        const formData = await req.formData();
        const order_id = formData.get('order_id');
        const amount = formData.get('amount');
        const method = formData.get('method') || 'cash';
        const comprovativo = formData.get('comprovativo'); // tipo: File

        if (!order_id || !amount || !comprovativo) {
            return NextResponse.json({ erro: 'Dados obrigatórios ausentes.' }, { status: 400 });
        }

        // Gera nome único para o comprovativo
        const fileExt = comprovativo.name.split('.').pop();
        const now = new Date();
        const timestamp = now.toISOString().replace(/[:.]/g, '-');
        const fileName = `comprovativo-${timestamp}.${fileExt}`;
        const filePath = path.join(process.cwd(), 'public/comprovativos', fileName);

        // Salva o comprovativo localmente
        const bytes = await comprovativo.arrayBuffer();
        await writeFile(filePath, Buffer.from(bytes));

        // Insere pagamento com comprovativo
        await db.execute(
            `INSERT INTO payments (order_id, amount, method, comprovativo_arquivo, paid_at) VALUES (?, ?, ?, ?, NOW())`,
            [order_id, amount, method, `/comprovativos/${fileName}`]
        );

        return NextResponse.json({ mensagem: 'Pagamento registrado com sucesso!' });

    } catch (error) {
        console.error('Erro ao registrar pagamento:', error);
        return NextResponse.json({ erro: 'Erro interno.' }, { status: 500 });
    }
}
