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

  let pedido = pedidosTemporarios.find(
    p => p.mesa === mesa && p.clienteId === clienteId && p.nomeCliente === nomeCliente
  );

  if (!pedido) {
    pedido = {
      mesa,
      clienteId,
      nomeCliente,
      pedidos: {
        [categoria]: [{ ...produto, quantidade: 1 }]
      }
    };
    pedidosTemporarios.push(pedido);
    salvar();
    return { status: 'novo' };
  }

  if (!pedido.pedidos[categoria]) {
    pedido.pedidos[categoria] = [];
  }

  // Verifica se o produto já está na lista
  const produtoExistente = pedido.pedidos[categoria].find(p => p.id === produto.id);

  if (produtoExistente) {
    produtoExistente.quantidade += 1;
    salvar();
    return { status: 'quantidade_atualizada' };
  } else {
    pedido.pedidos[categoria].push({ ...produto, quantidade: 1 });
    salvar();
    return { status: 'adicionado' };
  }
}

export function atualizarQuantidadeProduto(clienteId, categoria, index, novaQtd) {
  const dadosBrutos = localStorage.getItem('pedidos_temp');
  if (!dadosBrutos) return;

  const pedidos = JSON.parse(dadosBrutos);
  const pedido = pedidos.find(p => p.clienteId === clienteId);
  if (!pedido || !pedido.pedidos[categoria]) return;

  if (pedido.pedidos[categoria][index]) {
    pedido.pedidos[categoria][index].quantidade = novaQtd;
    localStorage.setItem('pedidos_temp', JSON.stringify(pedidos));
  }
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
  // 🧠 Salva o número da mesa antes de apagar tudo
  const mesa = localStorage.getItem('mesa');

  // 🧹 Limpa todo o localStorage
  localStorage.clear();

  // 🔁 Restaura apenas a mesa
  if (mesa) {
    localStorage.setItem('mesa', mesa);
  }

  // 🧼 Se usar variável temporária em memória:
  pedidosTemporarios = [];
}

