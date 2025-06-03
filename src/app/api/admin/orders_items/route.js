import { db } from "@/lib/conetc";
import { NextResponse } from 'next/server';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
        return NextResponse.json({ message: 'ID do Pedido é obrigatório.' }, { status: 400 });
    }

    try {
        const sql = `
            SELECT 
                oi.id,
                oi.quantity,
                p.name AS product_name,
                p.price AS product_price,
                c.name AS client_name,
                o.table_id,
                t.table_number
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            JOIN orders o ON oi.order_id = o.id
            JOIN tables t ON o.table_id = t.id
            LEFT JOIN clients c ON oi.cliente_id = c.id
            WHERE oi.order_id = ?
        `;
        const [items] = await db.query(sql, [orderId]);
        
        return new Response(JSON.stringify(items), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('API Erro ao buscar itens do pedido:', error);
        return NextResponse.json({ message: 'Erro ao buscar itens do pedido', error: error.message }, { status: 500 });
    }
}