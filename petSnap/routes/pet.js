var express = require('express');
const petController = require('../controllers/petController');
var router = express.Router();
const multer = require('../middlewares/multer');

router.post('/addPet/:owner_id', multer('pet'), petController.addNewPet);

router.get('/formAddPet', petController.showFormPetRegister);

router.post('/createFormAddPet', multer("pet"), petController.createFormAddPet);

router.get('/edit/:pet_id', petController.showFormEditPet);

router.post('/edit/:pet_id', petController.editPet);

router.get('/delPet/:pet_id', petController.delPet);

router.get('/delLogicPet/:owner_id/:pet_id', petController.delLogicPet);



module.exports = router;
