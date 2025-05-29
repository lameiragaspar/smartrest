// app/api/admin/orders/route.js
import { db } from "@/lib/conetc"; // Usando a sua conexão
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
            JOIN tables t ON o.table_id = t.id
        `;
        const params = [];
        if (status && status !== 'Todos') {
            sql += ' WHERE o.status = ?';
            params.push(status);
        }
        sql += ' ORDER BY o.created_at DESC';

        // Assumindo que db.query retorna um array de resultados ou um objeto com uma propriedade 'rows' ou 'results'
        // Ajuste conforme a sua implementação de db.query
        const orders = await db.query(sql, params); 
        // Se db.query retornar um objeto como { results: [...] }, use orders.results
        
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

    // Para transações, a forma de obter a conexão pode variar dependendo da sua lib/db.js
    // Se 'db' for um pool, você pode precisar de db.getConnection()
    // Por simplicidade, vou assumir que db.query pode lidar com isso ou você adaptará.
    // Se sua lib 'db' não suportar transações diretamente desta forma,
    // você precisará adaptar a lógica de transação.

    let connection; // Variável para a conexão, se sua lib a expuser
    try {
        // Exemplo conceitual de como obter uma conexão (se aplicável):
        // connection = await db.getConnection(); 
        // await connection.beginTransaction();

        // Obter status atual e table_id para log (usando a conexão se obtida)
        const [currentOrderRows] = await db.query('SELECT status, table_id FROM orders WHERE id = ?', [id]);
        if (!currentOrderRows || currentOrderRows.length === 0) { // Verifique se currentOrderRows existe antes de .length
             // if (connection) await connection.rollback();
            return NextResponse.json({ message: 'Pedido não encontrado.' }, { status: 404 });
        }
        const previousStatus = currentOrderRows.status; // Se db.query retorna o objeto direto
        const tableId = currentOrderRows.table_id;   // Se db.query retorna o objeto direto

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
        
        // if (connection) await connection.commit();
        return NextResponse.json({ message: 'Status do pedido atualizado com sucesso.' });
    } catch (error) {
        // if (connection) await connection.rollback();
        console.error('API Erro ao atualizar status do pedido:', error);
        return NextResponse.json({ message: 'Erro ao atualizar status do pedido', error: error.message }, { status: 500 });
    } finally {
        // if (connection) connection.release();
    }
}

// --- CANCELAR/EXCLUIR PEDIDO (DELETE) ---
export async function DELETE(request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ message: 'ID do pedido é obrigatório.' }, { status: 400 });
    }
    
    // Novamente, a lógica de transação depende da sua lib 'db'
    let connection;
    try {
        // connection = await db.getConnection();
        // await connection.beginTransaction();

        await db.query('DELETE FROM order_items WHERE order_id = ?', [id]);
        
        // Pagamentos são ON DELETE CASCADE, então não é necessário excluir explicitamente
        
        const result = await db.query('DELETE FROM orders WHERE id = ?', [id]);
        // A verificação de affectedRows pode depender do que sua db.query retorna
        // Ex: if (result.affectedRows > 0) 

        // if (connection) await connection.commit();
        return NextResponse.json({ message: 'Pedido cancelado (excluído) com sucesso.' });
        // else {
        //     if (connection) await connection.rollback();
        //     return NextResponse.json({ message: 'Pedido não encontrado ou já excluído.' }, { status: 404 });
        // }

    } catch (error) {
        // if (connection) await connection.rollback();
        console.error('API Erro ao excluir pedido:', error);
        if (error.code === 'ER_ROW_IS_REFERENCED_2' || error.errno === 1451) {
             return NextResponse.json({ message: 'Erro ao excluir pedido: Registros associados ainda existem (ex: status_log).', error: error.message }, { status: 500 });
        } else {
             return NextResponse.json({ message: 'Erro ao excluir pedido', error: error.message }, { status: 500 });
        }
    } finally {
        // if (connection) connection.release();
    }
}
