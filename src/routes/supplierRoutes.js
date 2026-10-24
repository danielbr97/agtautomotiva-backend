const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');

const { validateJWT } = require('../middlewares/auth');

router.use(validateJWT);
router.get('/get', supplierController.listar);
router.post('/create', supplierController.criar);
router.delete('/delete', supplierController.deletar);
router.post('/updateSupplier', supplierController.atualizarSupplier);
router.post('/updateSupplierAddress', supplierController.atualizarSupplierAddress);

module.exports = router;