const express = require('express');
const router = express.Router();
const clientsController = require('../controllers/clientsController');

const { validateJWT } = require('../middlewares/auth');

router.use(validateJWT);
router.get('/get', clientsController.listar);
router.post('/create', clientsController.criar);
router.post('/updateClient', clientsController.atualizarCliente);
router.post('/updateAddressClient', clientsController.atualizarEndereco);
router.delete('/delete', clientsController.deletar);

module.exports = router;