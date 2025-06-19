const express = require('express');
const { loginUser } = require('../controllers/loginController');
const router = express.Router();
// Ruta para el login
router.post('/login', loginUser);

module.exports = router;
