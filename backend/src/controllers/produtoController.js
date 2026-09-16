const { loadData, saveData } = require('../store');

function listar(req, res) {
  const data = loadData();
  res.json(data.produtos);
}

function buscarPorId(req, res) {
  const data = loadData();
  const produto = data.produtos.find((p) => p.id === Number(req.params.id));
  if (!produto) return res.status(404).json({ erro: 'Produto não encontrado' });
  res.json(produto);
}

function criar(req, res) {
  const { nome, descricao, preco, codigoBarras, quantidadeEstoque, estoqueMinimo } = req.body;
  if (!nome || preco === undefined) {
    return res.status(400).json({ erro: 'Nome e preço são obrigatórios' });
  }
  const data = loadData();
  const produto = {
    id: data.nextIds.produtos++,
    nome,
    descricao: descricao || null,
    preco,
    codigoBarras: codigoBarras || null,
    quantidadeEstoque: quantidadeEstoque !== undefined ? Number(quantidadeEstoque) : 0,
    estoqueMinimo: estoqueMinimo !== undefined ? Number(estoqueMinimo) : 0,
  };
  data.produtos.push(produto);
  saveData(data);
  res.status(201).json(produto);
}

function atualizar(req, res) {
  const data = loadData();
  const produto = data.produtos.find((p) => p.id === Number(req.params.id));
  if (!produto) return res.status(404).json({ erro: 'Produto não encontrado' });

  const { nome, descricao, preco, codigoBarras, quantidadeEstoque, estoqueMinimo } = req.body;
  produto.nome = nome ?? produto.nome;
  produto.descricao = descricao ?? produto.descricao;
  produto.preco = preco ?? produto.preco;
  produto.codigoBarras = codigoBarras ?? produto.codigoBarras;
  produto.quantidadeEstoque = quantidadeEstoque !== undefined ? Number(quantidadeEstoque) : produto.quantidadeEstoque;
  produto.estoqueMinimo = estoqueMinimo !== undefined ? Number(estoqueMinimo) : produto.estoqueMinimo;

  saveData(data);
  res.json(produto);
}

function deletar(req, res) {
  const data = loadData();
  const id = Number(req.params.id);
  const idx = data.produtos.findIndex((p) => p.id === id);
  if (idx === -1) return res.status(404).json({ erro: 'Produto não encontrado' });

  data.produtos.splice(idx, 1);
  data.produtoFornecedor = data.produtoFornecedor.filter((pf) => pf.produtoId !== id);
  saveData(data);
  res.status(204).send();
}

function entrada(req, res) {
  const { quantidade } = req.body;
  if (!quantidade || Number(quantidade) <= 0) {
    return res.status(400).json({ erro: 'Quantidade deve ser um número positivo' });
  }
  const data = loadData();
  const produto = data.produtos.find((p) => p.id === Number(req.params.id));
  if (!produto) return res.status(404).json({ erro: 'Produto não encontrado' });

  produto.quantidadeEstoque = (produto.quantidadeEstoque || 0) + Number(quantidade);
  saveData(data);
  res.json(produto);
}

function saida(req, res) {
  const { quantidade } = req.body;
  if (!quantidade || Number(quantidade) <= 0) {
    return res.status(400).json({ erro: 'Quantidade deve ser um número positivo' });
  }
  const data = loadData();
  const produto = data.produtos.find((p) => p.id === Number(req.params.id));
  if (!produto) return res.status(404).json({ erro: 'Produto não encontrado' });

  const atual = produto.quantidadeEstoque || 0;
  if (Number(quantidade) > atual) {
    return res.status(400).json({ erro: 'Estoque insuficiente para essa saída' });
  }
  produto.quantidadeEstoque = atual - Number(quantidade);
  saveData(data);
  res.json(produto);
}

function estoqueBaixo(req, res) {
  const data = loadData();
  const baixos = data.produtos.filter((p) => (p.quantidadeEstoque || 0) <= (p.estoqueMinimo || 0));
  res.json(baixos);
}

module.exports = {
  listar,
  buscarPorId,
  criar,
  atualizar,
  deletar,
  entrada,
  saida,
  estoqueBaixo,
};
