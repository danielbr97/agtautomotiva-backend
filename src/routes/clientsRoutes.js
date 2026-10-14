const express = require('express');
const router = express.Router();
const clientsController = require('../controllers/clientsController');

const { validateJWT } = require('../middlewares/auth');

router.use(validateJWT);
router.get('/', clientsController.listar);
router.post('/', clientsController.criar);
router.delete('/', clientsController.deletar);

module.exports = router;