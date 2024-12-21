var express = require('express');
var router = express.Router();
const ownerController = require('../controllers/ownerController');
const multer = require('../middlewares/multer');

router.get('/formAddOwner', ownerController.showRegister);

router.post('/formAddOwner', multer("owner"), ownerController.register);

router.get('/showOwner/:id', ownerController.showOneOwner);

router.get('/editShowOwner/:id', ownerController.editShowOwner);

router.get('/login', ownerController.showLogin);

router.post('/login', ownerController.login);

module.exports = router;
