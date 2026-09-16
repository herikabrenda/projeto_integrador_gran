const { Router } = require('express');
const controller = require('../controllers/produtoFornecedorController');

const router = Router();

router.get('/', controller.listar);
router.post('/', controller.associar);
router.delete('/:id', controller.desassociar);
router.get('/produto/:produtoId/fornecedores', controller.fornecedoresPorProduto);
router.get('/fornecedor/:fornecedorId/produtos', controller.produtosPorFornecedor);

module.exports = router;
