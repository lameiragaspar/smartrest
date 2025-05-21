import { db } from '@/lib/conetc';

export async function POST(req) {
  try {
    const dados = await req.json();
    const mesaId = Object.keys(dados)[0];
    const pedidos = dados[mesaId];

    // Cria novo pedido principal
    const [result] = await db.query(
      'INSERT INTO request (mesa_id) VALUES (?)',
      [mesaId]
    );
    const pedidoId = result.insertId;

    const itens = [];

    // Atualizado: cada cliente tem { nome, produtos }
    for (const [clienteId, clienteData] of Object.entries(pedidos)) {
      const produtos = clienteData.produtos || [];
      for (const produto of produtos) {
        itens.push([pedidoId, produto.id, clienteId, 1]);
      }
    }

    if (itens.length > 0) {
      await db.query(
        'INSERT INTO request_itens (pedido_id, produto_id, cliente_id, quantidade) VALUES ?',
        [itens]
      );
    }

    return new Response(JSON.stringify({ sucesso: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Erro ao enviar pedidos:', error);
    return new Response(
      JSON.stringify({ error: 'Erro interno ao enviar pedidos.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
