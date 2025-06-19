const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const routeslogin = require('./routes/loginRoutes');
const routescourses=require('./routes/courseRoutes');
const routesuser=require('./routes/userRoutes');
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
// CONEXION A MONGODB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('CONECTADO A MONGODB');
    })
    .catch((error) => {
        console.log('ERROR CONECTANDO A MONGODB', error);
    });
// Definición de rutas
app.use('/api', routeslogin);
app.use('/api', routescourses);
app.use('/api', routesuser);
// Inicio del servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`SERVIDOR EJECUTÁNDOSE EN EL PUERTO ${PORT}`);
});