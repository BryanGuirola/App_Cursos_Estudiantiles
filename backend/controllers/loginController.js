const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { use } = require('../routes/userRoutes');

require('dotenv').config();
console.log("JWT_SECRET:", process.env.JWT_SECRET); // Esto debería imprimir tu clave

const SECRET_KEY = process.env.JWT_SECRET ;

const loginUser = async (req, res) => {
  const { username, password } = req.body;
  
  try {
    // Buscar el usuario en la base de datos
    const user = await User.findOne({ username });
    
    if (!user) {
      return res.status(400).json({ message: 'Usuario no encontrado' });
    }
    console.log(user)
    // Verificar la contraseña
   
    if (password!==user.password) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }
    console.log("2");
    // Generar el token JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      SECRET_KEY,
      { expiresIn: '1h' } // El token expira en 1 hora
    );
     console.log("1");
    // Responder con el token y el rol del usuario
    res.json({token, role: user.role, username: user.username,fullName:user.fullName,ID:user._id, message: 'Login exitoso' });
  } catch (error) {
    console.error("Error en el servidor:", error);
    res.status(500).json({ message: 'Error en el servidor', error });
  }
};

module.exports = { loginUser };
