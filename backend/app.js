const express = require('express');
const cors = require('cors');

const produtoRoutes = require('./src/routes/produtoRoutes');
const fornecedorRoutes = require('./src/routes/fornecedorRoutes');
const produtoFornecedorRoutes = require('./src/routes/produtoFornecedorRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/produtos', produtoRoutes);
app.use('/fornecedores', fornecedorRoutes);
app.use('/produto-fornecedor', produtoFornecedorRoutes);

app.get('/', (req, res) => {
  res.json({ mensagem: 'API Projeto Integrador - Faculdade Gran' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando em http://localhost:${PORT}/`);
});
