const { loadData, saveData } = require('../store');

function listar(req, res) {
  const data = loadData();
  const associacoes = data.produtoFornecedor.map((pf) => {
    const produto = data.produtos.find((p) => p.id === pf.produtoId);
    const fornecedor = data.fornecedores.find((f) => f.id === pf.fornecedorId);
    return {
      id: pf.id,
      produtoId: pf.produtoId,
      fornecedorId: pf.fornecedorId,
      produtoNome: produto ? produto.nome : null,
      fornecedorNome: fornecedor ? fornecedor.nome : null,
    };
  });
  res.json(associacoes);
}

function associar(req, res) {
  const { produtoId, fornecedorId } = req.body;
  if (!produtoId || !fornecedorId) {
    return res.status(400).json({ erro: 'produtoId e fornecedorId são obrigatórios' });
  }

  const data = loadData();
  const produto = data.produtos.find((p) => p.id === Number(produtoId));
  if (!produto) return res.status(404).json({ erro: 'Produto não encontrado' });

  const fornecedor = data.fornecedores.find((f) => f.id === Number(fornecedorId));
  if (!fornecedor) return res.status(404).json({ erro: 'Fornecedor não encontrado' });

  const jaExiste = data.produtoFornecedor.some(
    (pf) => pf.produtoId === Number(produtoId) && pf.fornecedorId === Number(fornecedorId)
  );
  if (jaExiste) return res.status(409).json({ erro: 'Produto já associado a este fornecedor' });

  const associacao = {
    id: data.nextIds.produtoFornecedor++,
    produtoId: Number(produtoId),
    fornecedorId: Number(fornecedorId),
  };
  data.produtoFornecedor.push(associacao);
  saveData(data);
  res.status(201).json(associacao);
}

function desassociar(req, res) {
  const data = loadData();
  const idx = data.produtoFornecedor.findIndex((pf) => pf.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ erro: 'Associação não encontrada' });

  data.produtoFornecedor.splice(idx, 1);
  saveData(data);
  res.status(204).send();
}

function fornecedoresPorProduto(req, res) {
  const data = loadData();
  const produtoId = Number(req.params.produtoId);
  const fornecedorIds = data.produtoFornecedor
    .filter((pf) => pf.produtoId === produtoId)
    .map((pf) => pf.fornecedorId);
  res.json(data.fornecedores.filter((f) => fornecedorIds.includes(f.id)));
}

function produtosPorFornecedor(req, res) {
  const data = loadData();
  const fornecedorId = Number(req.params.fornecedorId);
  const produtoIds = data.produtoFornecedor
    .filter((pf) => pf.fornecedorId === fornecedorId)
    .map((pf) => pf.produtoId);
  res.json(data.produtos.filter((p) => produtoIds.includes(p.id)));
}

module.exports = {
  listar,
  associar,
  desassociar,
  fornecedoresPorProduto,
  produtosPorFornecedor,
};
