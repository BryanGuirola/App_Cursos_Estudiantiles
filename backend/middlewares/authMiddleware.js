// middlewares/authMiddleware.js

const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const SECRET_KEY = process.env.JWT_SECRET;

const authMiddleware = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

 
  if (!token) {
    return res.status(401).json({ message: 'Acceso no autorizado' });
  }
  console.log("B");
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    console.log("A");
    req.user = { id: decoded.userId };
 
    next();
  } catch (error) {
    console.error('Error de autenticación:', error);
    res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

// Middleware para verificar rol de estudiante
const verifyStudent = async (req, res, next) => {

  const token = req.headers['authorization']?.split(' ')[1];

  
  if (!token) {
    return res.status(401).json({ message: 'Acceso no autorizado' });
  }
  console.log("B");
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
   
    req.user = decoded;
    
    if (req.user.role === 'alumno') {
      console.log("A");
      next();
    } else {
      res.status(403).json({ message: 'Acceso denegado: solo estudiantes pueden acceder' });
    }
  } catch (error) {
    console.error('Error de autenticación:', error);
    res.status(401).json({ message: 'Token inválido o expirado' });
  }

};

// Middleware para verificar rol de profesor
const verifyTeacher = async (req, res, next) => {
  if (req.user.role === 'teacher') {
    next();
  } else {
    res.status(403).json({ message: 'Acceso denegado: solo profesores pueden acceder' });
  }
};

// Middleware para verificar rol de administrador
const verifyAdmin = async (req, res, next) => {
  if (req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Acceso denegado: solo administradores pueden acceder' });
  }
};


module.exports = { authMiddleware, verifyStudent, verifyTeacher, verifyAdmin };