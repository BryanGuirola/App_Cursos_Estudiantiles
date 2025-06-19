const mongoose = require('mongoose');

// Definir el esquema de usuario actualizado
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  fullName: { type: String, default: '' },
  email: { type: String, default: '' },
  country: { type: String, default: '' },
  region: { type: String, default: '' },
  timezone: { type: String, default: '' },
  studentId: { type: String, default: '' },
  major: { type: String, default: '' },
  enrolledCourses: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId},
      title: { type: String }
    }
  ],
});

module.exports = mongoose.model('User', userSchema);