const express = require('express');
const { testController } = require('../controllers/testController');

//router object

const router = express.Router();

//router
router.get('/', testController)

//export
module.exports = router;