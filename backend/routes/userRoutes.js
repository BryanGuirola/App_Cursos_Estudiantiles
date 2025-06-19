// routes/userRoutes.js

const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const authMiddleware = require('../middlewares/authMiddleware'); // Middleware de autenticación

// Ruta para obtener perfil de usuario
router.get('/profile', authMiddleware.authMiddleware, UserController.getUserProfile);

// Ruta para actualizar perfil de usuario
router.put('/profile', authMiddleware.authMiddleware, UserController.updateUserProfile);

// Ruta para logout (opcional)
router.post('/logout', authMiddleware.authMiddleware, UserController.logoutUser);

router.post('/users', UserController.createUser);
router.get('/users', UserController.getUsers);
router.get('/users/:id', UserController.getUserById);
router.put('/users/:id', UserController.updateUser);
router.delete('/users/:id', UserController.deleteUser);

module.exports = router;