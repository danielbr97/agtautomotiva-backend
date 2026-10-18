const express = require('express');
const router = express.Router();
const quoteController = require('../controllers/quoteController');

const { validateJWT } = require('../middlewares/auth');

router.use(validateJWT);
router.get('/get', quoteController.listar);
router.post('/create', quoteController.criar);
router.delete('/delete', quoteController.deletar);
router.post('/atualizar-status',quoteController.atualizarStatus )

module.exports = router;