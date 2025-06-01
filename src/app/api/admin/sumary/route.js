import { db } from '@/lib/conetc';

export async function GET() {
  try {
    const [[{ activeOrders }]] = await db.query(
      `SELECT COUNT(*) AS activeOrders FROM orders WHERE status != 'entregue'`
    );

    const [[{ occupiedTables }]] = await db.query(
      `SELECT COUNT(*) AS occupiedTables FROM tables WHERE status = 'ocupado'`
    );

    const [[{ usedTables }]] = await db.query(
      `SELECT COUNT(*) AS usedTables FROM tables WHERE status = 'usado'`
    );

    const [[{ availableTables }]] = await db.query(
      `SELECT COUNT(*) AS availableTables FROM tables WHERE status = 'livre'`
    );

    const [[{ pendingCalls }]] = await db.query(
      `SELECT COUNT(*) AS pendingCalls FROM calls WHERE status = 'pendente'`
    );

    return new Response(
      JSON.stringify({ activeOrders, occupiedTables, usedTables, availableTables, pendingCalls }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Erro no resumo do dashboard:', error);
    return new Response(JSON.stringify({ error: 'Erro no resumo do dashboard' }), { status: 500 });
  }
}
