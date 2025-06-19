const mongoose = require('mongoose');

// Subesquema para las tareas enviadas por estudiantes
const tareaSchema = new mongoose.Schema({
  estudianteId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // ID del estudiante
  nombreEstudiante: { type: String }, // Nombre del estudiante
  linkTarea: { type: String }, // Enlace al documento de la tarea
  fechaEnvio: { type: Date, default: Date.now } // Fecha en que se subió la tarea
});

// Subesquema para los foros
const foroSchema = new mongoose.Schema({
  mensajes: [{
    estudianteId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // ID del estudiante
    nombreEstudiante: { type: String }, // Nombre del estudiante
    mensaje: { type: String, required: true }, // Contenido del mensaje
    fechaMensaje: { type: Date, default: Date.now }
  }]
});

// Subesquema para los elementos (tareas, foros, exámenes)
const elementoSchema = new mongoose.Schema({
  tipo: { type: String, enum: ['tarea', 'foro', 'examen'], required: true },
  titulo: { type: String, required: true },
  descripcion: { type: String, required: true },
  linkDocumento: { type: String }, // Enlace para documento en línea
  fechaApertura: { type: Date, required: true },
  fechaCierre: { type: Date, required: true },
  estado: { type: String, enum: ['abierta', 'cerrada'], required: true },
  entregas: [tareaSchema], // Entregas de tareas por estudiante
  foro: foroSchema // Estructura de foro para los elementos de tipo 'foro'
});

// Subesquema para las semanas
const semanaSchema = new mongoose.Schema({
  numeroSemana: { type: Number, required: true },
  contenido: { type: String, required: true },
  elementos: [elementoSchema]
});

// Esquema principal para los cursos
const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  progress: { type: String, required: true },
  visible: { type: Boolean, default: true },
  highlighted: { type: Boolean, default: false },
  descripcion: { type: String },
  semanas: [semanaSchema],
  estudiantes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  profesores: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('Course', courseSchema);