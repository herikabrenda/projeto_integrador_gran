const { DatabaseSync } = require('node:sqlite');
const path = require('node:path');

const db = new DatabaseSync(path.join(__dirname, '..', 'database.sqlite'));

db.exec(`
  CREATE TABLE IF NOT EXISTS produtos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    descricao TEXT,
    preco REAL NOT NULL,
    codigoBarras TEXT
  );

  CREATE TABLE IF NOT EXISTS fornecedores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    cnpj TEXT NOT NULL,
    endereco TEXT,
    contato TEXT
  );

  CREATE TABLE IF NOT EXISTS produto_fornecedor (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    produtoId INTEGER NOT NULL,
    fornecedorId INTEGER NOT NULL,
    FOREIGN KEY (produtoId) REFERENCES produtos(id) ON DELETE CASCADE,
    FOREIGN KEY (fornecedorId) REFERENCES fornecedores(id) ON DELETE CASCADE,
    UNIQUE (produtoId, fornecedorId)
  );
`);

module.exports = db;
