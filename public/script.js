// Function to fetch and display data
async function fetchData() {
  try {
      const [studentsRes, teachersRes, coursesRes] = await Promise.all([
          fetch('/students'),
          fetch('/teachers'),
          fetch('/courses')
      ]);

      const students = await studentsRes.json();
      const teachers = await teachersRes.json();
      const courses = await coursesRes.json();

      // Display students
      const studentsDiv = document.getElementById('students');
      studentsDiv.innerHTML = '<ul class="space-y-2">' + students.map(student =>
        `<li class="flex justify-between items-center bg-white p-4 rounded-lg shadow-md">
          <div class="text-lg font-medium">${student.nom} ${student.prenom} (${student.email})</div>
          <div class="space-x-2">
            <button onclick="editStudent(${student.id}, '${student.nom}', '${student.prenom}', '${student.email}')"
              class="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500">Edit</button>
            <button onclick="deleteStudent(${student.id})"
              class="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500">Delete</button>
          </div>
        </li>`
      ).join('') + '</ul>';

      // Display teachers
      const teachersDiv = document.getElementById('teachers');
      teachersDiv.innerHTML = '<ul class="space-y-2">' + teachers.map(teacher =>
        `<li class="flex justify-between items-center bg-white p-4 rounded-lg shadow-md">
          <div class="text-lg font-medium">${teacher.nom} ${teacher.prenom} (${teacher.email})</div>
          <div class="space-x-2">
            <button onclick="editTeacher(${teacher.id}, '${teacher.nom}', '${teacher.prenom}', '${teacher.email}')"
              class="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500">Edit</button>
            <button onclick="deleteTeacher(${teacher.id})"
              class="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500">Delete</button>
          </div>
        </li>`
      ).join('') + '</ul>';

      // Display courses
      const coursesDiv = document.getElementById('courses');
      coursesDiv.innerHTML = '<ul class="space-y-2">' + courses.map(course =>
        `<li class="flex justify-between items-center bg-white p-4 rounded-lg shadow-md">
          <div class="text-lg font-medium">${course.titre} (${course.description})</div>
          <div class="space-x-2">
            <button onclick="editCourse(${course.id}, '${course.titre}', '${course.description}', ${course.enseignant_id})"
              class="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500">Edit</button>
            <button onclick="deleteCourse(${course.id})"
              class="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500">Delete</button>
          </div>
        </li>`
      ).join('') + '</ul>';

      // Populate enrollment options
      const studentSelect = document.getElementById('enrollStudentId');
      studentSelect.innerHTML = students.map(student => 
          `<option value="${student.id}">${student.nom} ${student.prenom}</option>`
      ).join('');

      const courseSelect = document.getElementById('enrollCourseId');
      courseSelect.innerHTML = courses.map(course => 
          `<option value="${course.id}">${course.titre}</option>`
      ).join('');

      // Populate teacher options for adding courses
      const teacherSelect = document.getElementById('courseEnseignantId');
      teacherSelect.innerHTML = teachers.map(teacher => 
          `<option value="${teacher.id}">${teacher.nom} ${teacher.prenom}</option>`
      ).join('');

  } catch (error) {
      console.error('Error fetching data:', error);
  }
}

// Function to handle form submissions
document.getElementById('addStudentForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  try {
      const nom = document.getElementById('studentNom').value;
      const prenom = document.getElementById('studentPrenom').value;
      const email = document.getElementById('studentEmail').value;
      await fetch('/students', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nom, prenom, email })
      });
      fetchData(); // Refresh data
  } catch (error) {
      console.error('Error adding student:', error);
  }
});

document.getElementById('addTeacherForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  try {
      const nom = document.getElementById('teacherNom').value;
      const prenom = document.getElementById('teacherPrenom').value;
      const email = document.getElementById('teacherEmail').value;
      await fetch('/teachers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nom, prenom, email })
      });
      fetchData(); // Refresh data
  } catch (error) {
      console.error('Error adding teacher:', error);
  }
});

document.getElementById('addCourseForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  try {
      const titre = document.getElementById('courseTitre').value;
      const description = document.getElementById('courseDescription').value;
      const enseignant_id = parseInt(document.getElementById('courseEnseignantId').value);
      await fetch('/courses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ titre, description, enseignant_id })
      });
      fetchData(); // Refresh data
  } catch (error) {
      console.error('Error adding course:', error);
  }
});

document.getElementById('enrollForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  try {
      const etudiant_id = parseInt(document.getElementById('enrollStudentId').value);
      const cours_id = parseInt(document.getElementById('enrollCourseId').value);
      const date_inscription = document.getElementById('enrollDate').value;
      await fetch('/enroll', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ etudiant_id, cours_id, date_inscription })
      });
      fetchData(); // Refresh data
  } catch (error) {
      console.error('Error enrolling student:', error);
  }
});

// Functions to delete entities
async function deleteStudent(id) {
  try {
      await fetch(`/students/${id}`, { method: 'DELETE' });
      fetchData(); // Refresh data
  } catch (error) {
      console.error('Error deleting student:', error);
  }
}

async function deleteTeacher(id) {
  try {
      await fetch(`/teachers/${id}`, { method: 'DELETE' });
      fetchData(); // Refresh data
  } catch (error) {
      console.error('Error deleting teacher:', error);
  }
}

async function deleteCourse(id) {
  try {
      await fetch(`/courses/${id}`, { method: 'DELETE' });
      fetchData(); // Refresh data
  } catch (error) {
      console.error('Error deleting course:', error);
  }
}

// Functions to handle edits (show pre-filled forms for editing)
function editStudent(id, nom, prenom, email) {
  document.getElementById('studentNom').value = nom;
  document.getElementById('studentPrenom').value = prenom;
  document.getElementById('studentEmail').value = email;
  // Add functionality to save changes if needed
}

function editTeacher(id, nom, prenom, email) {
  document.getElementById('teacherNom').value = nom;
  document.getElementById('teacherPrenom').value = prenom;
  document.getElementById('teacherEmail').value = email;
  // Add functionality to save changes if needed
}

function editCourse(id, titre, description, enseignant_nom, enseignant_prenom) {
  document.getElementById('courseTitre').value = titre;
  document.getElementById('courseDescription').value = description;
  document.getElementById('courseEnseignantId').value = enseignant_id; // This might need adjustment to select the correct option
  // Add functionality to save changes if needed
}

// Load data on page load
window.onload = fetchData;
