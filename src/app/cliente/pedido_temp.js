let pedidosTemporarios = [];

try {
  const armazenados = localStorage.getItem('pedido_temp');
  if (armazenados) pedidosTemporarios = JSON.parse(armazenados);
} catch {
  pedidosTemporarios = [];
}

function salvar() {
  localStorage.setItem('pedido_temp', JSON.stringify(pedidosTemporarios));
}

export function getPedidos() {
  return pedidosTemporarios;
}

export function adicionarOuAtualizarPedido({ mesa, clienteId, nomeCliente, produto }) {
  const categoria = produto.category_id || 'outros';
  let pedido = pedidosTemporarios.find(p => p.mesa === mesa && p.clienteId === clienteId && p.nomeCliente === nomeCliente);

  if (!pedido) {
    pedido = {
      mesa,
      clienteId,
      nomeCliente,
      pedidos: { [categoria]: [{ ...produto, quantidade: 1 }] }
    };
    pedidosTemporarios.push(pedido);
    salvar();
    return { status: 'novo' };
  }

  if (!pedido.pedidos[categoria]) {
    pedido.pedidos[categoria] = [];
  }

  pedido.pedidos[categoria].push({ ...produto, quantidade: 1 });
  salvar();
  return { status: 'atualizado' };
}

export function removerProdutoTemp(clienteId, categoria, index) {
  const pedido = pedidosTemporarios.find(p => p.clienteId === clienteId);
  if (!pedido || !pedido.pedidos[categoria]) return;

  pedido.pedidos[categoria].splice(index, 1);

  if (pedido.pedidos[categoria].length === 0) {
    delete pedido.pedidos[categoria];
  }

  if (Object.keys(pedido.pedidos).length === 0) {
    const idx = pedidosTemporarios.indexOf(pedido);
    if (idx !== -1) pedidosTemporarios.splice(idx, 1);
  }

  salvar(); // ✅ salva no localStorage
}

export function limparPedidos() {
  pedidosTemporarios = [];
  localStorage.removeItem('pedido_temp');
}
