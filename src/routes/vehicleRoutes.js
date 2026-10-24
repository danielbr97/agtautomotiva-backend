const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');

const { validateJWT } = require('../middlewares/auth');

router.use(validateJWT);
router.get('/get', vehicleController.listar);
router.post('/create', vehicleController.criar);
router.delete('/delete', vehicleController.deletar);
router.post('/update', vehicleController.atualizarVeiculo);
router.post('/updateClient', vehicleController.atualizarCliente);

module.exports = router;