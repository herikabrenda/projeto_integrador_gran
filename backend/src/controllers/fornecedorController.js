const db = require('../db');

function listar(req, res) {
  const fornecedores = db.prepare('SELECT * FROM fornecedores').all();
  res.json(fornecedores);
}

function buscarPorId(req, res) {
  const fornecedor = db.prepare('SELECT * FROM fornecedores WHERE id = ?').get(req.params.id);
  if (!fornecedor) return res.status(404).json({ erro: 'Fornecedor não encontrado' });
  res.json(fornecedor);
}

function criar(req, res) {
  const { nome, cnpj, endereco, contato } = req.body;
  if (!nome || !cnpj) {
    return res.status(400).json({ erro: 'Nome e CNPJ são obrigatórios' });
  }
  const info = db
    .prepare('INSERT INTO fornecedores (nome, cnpj, endereco, contato) VALUES (?, ?, ?, ?)')
    .run(nome, cnpj, endereco || null, contato || null);
  const fornecedor = db.prepare('SELECT * FROM fornecedores WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(fornecedor);
}

function atualizar(req, res) {
  const { nome, cnpj, endereco, contato } = req.body;
  const existente = db.prepare('SELECT * FROM fornecedores WHERE id = ?').get(req.params.id);
  if (!existente) return res.status(404).json({ erro: 'Fornecedor não encontrado' });

  db.prepare(
    'UPDATE fornecedores SET nome = ?, cnpj = ?, endereco = ?, contato = ? WHERE id = ?'
  ).run(
    nome ?? existente.nome,
    cnpj ?? existente.cnpj,
    endereco ?? existente.endereco,
    contato ?? existente.contato,
    req.params.id
  );
  const fornecedor = db.prepare('SELECT * FROM fornecedores WHERE id = ?').get(req.params.id);
  res.json(fornecedor);
}

function deletar(req, res) {
  const info = db.prepare('DELETE FROM fornecedores WHERE id = ?').run(req.params.id);
  if (info.changes === 0) return res.status(404).json({ erro: 'Fornecedor não encontrado' });
  res.status(204).send();
}

module.exports = { listar, buscarPorId, criar, atualizar, deletar };
