import { db } from '@/lib/conetc';

export async function POST(req) {
  try {
    const data = await req.json();
    const mesa = Object.keys(data)[0];
    const clientes = data[mesa];

    if (!mesa || !clientes || Object.keys(clientes).length === 0) {
      return new Response(
        JSON.stringify({ error: 'Dados incompletos' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Busca o ID real da mesa
    const [mesaExiste] = await db.query(
      'SELECT id FROM tables WHERE table_number = ?',
      [mesa]
    );

    if (mesaExiste.length === 0) {
      return new Response(
        JSON.stringify({ error: `Mesa ${mesa} não existe.` }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const mesaId = mesaExiste[0].id;

    // Verifica se já existe um pedido pendente
    const [existing] = await db.query(
      "SELECT id FROM orders WHERE table_id = ? AND status != 'entregue' ORDER BY created_at DESC LIMIT 1",
      [mesaId]
    );

    // Calcula o total
    let total = 0;
    for (const clienteId in clientes) {
      const cliente = clientes[clienteId];
      for (const categoria in cliente.pedidos) {
        const produtos = cliente.pedidos[categoria];
        for (const produto of produtos) {
          total += (produto.price || 0) * (produto.quantidade || 1);
        }
      }
    }

    let pedidoId;
    if (existing.length > 0) {
      pedidoId = existing[0].id;
    } else {
      const [result] = await db.query(
        'INSERT INTO orders (table_id, status, total) VALUES (?, ?, ?)',
        [mesaId, 'pendente', total]
      );
      pedidoId = result.insertId;
    }

    // Insere os itens
    for (const clienteId in clientes) {
      const cliente = clientes[clienteId];

      for (const categoria in cliente.pedidos) {
        const produtos = cliente.pedidos[categoria];

        for (const produto of produtos) {
          await db.query(
            'INSERT INTO order_items (order_id, product_id, cliente_id, quantity) VALUES (?, ?, ?, ?)',
            [
              pedidoId,
              produto.id,
              clienteId,
              produto.quantidade || 1
            ]
          );
        }
      }
    }

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
