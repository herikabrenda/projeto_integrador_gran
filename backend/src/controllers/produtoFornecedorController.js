const db = require('../db');

function listar(req, res) {
  const associacoes = db
    .prepare(
      `SELECT pf.id, pf.produtoId, pf.fornecedorId, p.nome AS produtoNome, f.nome AS fornecedorNome
       FROM produto_fornecedor pf
       JOIN produtos p ON p.id = pf.produtoId
       JOIN fornecedores f ON f.id = pf.fornecedorId`
    )
    .all();
  res.json(associacoes);
}

function associar(req, res) {
  const { produtoId, fornecedorId } = req.body;
  if (!produtoId || !fornecedorId) {
    return res.status(400).json({ erro: 'produtoId e fornecedorId são obrigatórios' });
  }

  const produto = db.prepare('SELECT id FROM produtos WHERE id = ?').get(produtoId);
  if (!produto) return res.status(404).json({ erro: 'Produto não encontrado' });

  const fornecedor = db.prepare('SELECT id FROM fornecedores WHERE id = ?').get(fornecedorId);
  if (!fornecedor) return res.status(404).json({ erro: 'Fornecedor não encontrado' });

  try {
    const info = db
      .prepare('INSERT INTO produto_fornecedor (produtoId, fornecedorId) VALUES (?, ?)')
      .run(produtoId, fornecedorId);
    const associacao = db
      .prepare('SELECT * FROM produto_fornecedor WHERE id = ?')
      .get(info.lastInsertRowid);
    res.status(201).json(associacao);
  } catch (err) {
    res.status(409).json({ erro: 'Produto já associado a este fornecedor' });
  }
}

function desassociar(req, res) {
  const info = db.prepare('DELETE FROM produto_fornecedor WHERE id = ?').run(req.params.id);
  if (info.changes === 0) return res.status(404).json({ erro: 'Associação não encontrada' });
  res.status(204).send();
}

function fornecedoresPorProduto(req, res) {
  const fornecedores = db
    .prepare(
      `SELECT f.* FROM fornecedores f
       JOIN produto_fornecedor pf ON pf.fornecedorId = f.id
       WHERE pf.produtoId = ?`
    )
    .all(req.params.produtoId);
  res.json(fornecedores);
}

function produtosPorFornecedor(req, res) {
  const produtos = db
    .prepare(
      `SELECT p.* FROM produtos p
       JOIN produto_fornecedor pf ON pf.produtoId = p.id
       WHERE pf.fornecedorId = ?`
    )
    .all(req.params.fornecedorId);
  res.json(produtos);
}

module.exports = {
  listar,
  associar,
  desassociar,
  fornecedoresPorProduto,
  produtosPorFornecedor,
};
