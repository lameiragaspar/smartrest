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
        const garcom_id = formData.get('garcom_id') || null;
        const comprovativo = formData.get('comprovativo');

        if (!order_id || !amount || (!comprovativo && method !== 'cash' && method !== 'mcexpress')) {
            return NextResponse.json({ erro: 'Dados obrigatórios ausentes.' }, { status: 400 });
        }

        let comprovativo_path = null;

        if (comprovativo) {
            const fileExt = comprovativo.name.includes('.') ? comprovativo.name.split('.').pop() : 'pdf';
            const now = new Date();
            const timestamp = now.toISOString().replace(/[:.]/g, '-');
            const fileName = `comprovativo-${timestamp}.${fileExt}`;
            const filePath = path.join(process.cwd(), 'public/comprovativos', fileName);

            const bytes = await comprovativo.arrayBuffer();
            await writeFile(filePath, Buffer.from(bytes));

            comprovativo_path = `/comprovativos/${fileName}`;
        }

        await db.execute(
            `INSERT INTO payments (order_id, amount, method, comprovativo_arquivo, garcom_id, paid_at) VALUES (?, ?, ?, ?, ?, NOW())`,
            [order_id, amount, method, comprovativo_path, garcom_id]
        );

        return NextResponse.json({ mensagem: 'Pagamento registrado com sucesso!' });

    } catch (error) {
        console.error('Erro ao registrar pagamento:', error);
        return NextResponse.json({ erro: 'Erro interno.' }, { status: 500 });
    }
}
