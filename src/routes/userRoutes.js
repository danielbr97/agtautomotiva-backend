const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

/*

const { validateJWT } = require('../middlewares/auth');

router.use(validateJWT);

*/

router.post('/new', userController.createUser);
router.post('/changepass', userController.changePassword);
router.post('/updateuser', userController.updateUser);

module.exports = router;