const express = require('express');
const router = express.Router();

// Importa a controller correspondente
const clientsController = require('../controllers/clientsController');

// Aponta as URLs diretamente para as funções da controller
router.get('/', clientsController.listar);
router.post('/', clientsController.criar);
router.delete('/', clientsController.deletar);

module.exports = router;