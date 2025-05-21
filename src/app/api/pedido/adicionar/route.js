import { db } from '@/lib/conetc';

export async function POST(req) {
  try {
    const { mesa, cliente_id, produto_id } = await req.json();

    if (!mesa || !cliente_id || !produto_id) {
      return new Response(
        JSON.stringify({ error: 'Dados incompletos' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Procura se já existe um request em aberto para a mesa
    const [existing] = await db.query(
      "SELECT id FROM request WHERE mesa_id = ? AND status != 'entregue' ORDER BY criado_em DESC LIMIT 1",
      [mesa]
    );

    let pedidoId;

    if (existing.length > 0) {
      pedidoId = existing[0].id;
    } else {
      // Cria um novo pedido (request)
      const [result] = await db.query(
        'INSERT INTO request (mesa_id, status) VALUES (?, ?)',
        [mesa, 'pendente']
      );
      pedidoId = result.insertId;
    }

    // Adiciona item ao pedido
    await db.query(
      'INSERT INTO request_itens (pedido_id, produto_id, cliente_id, quantidade) VALUES (?, ?, ?, ?)',
      [pedidoId, produto_id, cliente_id, 1]
    );

    return new Response(
      JSON.stringify({ success: true, pedido_id: pedidoId }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Erro ao adicionar pedido:', error);
    return new Response(
      JSON.stringify({ error: 'Erro interno no servidor.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
