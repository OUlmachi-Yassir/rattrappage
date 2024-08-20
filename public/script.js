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

// Show popup functions
function showAddStudentPopup() {
  document.getElementById('addStudentPopup').classList.add('active');
}

function showEditStudentPopup(id) {
  // Populate form with existing data
  const student = students.find(s => s.id === id);
  document.getElementById('editStudentId').value = student.id;
  document.getElementById('editStudentNom').value = student.nom;
  document.getElementById('editStudentPrenom').value = student.prenom;
  document.getElementById('editStudentEmail').value = student.email;
  
  document.getElementById('editStudentPopup').classList.add('active');
}

function showAddTeacherPopup() {
  document.getElementById('addTeacherPopup').classList.add('active');
}

function showEditTeacherPopup(id) {
  // Populate form with existing data
  const teacher = teachers.find(t => t.id === id);
  document.getElementById('editTeacherId').value = teacher.id;
  document.getElementById('editTeacherNom').value = teacher.nom;
  document.getElementById('editTeacherPrenom').value = teacher.prenom;
  document.getElementById('editTeacherEmail').value = teacher.email;
  
  document.getElementById('editTeacherPopup').classList.add('active');
}

function showAddCoursePopup() {
  document.getElementById('addCoursePopup').classList.add('active');
}

function showEditCoursePopup(id) {
  // Populate form with existing data
  const course = courses.find(c => c.id === id);
  document.getElementById('editCourseId').value = course.id;
  document.getElementById('editCourseTitre').value = course.titre;
  document.getElementById('editCourseDescription').value = course.description;
  
  // Populate the teacher dropdown
  const teacherDropdown = document.getElementById('editCourseTeacher');
  teacherDropdown.innerHTML = teachers.map(teacher => `
    <option value="${teacher.id}" ${teacher.id === course.enseignant_id ? 'selected' : ''}>
      ${teacher.nom} ${teacher.prenom}
    </option>
  `).join('');

  document.getElementById('editCoursePopup').classList.add('active');
}



// Hide popup functions
function hidePopup(popupId) {
  document.getElementById(popupId).classList.remove('active');
}

// Event listeners for closing popups
document.getElementById('closeEditStudentPopup').addEventListener('click', () => hidePopup('editStudentPopup'));
document.getElementById('closeAddStudentPopup').addEventListener('click', () => hidePopup('addStudentPopup'));
document.getElementById('closeEditTeacherPopup').addEventListener('click', () => hidePopup('editTeacherPopup'));
document.getElementById('closeAddTeacherPopup').addEventListener('click', () => hidePopup('addTeacherPopup'));
document.getElementById('closeEditCoursePopup').addEventListener('click', () => hidePopup('editCoursePopup'));
document.getElementById('closeAddCoursePopup').addEventListener('click', () => hidePopup('addCoursePopup'));

// Form submit handlers
document.getElementById('addStudentForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const student = {
    nom: document.getElementById('studentNom').value,
    prenom: document.getElementById('studentPrenom').value,
    email: document.getElementById('studentEmail').value
  };
  const response = await fetch('/students', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(student)
  });
  if (response.ok) {
    hidePopup('addStudentPopup');
    fetchData();
  } else {
    console.error('Error adding student');
  }
});

document.getElementById('editStudentForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const student = {
    id: document.getElementById('editStudentId').value,
    nom: document.getElementById('editStudentNom').value,
    prenom: document.getElementById('editStudentPrenom').value,
    email: document.getElementById('editStudentEmail').value
  };
  const response = await fetch(`/students/${student.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(student)
  });
  if (response.ok) {
    hidePopup('editStudentPopup');
    fetchData();
  } else {
    console.error('Error updating student');
  }
});

document.getElementById('addTeacherForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const teacher = {
    nom: document.getElementById('teacherNom').value,
    prenom: document.getElementById('teacherPrenom').value,
    email: document.getElementById('teacherEmail').value
  };
  const response = await fetch('/teachers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(teacher)
  });
  if (response.ok) {
    hidePopup('addTeacherPopup');
    fetchData();
  } else {
    console.error('Error adding teacher');
  }
});

document.getElementById('editTeacherForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const teacher = {
    id: document.getElementById('editTeacherId').value,
    nom: document.getElementById('editTeacherNom').value,
    prenom: document.getElementById('editTeacherPrenom').value,
    email: document.getElementById('editTeacherEmail').value
  };
  const response = await fetch(`/teachers/${teacher.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(teacher)
  });
  if (response.ok) {
    hidePopup('editTeacherPopup');
    fetchData();
  } else {
    console.error('Error updating teacher');
  }
});


document.getElementById('addCourseForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const course = {
    titre: document.getElementById('courseTitre').value,
    description: document.getElementById('courseDescription').value,
    enseignant_id: document.getElementById('courseTeacher').value
  };
  const response = await fetch('/courses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(course)
  });
  if (response.ok) {
    hidePopup('addCoursePopup');
    fetchData();
  } else {
    console.error('Error adding course');
  }
});

document.getElementById('editCourseForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const course = {
    id: document.getElementById('editCourseId').value,
    titre: document.getElementById('editCourseTitre').value,
    description: document.getElementById('editCourseDescription').value,
    enseignant_id: document.getElementById('editCourseTeacher').value
  };
  const response = await fetch(`/courses/${course.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(course)
  });
  if (response.ok) {
    hidePopup('editCoursePopup');
    fetchData();
  } else {
    console.error('Error updating course');
  }
});


// Delete functions
async function deleteStudent(id) {
  if (confirm('Are you sure you want to delete this student?')) {
    const response = await fetch(`/students/${id}`, { method: 'DELETE' });
    if (response.ok) {
      fetchData();
    } else {
      console.error('Error deleting student');
    }
  }
}

async function deleteTeacher(id) {
  if (confirm('Are you sure you want to delete this teacher?')) {
    const response = await fetch(`/teachers/${id}`, { method: 'DELETE' });
    if (response.ok) {
      fetchData();
    } else {
      console.error('Error deleting teacher');
    }
  }
}

async function deleteCourse(id) {
  if (confirm('Are you sure you want to delete this course?')) {
    const response = await fetch(`/courses/${id}`, { method: 'DELETE' });
    if (response.ok) {
      fetchData();
    } else {
      console.error('Error deleting course');
    }
  }
}

// Initialize
fetchData();
