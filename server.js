const express = require('express');
const mysql = require('mysql');
const path = require('path');
const session = require('express-session');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'ytoop66', 
  resave: false,
  saveUninitialized: true
}));

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

// Serve the login page
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Handle login
app.post('/login', (req, res) => {
  const { email } = req.body;

  if (email === 'admin@gmail.com') {
    req.session.authenticated = 'admin';
    req.session.email = email; // Store email in session
    return res.redirect('/index.html');
  }

  connection.query('SELECT * FROM etudiants WHERE email = ?', [email], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Server error');
    }
    if (results.length > 0) {
      req.session.authenticated = 'student';
      req.session.email = email; // Store email in session
      return res.redirect('/studentCourses.html');
    }
    res.status(401).send('Unauthorized');
  });
});

// Middleware to protect routes
function ensureAuthenticated(role) {
  return (req, res, next) => {
    if (req.session && req.session.authenticated === role) {
      return next();
    }
    res.redirect('/login');
  };
}

// Serve protected pages
app.get('/index.html', ensureAuthenticated('admin'), (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/studentCourses.html', ensureAuthenticated('student'), (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'studentCourses.html'));
});

// Serve courses the student is enrolled in
app.get('/studentCourses', ensureAuthenticated('student'), (req, res) => {
  const studentEmail = req.session.email; // Use email stored in session for querying

  // Get student ID
  connection.query('SELECT id FROM etudiants WHERE email = ?', [studentEmail], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Server error');
    }

    const studentId = results[0].id;

    // Get courses the student is enrolled in
    connection.query(
      'SELECT cours.* FROM cours JOIN inscriptions ON cours.id = inscriptions.cours_id WHERE inscriptions.etudiant_id = ?',
      [studentId],
      (err, coursesEnrolled) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Server error');
        }

        // Get all available courses that the student is not enrolled in
        connection.query(
          'SELECT * FROM cours WHERE id NOT IN (SELECT cours_id FROM inscriptions WHERE etudiant_id = ?)',
          [studentId],
          (err, availableCourses) => {
            if (err) {
              console.error(err);
              return res.status(500).send('Server error');
            }

            res.json({ enrolled: coursesEnrolled, available: availableCourses });
          }
        );
      }
    );
  });
});

// Handle course enrollment
app.post('/enroll', ensureAuthenticated('student'), (req, res) => {
  const { courseId } = req.body;
  const studentEmail = req.session.email;

  connection.query('SELECT id FROM etudiants WHERE email = ?', [studentEmail], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Server error');
    }

    const studentId = results[0].id;

    // Insert enrollment record
    connection.query(
      'INSERT INTO inscriptions (etudiant_id, cours_id, date_inscription) VALUES (?, ?, NOW())',
      [studentId, courseId],
      (err) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Server error');
        }
        res.send('Enrolled successfully');
      }
    );
  });
});

// CRUD operations for students
app.get('/students', ensureAuthenticated('admin'), (req, res) => {
  connection.query('SELECT * FROM etudiants', (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Server error');
    }
    res.json(results);
  });
});

app.post('/students', ensureAuthenticated('admin'), (req, res) => {
  const { nom, prenom, email } = req.body;
  connection.query('INSERT INTO etudiants (nom, prenom, email) VALUES (?, ?, ?)', [nom, prenom, email], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Server error');
    }
    res.status(201).send('Student added');
  });
});

app.put('/students/:id', ensureAuthenticated('admin'), (req, res) => {
  const { id } = req.params;
  const { nom, prenom, email } = req.body;
  connection.query('UPDATE etudiants SET nom = ?, prenom = ?, email = ? WHERE id = ?', [nom, prenom, email, id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Server error');
    }
    res.send('Student updated');
  });
});

app.delete('/students/:id', ensureAuthenticated('admin'), (req, res) => {
  const { id } = req.params;
  connection.query('DELETE FROM etudiants WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Server error');
    }
    res.send('Student deleted');
  });
});

// CRUD operations for teachers
app.get('/teachers', ensureAuthenticated('admin'), (req, res) => {
  connection.query('SELECT * FROM enseignants', (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Server error');
    }
    res.json(results);
  });
});

app.post('/teachers', ensureAuthenticated('admin'), (req, res) => {
  const { nom, prenom, email } = req.body;
  connection.query('INSERT INTO enseignants (nom, prenom, email) VALUES (?, ?, ?)', [nom, prenom, email], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Server error');
    }
    res.status(201).send('Teacher added');
  });
});

app.put('/teachers/:id', ensureAuthenticated('admin'), (req, res) => {
  const { id } = req.params;
  const { nom, prenom, email } = req.body;
  connection.query('UPDATE enseignants SET nom = ?, prenom = ?, email = ? WHERE id = ?', [nom, prenom, email, id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Server error');
    }
    res.send('Teacher updated');
  });
});

app.delete('/teachers/:id', ensureAuthenticated('admin'), (req, res) => {
  const { id } = req.params;
  connection.query('DELETE FROM enseignants WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Server error');
    }
    res.send('Teacher deleted');
  });
});

// CRUD operations for courses
app.get('/courses', ensureAuthenticated('admin'), (req, res) => {
  connection.query('SELECT * FROM cours', (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Server error');
    }
    res.json(results);
  });
});

app.post('/courses', ensureAuthenticated('admin'), (req, res) => {
  const { titre, description, enseignant_id } = req.body;
  connection.query('INSERT INTO cours (titre, description, enseignant_id) VALUES (?, ?, ?)', [titre, description, enseignant_id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Server error');
    }
    res.status(201).send('Course added');
  });
});

app.put('/courses/:id', ensureAuthenticated('admin'), (req, res) => {
  const { id } = req.params;
  const { titre, description, enseignant_id } = req.body;
  connection.query('UPDATE cours SET titre = ?, description = ?, enseignant_id = ? WHERE id = ?', [titre, description, enseignant_id, id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Server error');
    }
    res.send('Course updated');
  });
});

app.delete('/courses/:id', ensureAuthenticated('admin'), (req, res) => {
  const { id } = req.params;
  connection.query('DELETE FROM cours WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Server error');
    }
    res.send('Course deleted');
  });
});

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error(err);
      return res.status(500).send('Server error');
    }
    res.redirect('/login');
  });
});

const PORT = process.env.PORT || 8800;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
