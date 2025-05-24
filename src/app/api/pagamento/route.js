export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  const { mesa_id, valor, metodo } = req.body;

  if (!mesa_id || !valor || !metodo) {
    return res.status(400).json({ message: 'Dados incompletos' });
  }

  // Simula delay de processamento
  await new Promise(resolve => setTimeout(resolve, 2000));

  return res.status(200).json({
    status: 'sucesso',
    mensagem: `Pagamento de ${valor} AKZ via ${metodo} processado com sucesso.`,
  });
}
