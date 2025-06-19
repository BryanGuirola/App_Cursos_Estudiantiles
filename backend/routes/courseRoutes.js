const express = require('express');
const router = express.Router();

// Importar los controladores
const courseController = require('../controllers/CourseController');

const authMiddleware = require('../middlewares/authMiddleware');

// Rutas para la gestión de cursos
router.post('/create', courseController.createCourse); // Crear un nuevo curso
router.get('/', courseController.getCourses); // Obtener todos los cursos
router.get('/obtener/:id', courseController.getCourseById); // Obtener un curso por ID
router.put('/put/:id', courseController.updateCourse); // Actualizar un curso
router.delete('/delete/:id', courseController.deleteCourse); // Eliminar un curso

// Rutas para la gestión de estudiantes y profesores en los cursos
router.get('/students', courseController.getAllStudents);//obtener estudiantes en general
// Ruta para obtener estudiantes inscritos en un curso
router.get('/:courseId/students', courseController.getStudentsInCourse);
// Ruta para agregar estudiantes a un curso
router.post('/:courseId/add-students', courseController.addStudentsToCourse);
// Ruta para eliminar un estudiante de un curso
router.delete('/:courseId/students/:studentId', courseController.removeStudentFromCourse);

// Rutas para obtener cursos según el rol del usuario
router.get('/student', authMiddleware.verifyStudent, courseController.getCoursesForStudent);
router.get('/teacher', authMiddleware.verifyTeacher, courseController.getCoursesForTeacher);
router.get('/admin', authMiddleware.verifyAdmin, courseController.getAllCourses);

router.post('/:id/assign-teacher', courseController.assignTeacherToCourse); // Asignar un profesor al curso
// Rutas para profesores en el curso (similar a estudiantes)
router.get('/teachers', courseController.getAllTeachers);
router.get('/:courseId/professors', courseController.getProfessorsInCourse);
router.post('/:courseId/add-professors', courseController.addProfessorsToCourse);
router.delete('/:courseId/professors/:professorId', courseController.removeProfessorFromCourse);


// Rutas para las semanas
router.post('/courses/:id/weeks', courseController.addWeekToCourse); // Agregar una nueva semana
router.delete('/courses/:id/weeks', courseController.deleteWeekFromCourse);//Eliminar semana

// Rutas para los elementos dentro de las semanas
router.post('/courses/:id/weeks/:weekId/elements', courseController.addElementToWeek); // Agregar un elemento
router.put('/courses/:id/weeks/:weekId/elements/:elementId', courseController.updateElementInWeek); // Actualizar un elemento
router.delete('/courses/:id/weeks/:weekId/elements/:elementId', courseController.deleteElementFromWeek); // Eliminar un elemento

// Rutas para gestión de foros
router.post('/courses/:courseId/semanas/:semanaId/elementos/:elementoId/foro', courseController.addMessageToForo);
router.get('/courses/:courseId/semanas/:semanaId/elementos/:elementoId/foro', courseController.getForoMessages);
router.put('/courses/:courseId/semanas/:semanaId/elementos/:elementoId/foro/:messageId', courseController.updateMessageInForo);
router.delete('/courses/:courseId/semanas/:semanaId/elementos/:elementoId/foro/:messageId', courseController.deleteMessageInForo);

// Rutas para gestión de entregas de tareas
router.post('/courses/:courseId/semanas/:semanaId/elementos/:elementoId/entregas', courseController.addStudentTask);
router.get('/courses/:courseId/semanas/:semanaId/elementos/:elementoId/entregas', courseController.getTaskSubmissions);
router.put('/courses/:courseId/semanas/:semanaId/elementos/:elementoId/entregas/:entregaId', courseController.updateTaskSubmission);
router.delete('/courses/:courseId/semanas/:semanaId/elementos/:elementoId/entregas/:entregaId', courseController.deleteTaskSubmission);


module.exports = router;