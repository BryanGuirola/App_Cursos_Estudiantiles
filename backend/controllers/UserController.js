// controllers/UserController.js

const User = require('../models/User');

// Obtener perfil de usuario
exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Suponiendo que el middleware de autenticación proporciona el ID de usuario en req.user
    const user = await User.findById(userId).select('-password'); // Excluir contraseña del resultado
    console.log(userId);    
    console.log(user);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error al obtener el perfil de usuario:', error);
    res.status(500).json({ message: 'Error al obtener el perfil de usuario' });
  }
};

// Actualizar perfil de usuario
exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      fullName,
      email,
      country,
      region,
      timezone,
      studentId,
      major,
    } = req.body;

    // Actualizar los campos permitidos
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { fullName, email, country, region, timezone, studentId, major },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error al actualizar el perfil de usuario:', error);
    res.status(500).json({ message: 'Error al actualizar el perfil de usuario' });
  }
};

// Logout (opcional, para limpiar token en el frontend)
exports.logoutUser = (req, res) => {
  try {
    // Aquí puedes implementar lógica adicional, si es necesario
    res.status(200).json({ message: 'Usuario desconectado' });
  } catch (error) {
    console.error('Error en la desconexión:', error);
    res.status(500).json({ message: 'Error al cerrar sesión' });
  }
};


// Crear usuario
exports.createUser = async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obtener todos los usuarios
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener usuario por ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar usuario
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Eliminar usuario
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};