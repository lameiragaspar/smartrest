import { db } from '@/lib/conetc';

export async function GET() {
    try {
        const [rows] = await db.query(`
            SELECT 
                o.id,
                t.table_number AS table_number,
                CASE o.status
                WHEN 'pendente' THEN 'Pendente'
                WHEN 'em preparo' THEN 'Em Preparo'
                WHEN 'pronto' THEN 'Pronto'
                WHEN 'entregue' THEN 'Entregue'
                ELSE o.status
                END AS status,
                o.total,
                o.created_at,
                TIMESTAMPDIFF(MINUTE, o.created_at, NOW()) AS minutesAgo
            FROM orders o
            JOIN tables t ON o.table_id = t.id
            ORDER BY o.created_at DESC
        `);

        return new Response(JSON.stringify(rows), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Erro ao buscar pedidos recentes:', error);
        return new Response(JSON.stringify({ error: 'Erro ao buscar pedidos' }), { status: 500 });
    }
}
