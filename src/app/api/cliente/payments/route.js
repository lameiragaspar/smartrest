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
        const contentType = req.headers.get('content-type');

        let body, garconNome, formData, mesa, amount, method = 'cash', garcom_id = null, comprovativo = null, transaction_id = null, garcom_senha, clientes = [];

        if (contentType.includes('application/json')) {
            // Recebido como JSON
            body = await req.json();
            mesa = body.mesa;
            amount = body.amount;
            method = body.method || 'cash';
            garcom_id = body.waiter_id || null;
            garconNome = body.waiter_name || null
            transaction_id = body.transaction_id || null;
            garcom_senha = body.waiter_password || null;
            clientes = body.clientes || [];
        } else if (contentType.includes('multipart/form-data')) {
            // Recebido como FormData
            formData = await req.formData();
            mesa = formData.get('mesa');
            amount = formData.get('amount');
            method = formData.get('method') || 'cash';
            garcom_id = formData.get('garcom_id') || null;
            garconNome = formData.get('waiter_name') || null;
            comprovativo = formData.get('comprovativo');
            transaction_id = formData.get('transaction_id') || null;
            garcom_senha = formData.get('waiter_password') || null;
            clientes = JSON.parse(formData.get('clientes') || '[]');
        } else {
            return NextResponse.json({ erro: 'Tipo de conteúdo não suportado.' }, { status: 415 });
        }

        if (!mesa || !amount || (method !== 'cash' && method !== 'mcexpress' && !transaction_id && !comprovativo)) {
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

        // Verificar se garçom existe e senha está correta
        if (garcom_id && garcom_senha) {
            const [rows] = await db.execute('SELECT password_hash FROM users WHERE id = ?', [garcom_id]);

            if (!rows.length) {
                return NextResponse.json({ erro: 'Garçom não encontrado.' }, { status: 401 });
            }

            const senhaBD = rows[0].password_hash;

            if (senhaBD !== garcom_senha) {
                return NextResponse.json({ erro: 'Senha do garçom incorreta.' }, { status: 401 });
            }
        }

        // Buscar o ID do pedido com base na mesa
        const [orderResult] = await db.execute(
            'SELECT id FROM orders WHERE table_id = ? ORDER BY created_at DESC LIMIT 1',
            [mesa]
        );

        if (orderResult.length === 0) {
            return NextResponse.json({ erro: 'Pedido não encontrado para esta mesa.' }, { status: 400 });
        }

        const order_id = orderResult[0].id;

        await db.execute(
            `INSERT INTO payments (order_id, order_nome, amount, method, comprovativo_arquivo, garcom_id,garcom_nome, transaction_id, paid_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [order_id, order_id, amount, method, comprovativo_path, garcom_id, garconNome, transaction_id, new Date()]
        );
        // Gravar histórico
        //const clientes = body.clientes || [];

        for (const cliente of clientes) {
            for (const item of cliente.itens) {
                const dataFormatada = new Date(); // usa o formato nativo do MySQL
                console.log({
                    mesa,
                    order_id,
                    cliente: cliente.nomeCliente,
                    produto: item.nome,
                    quantidade: item.quantidade,
                    preco: item.preco,
                    subtotal: cliente.subtotal,
                    garcom: garcom_id,
                    garson: garconNome,
                });
                await db.execute(
                    `INSERT INTO history (mesa, order_id, order_nome, cliente, produtos, quantidade, preco, preco_total, garcom_id, garcom_nome, data)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        mesa ?? null,
                        order_id ?? null,
                        order_id ?? null,
                        cliente.nomeCliente ?? null,
                        item.nome ?? null,
                        item.quantidade ?? null,
                        item.preco ?? null,
                        cliente.subtotal ?? null,
                        garcom_id ?? null,
                        garconNome ?? null,
                        new Date()
                    ]
                );

            }
        }

        //setar mesa
        await db.execute(
            `UPDATE tables SET people_count = ?, status = ? WHERE id = ?`,
            [0, 'usado', mesa]
        );

        // 1. Deletar os itens do pedido (filhos)
        //await db.execute('DELETE FROM order_items WHERE order_id = ?', [order_id]);

        // 2. Agora é seguro deletar o pedido
        //await db.execute('DELETE FROM orders WHERE table_id = ?', [mesa]);

        // 3. Limpar os clientes da mesa
        await db.execute('DELETE FROM clients WHERE table_number = ?', [mesa]);

        // 4. Limpar qualquer dado de coleta temporária
        await db.execute('DELETE FROM calls WHERE table_id = ?', [mesa]);

        return NextResponse.json({ mensagem: 'Pagamento efetuado com sucesso!' }, { status: 200 });

    } catch (error) {
        console.error('Erro ao registrar pagamento:', error);
        return NextResponse.json({ erro: 'Erro interno.' }, { status: 500 });
    }
}
