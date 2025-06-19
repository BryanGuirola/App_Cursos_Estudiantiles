// Importar los modelos
const Course = require('../models/Course');
const User = require('../models/User'); // Si necesitas gestionar usuarios

// Controlador para crear un nuevo curso
exports.createCourse = async (req, res) => {
  try {
    const { title, progress, visible, highlighted, descripcion, semanas } = req.body;
    const newCourse = new Course({
      title,
      progress,
      visible,
      highlighted,
      descripcion,
      semanas
    });
    const savedCourse = await newCourse.save();
    res.status(201).json(savedCourse);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el curso', error });
  }
};

// Controlador para obtener todos los cursos
exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate('estudiantes').populate('profesores');
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los cursos', error });
  }
};

// Controlador para obtener un curso por ID
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
    if (!course) {
      return res.status(404).json({ message: 'Curso no encontrado' });
    }
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el curso', error });
  }
};

// Controlador para actualizar un curso
exports.updateCourse = async (req, res) => {
  try {
    const { title, progress, visible, highlighted, descripcion, semanas } = req.body;
    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      { title, progress, visible, highlighted, descripcion, semanas },
      { new: true }
    );
    if (!updatedCourse) {
      return res.status(404).json({ message: 'Curso no encontrado' });
    }
    res.status(200).json(updatedCourse);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el curso', error });
  }
};

// Controlador para eliminar un curso
exports.deleteCourse = async (req, res) => {
  try {
    const deletedCourse = await Course.findByIdAndDelete(req.params.id);
    if (!deletedCourse) {
      return res.status(404).json({ message: 'Curso no encontrado' });
    }
     console.log(deletedCourse.estudiantes)
    await User.updateMany(
      { _id: { $in: deletedCourse.estudiantes, $in: deletedCourse.profesores } },
      { $pull: { enrolledCourses: { _id: deletedCourse._id } } }
    );


    res.status(200).json({ message: 'Curso eliminado con éxito' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el curso', error });
  }
};

// Controlador para agregar un estudiante a un curso
// Obtener todos los estudiantes con rol "alumno"
exports.getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'alumno' }).select('username fullName');
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la lista de estudiantes' });
  }
};

exports.getStudentsInCourse = async (req, res) => {
  const { courseId } = req.params; // Obtenemos el ID del curso desde los parámetros de la ruta

  try {
    const course = await Course.findById(courseId).populate('estudiantes', 'fullName'); // Asegúrate de que enrolledStudents sea una referencia a los usuarios

    if (!course) {
      return res.status(404).json({ error: 'Curso no encontrado' });
    }

    // Devolvemos la lista de estudiantes inscritos
    res.status(200).json(course.estudiantes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener estudiantes del curso' });
  }
};

// Agregar estudiantes a un curso
exports.addStudentsToCourse = async (req, res) => {
  const { courseId } = req.params;
  const { students } = req.body; // students es una lista de IDs de estudiantes
   
    
  try {
    const course = await Course.findById(courseId);
   
    if (!course) {
     
      return res.status(404).json({ error: 'Curso no encontrado' });
     
    }
      console.log("curso encontrado");
    // Agregar estudiantes al curso sin duplicados
    students.forEach(studentId => {
      
      if (!course.estudiantes.includes(studentId)) {
        
        course.estudiantes.push(studentId);
        console.log("Estudiante pushado");
      }
    });
    console.log("C");
    await course.save();
    
    // Actualizar el campo enrolledCourses de cada estudiante
    await User.updateMany(
      { _id: { $in: students } },
      { $addToSet: { enrolledCourses: { _id: courseId, title: course.title } } }
    );
    console.log("actualizado en user");
    res.status(200).json(course);
    console.log("F");
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar estudiantes al curso' });
  }
};

// Eliminar un estudiante de un curso
exports.removeStudentFromCourse = async (req, res) => {
  const { courseId, studentId } = req.params;

  try {
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ error: 'Curso no encontrado' });
    }

    // Remover el estudiante del curso
    course.estudiantes = course.estudiantes.filter(
      id => id.toString() !== studentId
    );
    await course.save();

    // Remover el curso de la lista de cursos inscritos del estudiante
    await User.findByIdAndUpdate(studentId, {
      $pull: { enrolledCourses: { id: courseId } }
    });

    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el estudiante del curso' });
  }
};

// Obtener cursos para un estudiante
exports.getCoursesForStudent = async (req, res) => {
  try {
    console.log(req.user.userId);
      const studentId = req.user.userId; // Asumimos que el ID del usuario está en req.user.id
      console.log(studentId);
      const user = await User.findById(studentId);

      if (!user) {
          return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      // Buscar cursos donde el estudiante está inscrito
      const courses = await Course.find({ estudiantes: studentId });
      res.status(200).json(courses);
  } catch (error) {
      res.status(500).json({ message: 'Error al obtener cursos para el estudiante', error });
  }
};

// Obtener cursos para un profesor
exports.getCoursesForTeacher = async (req, res) => {
  try {
      const teacherId = req.user.id; // Asumimos que el ID del usuario está en req.user.id
      const courses = await Course.find({ profesores: teacherId });
      res.status(200).json(courses);
  } catch (error) {
      res.status(500).json({ message: 'Error al obtener cursos para el profesor', error });
  }
};

// Obtener profesores asignados a un curso
exports.getProfessorsInCourse = async (req, res) => {
  const { courseId } = req.params;

  try {
    const course = await Course.findById(courseId).populate('profesores', 'fullName');

    if (!course) {
      return res.status(404).json({ error: 'Curso no encontrado' });
    }

    res.status(200).json(course.profesores);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener profesores del curso' });
  }
};

// Agregar profesores a un curso
exports.addProfessorsToCourse = async (req, res) => {
  const { courseId } = req.params;
  const { professors } = req.body;

  try {
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ error: 'Curso no encontrado' });
    }

    professors.forEach(professorId => {
      if (!course.profesores.includes(professorId)) {
        course.profesores.push(professorId);
      }
    });

    await course.save();

    await User.updateMany(
      { _id: { $in: professors } },
      { $addToSet: { enrolledCourses: { _id: courseId, title: course.title } } }
    );
    
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar profesores al curso' });
  }
};

// Eliminar un profesor de un curso
exports.removeProfessorFromCourse = async (req, res) => {
  const { courseId, professorId } = req.params;

  try {
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ error: 'Curso no encontrado' });
    }

    course.profesores = course.profesores.filter(
      id => id.toString() !== professorId
    );

    await course.save();

    await User.findByIdAndUpdate( professorId, {
      $pull: { enrolledCourses: { id: courseId } }
    });

    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el profesor del curso' });
  }
};

// Obtener todos los cursos para un administrador
exports.getAllCourses = async (req, res) => {
  try {
      const courses = await Course.find();
      res.status(200).json(courses);
  } catch (error) {
      res.status(500).json({ message: 'Error al obtener todos los cursos', error });
  }
};

// Obtener todos los profesores
exports.getAllTeachers = async (req, res) => {
  try {
    const teachers = await User.find({ role: 'profesor' }, 'username fullName'); // Ajusta los campos según tu esquema de usuario
    console.log(teachers);
    res.status(200).json(teachers);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la lista de profesores' });
  }
};
// Controlador para asignar un profesor a un curso
exports.assignTeacherToCourse = async (req, res) => {
  try {
    const { teacherId } = req.body;
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Curso no encontrado' });
    }
    if (!course.profesores.includes(teacherId)) {
      course.profesores.push(teacherId);
    }
    await course.save();
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: 'Error al asignar el profesor', error });
  }
};

exports.addWeekToCourse = async (req, res) => {
  try {
      const { id } = req.params; // ID del curso
      const { numeroSemana, contenido } = req.body;

      const course = await Course.findById(id);
      if (!course) {
          return res.status(404).json({ message: 'Curso no encontrado' });
      }

      const newWeek = {
          numeroSemana,
          contenido,
          elementos: []
      };

      course.semanas.push(newWeek);
      const updatedCourse = await course.save();
      res.status(201).json(updatedCourse);
  } catch (error) {
      res.status(500).json({ message: 'Error al agregar la semana', error });
  }
};

//Eliminar Semana de Curso
exports.deleteWeekFromCourse = async (req, res) => {
  try {
      const { id } = req.params; // ID del curso
      const { idweek } = req.body; // ID de la semana a eliminar

      const course = await Course.findById(id);
      if (!course) {
          return res.status(404).json({ message: 'Curso no encontrado' });
      }

      // Buscar el índice de la semana que coincida con el idweek especificado
      const semanaIndex = course.semanas.findIndex(semana => semana._id.toString() === idweek);
      if (semanaIndex === -1) {
          return res.status(404).json({ message: 'Semana no encontrada en el curso' });
      }

      // Eliminar la semana del array
      course.semanas.splice(semanaIndex, 1);
      const updatedCourse = await course.save();
      res.status(200).json(updatedCourse);
  } catch (error) {
      res.status(500).json({ message: 'Error al eliminar la semana', error });
  }
};


// Controlador para agregar un elemento (tarea, foro, examen) a una semana
exports.addElementToWeek = async (req, res) => {
  try {
      const { id, weekId } = req.params; // ID del curso y de la semana
      const { tipo, titulo, descripcion,linkDocumento, fechaApertura, fechaCierre, estado } = req.body;

      const course = await Course.findById(id);
      if (!course) {
          return res.status(404).json({ message: 'Curso no encontrado' });
      }

      const week = course.semanas.id(weekId);
      if (!week) {
          return res.status(404).json({ message: 'Semana no encontrada' });
      }

      const newElement = {
          tipo,
          titulo,
          descripcion,
          linkDocumento,
          fechaApertura,
          fechaCierre,
          estado
      };
       console.log("si");
      week.elementos.push(newElement);
      console.log(newElement);
      const updatedCourse = await course.save();
      res.status(201).json(updatedCourse);
  } catch (error) {
      res.status(500).json({ message: 'Error al agregar el elemento', error });
  }
};

// Controlador para actualizar un elemento de una semana
exports.updateElementInWeek = async (req, res) => {
  try {
      const { id, weekId, elementId } = req.params;
      const { tipo, titulo, descripcion, fechaApertura, fechaCierre, estado } = req.body;

      const course = await Course.findById(id);
      if (!course) {
          return res.status(404).json({ message: 'Curso no encontrado' });
      }

      const week = course.semanas.id(weekId);
      if (!week) {
          return res.status(404).json({ message: 'Semana no encontrada' });
      }

      const element = week.elementos.id(elementId);
      if (!element) {
          return res.status(404).json({ message: 'Elemento no encontrado' });
      }

      element.tipo = tipo;
      element.titulo = titulo;
      element.descripcion = descripcion;
      element.fechaApertura = fechaApertura;
      element.fechaCierre = fechaCierre;
      element.estado = estado;

      const updatedCourse = await course.save();
      res.status(200).json(updatedCourse);
  } catch (error) {
      res.status(500).json({ message: 'Error al actualizar el elemento', error });
  }
};

// Controlador para eliminar un elemento de una semana
exports.deleteElementFromWeek = async (req, res) => {
  try {
      const { id, weekId, elementId } = req.params;

      const course = await Course.findById(id);
      if (!course) {
          return res.status(404).json({ message: 'Curso no encontrado' });
      }
     
      const week = course.semanas.id(weekId);
      if (!week) {
          return res.status(404).json({ message: 'Semana no encontrada' });
      }
   
      const element = week.elementos.id(elementId);
      if (!element) {
          return res.status(404).json({ message: 'elemento no encontrado' });
      }
      
  
      week.elementos.id(elementId).deleteOne();
     
      const updatedCourse = await course.save();
    
      res.status(200).json(updatedCourse);
      console.log("llegamos aqui 0")
  } catch (error) {
      res.status(500).json({ message: 'Error al eliminar el elemento', error });
  }
};


// Crear mensaje en foro
exports.addMessageToForo = async (req, res) => {
  const { courseId, semanaId, elementoId } = req.params;
  const { mensaje, estudianteId, nombreEstudiante } = req.body;

  try {
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ error: 'Curso no encontrado' });

    const semana = course.semanas.id(semanaId);
    if (!semana) return res.status(404).json({ error: 'Semana no encontrada' });

    const elemento = semana.elementos.id(elementoId);
    if (!elemento || elemento.tipo !== 'foro') {
      return res.status(404).json({ error: 'Foro no encontrado en los elementos de la semana' });
    }

    // Asegurarse de que `foro` y `mensajes` estén inicializados
    if (!elemento.foro) elemento.foro = { mensajes: [] };
    elemento.foro.mensajes.push({ estudianteId, nombreEstudiante, mensaje });

    await course.save();
    res.status(201).json({ message: 'Mensaje agregado al foro', foro: elemento.foro });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener mensajes del foro
exports.getForoMessages = async (req, res) => {
  const { courseId, semanaId, elementoId } = req.params;

  try {
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ error: 'Curso no encontrado' });

    const semana = course.semanas.id(semanaId);
    if (!semana) return res.status(404).json({ error: 'Semana no encontrada' });

    const elemento = semana.elementos.id(elementoId);
    if (!elemento || elemento.tipo !== 'foro' || !elemento.foro) {
      return res.status(404).json({ error: 'Foro no encontrado en los elementos de la semana' });
    }

    res.status(200).json(elemento.foro);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar mensaje del foro
exports.updateMessageInForo = async (req, res) => {
  const { courseId, semanaId, elementoId, messageId } = req.params;
  const { mensaje } = req.body;

  try {
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ error: 'Curso no encontrado' });

    const semana = course.semanas.id(semanaId);
    if (!semana) return res.status(404).json({ error: 'Semana no encontrada' });

    const elemento = semana.elementos.id(elementoId);
    if (!elemento || elemento.tipo !== 'foro' || !elemento.foro) {
      return res.status(404).json({ error: 'Foro no encontrado en los elementos de la semana' });
    }

    const foroMessage = elemento.foro.mensajes.id(messageId);
    if (!foroMessage) return res.status(404).json({ error: 'Mensaje no encontrado en el foro' });

    foroMessage.mensaje = mensaje;
    await course.save();

    res.status(200).json({ message: 'Mensaje actualizado', foroMessage });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar mensaje del foro
exports.deleteMessageInForo = async (req, res) => {
  const { courseId, semanaId, elementoId, messageId } = req.params;

  try {
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ error: 'Curso no encontrado' });

    const semana = course.semanas.id(semanaId);
    if (!semana) return res.status(404).json({ error: 'Semana no encontrada' });

    const elemento = semana.elementos.id(elementoId);
    if (!elemento || elemento.tipo !== 'foro' || !elemento.foro) {
      return res.status(404).json({ error: 'Foro no encontrado en los elementos de la semana' });
    }

    const foroMessage = elemento.foro.mensajes.id(messageId);
    if (!foroMessage) return res.status(404).json({ error: 'Mensaje no encontrado en el foro' });

    foroMessage.remove();
    await course.save();

    res.status(200).json({ message: 'Mensaje eliminado del foro' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Agregar tarea de un estudiante
exports.addStudentTask = async (req, res) => {
  const { courseId, semanaId, elementoId } = req.params;
  const { estudianteId, nombreEstudiante, linkTarea } = req.body;

  try {
    const course = await Course.findById(courseId);
    const tareaElement = course.semanas.id(semanaId).elementos.id(elementoId);

    tareaElement.entregas.push({ estudianteId, nombreEstudiante, linkTarea });
    await course.save();

    res.status(201).json({ message: 'Tarea entregada', entregas: tareaElement.entregas });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener todas las entregas de tareas
exports.getTaskSubmissions = async (req, res) => {
  const { courseId, semanaId, elementoId } = req.params;

  try {
    const course = await Course.findById(courseId);
    const entregas = course.semanas.id(semanaId).elementos.id(elementoId).entregas;

    res.status(200).json(entregas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar una entrega de tarea
exports.updateTaskSubmission = async (req, res) => {
  const { courseId, semanaId, elementoId, entregaId } = req.params;
  const { linkTarea } = req.body;

  try {
    const course = await Course.findById(courseId);
    const entrega = course.semanas.id(semanaId)
      .elementos.id(elementoId)
      .entregas.id(entregaId);

    if (entrega) {
      entrega.linkTarea = linkTarea;
      await course.save();
      res.status(200).json({ message: 'Tarea actualizada', entrega });
    } else {
      res.status(404).json({ message: 'Entrega no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar una entrega de tarea
exports.deleteTaskSubmission = async (req, res) => {
  const { courseId, semanaId, elementoId, entregaId } = req.params;

  try {
    const course = await Course.findById(courseId);
    const entregas = course.semanas.id(semanaId).elementos.id(elementoId).entregas;
    entregas.id(entregaId).remove();

    await course.save();
    res.status(200).json({ message: 'Entrega de tarea eliminada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
