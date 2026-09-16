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
  const { nome, descricao, preco, codigoBarras } = req.body;
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
  };
  data.produtos.push(produto);
  saveData(data);
  res.status(201).json(produto);
}

function atualizar(req, res) {
  const data = loadData();
  const produto = data.produtos.find((p) => p.id === Number(req.params.id));
  if (!produto) return res.status(404).json({ erro: 'Produto não encontrado' });

  const { nome, descricao, preco, codigoBarras } = req.body;
  produto.nome = nome ?? produto.nome;
  produto.descricao = descricao ?? produto.descricao;
  produto.preco = preco ?? produto.preco;
  produto.codigoBarras = codigoBarras ?? produto.codigoBarras;

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

module.exports = { listar, buscarPorId, criar, atualizar, deletar };
