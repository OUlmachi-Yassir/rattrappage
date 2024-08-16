class Student {
    constructor(id, nom, prenom, email) {
      this.id = id;
      this.nom = nom;
      this.prenom = prenom;
      this.email = email;
    }
  
    static async getAllStudents(connection) {
      return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM etudiants', (err, results) => {
          if (err) return reject(err);
          resolve(results.map(row => new Student(row.id, row.nom, row.prenom, row.email)));
        });
      });
    }
  
    static async addStudent(connection, nom, prenom, email) {
      return new Promise((resolve, reject) => {
        connection.query('INSERT INTO etudiants (nom, prenom, email) VALUES (?, ?, ?)', [nom, prenom, email], (err, results) => {
          if (err) return reject(err);
          resolve(new Student(results.insertId, nom, prenom, email));
        });
      });
    }
  
    static async updateStudent(connection, id, nom, prenom, email) {
      return new Promise((resolve, reject) => {
        connection.query('UPDATE etudiants SET nom = ?, prenom = ?, email = ? WHERE id = ?', [nom, prenom, email, id], (err) => {
          if (err) return reject(err);
          resolve();
        });
      });
    }
  
    static async deleteStudent(connection, id) {
      return new Promise((resolve, reject) => {
        connection.query('DELETE FROM etudiants WHERE id = ?', [id], (err) => {
          if (err) return reject(err);
          resolve();
        });
      });
    }
  }
  module.exports = Student;
  