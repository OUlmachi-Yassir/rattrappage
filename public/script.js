// Define global variables for data
let students = [];
let teachers = [];
let courses = [];

// Function to fetch and display data
async function fetchData() {
  try {
    const [studentsRes, teachersRes, coursesRes] = await Promise.all([
      fetch('/students'),
      fetch('/teachers'),
      fetch('/courses'),
    ]);

    students = await studentsRes.json();
    teachers = await teachersRes.json();
    courses = await coursesRes.json();

    // Display students
    const studentsContainer = document.getElementById('students');
    studentsContainer.innerHTML = students.map(student => `
      <div class="bg-white p-4 mb-2 rounded shadow-md">
        <h3 class="text-xl font-semibold">${student.nom} ${student.prenom}</h3>
        <p>${student.email}</p>
        <button onclick="showEditStudentPopup(${student.id})" class="py-1 px-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 mt-2">Edit</button>
        <button onclick="deleteStudent(${student.id})" class="py-1 px-2 bg-red-500 text-white rounded-md hover:bg-red-600 mt-2">Delete</button>
      </div>
    `).join('');

    // Display teachers
    const teachersContainer = document.getElementById('teachers');
    teachersContainer.innerHTML = teachers.map(teacher => `
      <div class="bg-white p-4 mb-2 rounded shadow-md">
        <h3 class="text-xl font-semibold">${teacher.nom} ${teacher.prenom}</h3>
        <p>${teacher.email}</p>
        <button onclick="showEditTeacherPopup(${teacher.id})" class="py-1 px-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 mt-2">Edit</button>
        <button onclick="deleteTeacher(${teacher.id})" class="py-1 px-2 bg-red-500 text-white rounded-md hover:bg-red-600 mt-2">Delete</button>
      </div>
    `).join('');

    // Populate the teacher dropdown in the Add/Edit Course forms
    const courseTeacherSelect = document.getElementById('courseTeacher');
    const editCourseTeacherSelect = document.getElementById('editCourseTeacher');
    const teacherOptions = teachers.map(teacher => `
      <option value="${teacher.id}">${teacher.nom} ${teacher.prenom}</option>
    `).join('');

    courseTeacherSelect.innerHTML = `<option value="">Select a teacher</option>${teacherOptions}`;
    editCourseTeacherSelect.innerHTML = `<option value="">Select a teacher</option>${teacherOptions}`;

    // Display courses
    const coursesContainer = document.getElementById('courses');
    coursesContainer.innerHTML = courses.map(course => `
      <div class="bg-white p-4 mb-2 rounded shadow-md">
        <h3 class="text-xl font-semibold">${course.titre}</h3>
        <p>${course.description}</p>
        <p>${getTeacherNameById(course.enseignant_id)}</p>
        <button onclick="showEditCoursePopup(${course.id})" class="py-1 px-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 mt-2">Edit</button>
        <button onclick="deleteCourse(${course.id})" class="py-1 px-2 bg-red-500 text-white rounded-md hover:bg-red-600 mt-2">Delete</button>
      </div>
    `).join('');

  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

// Function to get teacher name by ID
function getTeacherNameById(id) {
  const teacher = teachers.find(teacher => teacher.id === id);
  return teacher ? `${teacher.nom} ${teacher.prenom}` : 'Without Teacher';
}

// Call fetchData when the page loads
document.addEventListener('DOMContentLoaded', fetchData);

// Event listeners for popups and forms

// Show add student popup
function showAddStudentPopup() {
  document.getElementById('addStudentPopup').classList.add('active');
}

// Close add student popup
document.getElementById('closeAddStudentPopup').addEventListener('click', () => {
  document.getElementById('addStudentPopup').classList.remove('active');
});

// Show add teacher popup
function showAddTeacherPopup() {
  document.getElementById('addTeacherPopup').classList.add('active');
}

// Close add teacher popup
document.getElementById('closeAddTeacherPopup').addEventListener('click', () => {
  document.getElementById('addTeacherPopup').classList.remove('active');
});

// Show add course popup
function showAddCoursePopup() {
  document.getElementById('addCoursePopup').classList.add('active');
}

// Close add course popup
document.getElementById('closeAddCoursePopup').addEventListener('click', () => {
  document.getElementById('addCoursePopup').classList.remove('active');
});

// Show edit student popup
function showEditStudentPopup(studentId) {
  const student = students.find(s => s.id === studentId);
  if (student) {
    document.getElementById('editStudentId').value = student.id;
    document.getElementById('editStudentNom').value = student.nom;
    document.getElementById('editStudentPrenom').value = student.prenom;
    document.getElementById('editStudentEmail').value = student.email;
    document.getElementById('editStudentPopup').classList.add('active');
  }
}

// Close edit student popup
document.getElementById('closeEditStudentPopup').addEventListener('click', () => {
  document.getElementById('editStudentPopup').classList.remove('active');
});

// Show edit teacher popup
function showEditTeacherPopup(teacherId) {
  const teacher = teachers.find(t => t.id === teacherId);
  if (teacher) {
    document.getElementById('editTeacherId').value = teacher.id;
    document.getElementById('editTeacherNom').value = teacher.nom;
    document.getElementById('editTeacherPrenom').value = teacher.prenom;
    document.getElementById('editTeacherEmail').value = teacher.email;
    document.getElementById('editTeacherPopup').classList.add('active');
  }
}

// Close edit teacher popup
document.getElementById('closeEditTeacherPopup').addEventListener('click', () => {
  document.getElementById('editTeacherPopup').classList.remove('active');
});

// Show edit course popup
function showEditCoursePopup(courseId) {
  const course = courses.find(c => c.id === courseId);
  if (course) {
    document.getElementById('editCourseId').value = course.id;
    document.getElementById('editCourseTitre').value = course.titre;
    document.getElementById('editCourseDescription').value = course.description;
    document.getElementById('editCourseTeacher').value = course.enseignant_id || '';
    document.getElementById('editCoursePopup').classList.add('active');
  }
}

// Close edit course popup
document.getElementById('closeEditCoursePopup').addEventListener('click', () => {
  document.getElementById('editCoursePopup').classList.remove('active');
});

// Handle add student form submission
document.getElementById('addStudentForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const nom = document.getElementById('studentNom').value;
  const prenom = document.getElementById('studentPrenom').value;
  const email = document.getElementById('studentEmail').value;

  try {
    await fetch('/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nom, prenom, email })
    });
    document.getElementById('addStudentPopup').classList.remove('active');
    fetchData();
  } catch (error) {
    console.error('Error adding student:', error);
  }
});

// Handle edit student form submission
document.getElementById('editStudentForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const id = document.getElementById('editStudentId').value;
  const nom = document.getElementById('editStudentNom').value;
  const prenom = document.getElementById('editStudentPrenom').value;
  const email = document.getElementById('editStudentEmail').value;

  try {
    await fetch(`/students/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nom, prenom, email })
    });
    document.getElementById('editStudentPopup').classList.remove('active');
    fetchData();
  } catch (error) {
    console.error('Error editing student:', error);
  }
});

// Handle delete student
async function deleteStudent(id) {
  if (confirm('Are you sure you want to delete this student?')) {
    try {
      await fetch(`/students/${id}`, {
        method: 'DELETE'
      });
      fetchData();
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  }
}

// Handle add teacher form submission
document.getElementById('addTeacherForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const nom = document.getElementById('teacherNom').value;
  const prenom = document.getElementById('teacherPrenom').value;
  const email = document.getElementById('teacherEmail').value;

  try {
    await fetch('/teachers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nom, prenom, email })
    });
    document.getElementById('addTeacherPopup').classList.remove('active');
    fetchData();
  } catch (error) {
    console.error('Error adding teacher:', error);
  }
});

// Handle edit teacher form submission
document.getElementById('editTeacherForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const id = document.getElementById('editTeacherId').value;
  const nom = document.getElementById('editTeacherNom').value;
  const prenom = document.getElementById('editTeacherPrenom').value;
  const email = document.getElementById('editTeacherEmail').value;

  try {
    await fetch(`/teachers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nom, prenom, email })
    });
    document.getElementById('editTeacherPopup').classList.remove('active');
    fetchData();
  } catch (error) {
    console.error('Error editing teacher:', error);
  }
});

// Handle delete teacher
async function deleteTeacher(id) {
  if (confirm('Are you sure you want to delete this teacher?')) {
    try {
      await fetch(`/teachers/${id}`, {
        method: 'DELETE'
      });
      fetchData();
    } catch (error) {
      console.error('Error deleting teacher:', error);
    }
  }
}

// Handle add course form submission
document.getElementById('addCourseForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const titre = document.getElementById('courseTitre').value;
  const description = document.getElementById('courseDescription').value;
  const enseignant_id = document.getElementById('courseTeacher').value;

  try {
    await fetch('/courses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ titre, description, enseignant_id })
    });
    document.getElementById('addCoursePopup').classList.remove('active');
    fetchData();
  } catch (error) {
    console.error('Error adding course:', error);
  }
});

// Handle edit course form submission
document.getElementById('editCourseForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const id = document.getElementById('editCourseId').value;
  const titre = document.getElementById('editCourseTitre').value;
  const description = document.getElementById('editCourseDescription').value;
  const enseignant_id = document.getElementById('editCourseTeacher').value;

  try {
    await fetch(`/courses/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ titre, description, enseignant_id })
    });
    document.getElementById('editCoursePopup').classList.remove('active');
    fetchData();
  } catch (error) {
    console.error('Error editing course:', error);
  }
});

// Handle delete course
async function deleteCourse(id) {
  if (confirm('Are you sure you want to delete this course?')) {
    try {
      await fetch(`/courses/${id}`, {
        method: 'DELETE'
      });
      fetchData();
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  }
}
