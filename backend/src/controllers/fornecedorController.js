const { loadData, saveData } = require('../store');

function listar(req, res) {
  const data = loadData();
  res.json(data.fornecedores);
}

function buscarPorId(req, res) {
  const data = loadData();
  const fornecedor = data.fornecedores.find((f) => f.id === Number(req.params.id));
  if (!fornecedor) return res.status(404).json({ erro: 'Fornecedor não encontrado' });
  res.json(fornecedor);
}

function criar(req, res) {
  const { nome, cnpj, endereco, contato } = req.body;
  if (!nome || !cnpj) {
    return res.status(400).json({ erro: 'Nome e CNPJ são obrigatórios' });
  }
  const data = loadData();
  const fornecedor = {
    id: data.nextIds.fornecedores++,
    nome,
    cnpj,
    endereco: endereco || null,
    contato: contato || null,
  };
  data.fornecedores.push(fornecedor);
  saveData(data);
  res.status(201).json(fornecedor);
}

function atualizar(req, res) {
  const data = loadData();
  const fornecedor = data.fornecedores.find((f) => f.id === Number(req.params.id));
  if (!fornecedor) return res.status(404).json({ erro: 'Fornecedor não encontrado' });

  const { nome, cnpj, endereco, contato } = req.body;
  fornecedor.nome = nome ?? fornecedor.nome;
  fornecedor.cnpj = cnpj ?? fornecedor.cnpj;
  fornecedor.endereco = endereco ?? fornecedor.endereco;
  fornecedor.contato = contato ?? fornecedor.contato;

  saveData(data);
  res.json(fornecedor);
}

function deletar(req, res) {
  const data = loadData();
  const id = Number(req.params.id);
  const idx = data.fornecedores.findIndex((f) => f.id === id);
  if (idx === -1) return res.status(404).json({ erro: 'Fornecedor não encontrado' });

  data.fornecedores.splice(idx, 1);
  data.produtoFornecedor = data.produtoFornecedor.filter((pf) => pf.fornecedorId !== id);
  saveData(data);
  res.status(204).send();
}

module.exports = { listar, buscarPorId, criar, atualizar, deletar };
