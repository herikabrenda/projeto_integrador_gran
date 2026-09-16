const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'data.json');

function estadoInicial() {
  return {
    produtos: [],
    fornecedores: [],
    produtoFornecedor: [],
    nextIds: { produtos: 1, fornecedores: 1, produtoFornecedor: 1 },
  };
}

function loadData() {
  if (!fs.existsSync(DATA_FILE)) {
    return estadoInicial();
  }
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
}

function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

module.exports = { loadData, saveData };
