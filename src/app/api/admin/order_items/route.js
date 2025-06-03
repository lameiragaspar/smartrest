// app/api/admin/orders/route.js
import { db } from "@/lib/conetc";
import { NextResponse } from 'next/server';

// --- BUSCAR PEDIDOS (GET) ---
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    try {
        let sql = `
            SELECT 
                o.id, 
                t.table_number,
                o.status, 
                o.total, 
                o.created_at 
            FROM orders o
            JOIN tables t ON o.table_id = t.table_number
        `;
        const params = [];
        if (status && status !== 'todos') {
            sql += ' WHERE o.status = ?';
            params.push(status);
        }
        sql += ' ORDER BY o.created_at DESC';

        const orders = await db.query(sql, params); 
        
        return NextResponse.json(orders);
    } catch (error) {
        console.error('API Erro ao buscar pedidos:', error);
        return NextResponse.json({ message: 'Erro ao buscar pedidos', error: error.message }, { status: 500 });
    }
}

// --- ATUALIZAR STATUS DO PEDIDO (PUT) ---
export async function PUT(request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const body = await request.json();
    const { status: newStatus } = body;

    if (!id || !newStatus) {
        return NextResponse.json({ message: 'ID do pedido e novo status são obrigatórios.' }, { status: 400 });
    }

    try {

        // Obter status atual e table_id para log (usando a conexão se obtida)
        const [currentOrderRows] = await db.query('SELECT status, table_id FROM orders WHERE id = ?', [id]);

        if (!currentOrderRows || currentOrderRows.length === 0) { 
            return NextResponse.json({ message: 'Pedido não encontrado.' }, { status: 404 });
        }
        const previousStatus = currentOrderRows.status; 
        const tableId = currentOrderRows.table_id; 

        // Atualizar status do pedido (usando a conexão se obtida)
        await db.query(
            'UPDATE orders SET status = ? WHERE id = ?',
            [newStatus, id]
        );

        // Registrar a mudança de status na tabela status_log (usando a conexão se obtida)
        await db.query(
            'INSERT INTO status_log (order_id, table_id, previous_status, new_status) VALUES (?, ?, ?, ?)',
            [id, tableId, previousStatus, newStatus]
        );
        
        return NextResponse.json({ message: 'Status do pedido atualizado com sucesso.' });
    } catch (error) {
        console.error('API Erro ao atualizar status do pedido:', error);
        return NextResponse.json({ message: 'Erro ao atualizar status do pedido', error: error.message }, { status: 500 });
    } finally {
    }
}

// --- CANCELAR/EXCLUIR PEDIDO (DELETE) ---
export async function DELETE(request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ message: 'ID do pedido é obrigatório.' }, { status: 400 });
    }
    
    try {

        await db.query('DELETE FROM order_items WHERE order_id = ?', [id]);
        
        const result = await db.query('DELETE FROM orders WHERE id = ?', [id]);

        return NextResponse.json({ message: 'Pedido cancelado (excluído) com sucesso.' });

    } catch (error) {
        console.error('API Erro ao excluir pedido:', error);
        if (error.code === 'ER_ROW_IS_REFERENCED_2' || error.errno === 1451) {
             return NextResponse.json({ message: 'Erro ao excluir pedido: Registros associados ainda existem (ex: status_log).', error: error.message }, { status: 500 });
        } else {
             return NextResponse.json({ message: 'Erro ao excluir pedido', error: error.message }, { status: 500 });
        }
    } finally {
    }
}
