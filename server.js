const express = require('express');
const mysql = require('mysql');
const path = require('path');
const Student = require('./models/Student');
const Teacher = require('./models/Teacher');
const Course = require('./models/Course');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'gestion_ecole'
});

connection.connect(err => {
  if (err) throw err;
  console.log('Connected to the database.');
});

// Define your API routes here

// CRUD routes for Students
app.get('/students', async (req, res) => {
  try {
    const students = await Student.getAllStudents(connection);
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/students', async (req, res) => {
  try {
    const { nom, prenom, email } = req.body;
    const student = await Student.addStudent(connection, nom, prenom, email);
    res.status(201).json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/students/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, prenom, email } = req.body;
    await Student.updateStudent(connection, id, nom, prenom, email);
    res.sendStatus(200);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/students/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Student.deleteStudent(connection, id);
    res.sendStatus(200);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CRUD routes for Teachers
app.get('/teachers', async (req, res) => {
  try {
    const teachers = await Teacher.getAllTeachers(connection);
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/teachers', async (req, res) => {
  try {
    const { nom, prenom, email } = req.body;
    const teacher = await Teacher.addTeacher(connection, nom, prenom, email);
    res.status(201).json(teacher);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/teachers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, prenom, email } = req.body;
    await Teacher.updateTeacher(connection, id, nom, prenom, email);
    res.sendStatus(200);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/teachers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Teacher.deleteTeacher(connection, id);
    res.sendStatus(200);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CRUD routes for Courses
app.get('/courses', async (req, res) => {
  try {
    const courses = await Course.getAllCourses(connection);
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/courses', async (req, res) => {
  try {
    const { titre, description, enseignant_id } = req.body;
    const course = await Course.addCourse(connection, titre, description, enseignant_id);
    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/courses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { titre, description, enseignant_id } = req.body;
    await Course.updateCourse(connection, id, titre, description, enseignant_id);
    res.sendStatus(200);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/courses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Course.deleteCourse(connection, id);
    res.sendStatus(200);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route to enroll a student in a course
app.post('/enroll', async (req, res) => {
  try {
    const { etudiant_id, cours_id, date_inscription } = req.body;
    connection.query('INSERT INTO inscriptions (etudiant_id, cours_id, date_inscription) VALUES (?, ?, ?)', [etudiant_id, cours_id, date_inscription], (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: results.insertId, etudiant_id, cours_id, date_inscription });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route to get available courses
app.get('/available-courses', async (req, res) => {
  try {
    const courses = await Course.getAllCourses(connection);
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start the server
const PORT = process.env.PORT || 8800;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
