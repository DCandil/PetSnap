var express = require('express');
const indexController = require('../controllers/indexController');
var router = express.Router();

router.get('/', indexController.openHome);

router.get('/contact', indexController.openContact);

router.post('/contact', indexController.sendContact);



module.exports = router;
