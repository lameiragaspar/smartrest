// app/api/admin/order_items/route.js
import { db } from "@/lib/conetc"; // Usando a sua conexão
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
                c.name AS client_name
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            LEFT JOIN clients c ON oi.cliente_id = c.id
            WHERE oi.order_id = ?
        `;
        // Ajuste conforme a sua implementação de db.query
        const items = await db.query(sql, [orderId]);
        // Se db.query retornar um objeto como { results: [...] }, use items.results

        return NextResponse.json(items);
    } catch (error) {
        console.error('API Erro ao buscar itens do pedido:', error);
        return NextResponse.json({ message: 'Erro ao buscar itens do pedido', error: error.message }, { status: 500 });
    }
}