const db = require('../db');

function listar(req, res) {
  const produtos = db.prepare('SELECT * FROM produtos').all();
  res.json(produtos);
}

function buscarPorId(req, res) {
  const produto = db.prepare('SELECT * FROM produtos WHERE id = ?').get(req.params.id);
  if (!produto) return res.status(404).json({ erro: 'Produto não encontrado' });
  res.json(produto);
}

function criar(req, res) {
  const { nome, descricao, preco, codigoBarras } = req.body;
  if (!nome || preco === undefined) {
    return res.status(400).json({ erro: 'Nome e preço são obrigatórios' });
  }
  const info = db
    .prepare('INSERT INTO produtos (nome, descricao, preco, codigoBarras) VALUES (?, ?, ?, ?)')
    .run(nome, descricao || null, preco, codigoBarras || null);
  const produto = db.prepare('SELECT * FROM produtos WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(produto);
}

function atualizar(req, res) {
  const { nome, descricao, preco, codigoBarras } = req.body;
  const existente = db.prepare('SELECT * FROM produtos WHERE id = ?').get(req.params.id);
  if (!existente) return res.status(404).json({ erro: 'Produto não encontrado' });

  db.prepare(
    'UPDATE produtos SET nome = ?, descricao = ?, preco = ?, codigoBarras = ? WHERE id = ?'
  ).run(
    nome ?? existente.nome,
    descricao ?? existente.descricao,
    preco ?? existente.preco,
    codigoBarras ?? existente.codigoBarras,
    req.params.id
  );
  const produto = db.prepare('SELECT * FROM produtos WHERE id = ?').get(req.params.id);
  res.json(produto);
}

function deletar(req, res) {
  const info = db.prepare('DELETE FROM produtos WHERE id = ?').run(req.params.id);
  if (info.changes === 0) return res.status(404).json({ erro: 'Produto não encontrado' });
  res.status(204).send();
}

module.exports = { listar, buscarPorId, criar, atualizar, deletar };
