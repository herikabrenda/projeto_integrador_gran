const { Router } = require('express');
const controller = require('../controllers/produtoController');

const router = Router();

router.get('/estoque-baixo', controller.estoqueBaixo);
router.get('/', controller.listar);
router.get('/:id', controller.buscarPorId);
router.post('/', controller.criar);
router.put('/:id', controller.atualizar);
router.delete('/:id', controller.deletar);
router.post('/:id/entrada', controller.entrada);
router.post('/:id/saida', controller.saida);

module.exports = router;
