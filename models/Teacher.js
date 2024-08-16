class Teacher {
    constructor(id, nom, prenom, email) {
      this.id = id;
      this.nom = nom;
      this.prenom = prenom;
      this.email = email;
    }
  
    static async getAllTeachers(connection) {
      return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM enseignants', (err, results) => {
          if (err) return reject(err);
          resolve(results.map(row => new Teacher(row.id, row.nom, row.prenom, row.email)));
        });
      });
    }
  
    static async addTeacher(connection, nom, prenom, email) {
      return new Promise((resolve, reject) => {
        connection.query('INSERT INTO enseignants (nom, prenom, email) VALUES (?, ?, ?)', [nom, prenom, email], (err, results) => {
          if (err) return reject(err);
          resolve(new Teacher(results.insertId, nom, prenom, email));
        });
      });
    }
  
    static async updateTeacher(connection, id, nom, prenom, email) {
      return new Promise((resolve, reject) => {
        connection.query('UPDATE enseignants SET nom = ?, prenom = ?, email = ? WHERE id = ?', [nom, prenom, email, id], (err) => {
          if (err) return reject(err);
          resolve();
        });
      });
    }
  
    static async deleteTeacher(connection, id) {
      return new Promise((resolve, reject) => {
        connection.query('DELETE FROM enseignants WHERE id = ?', [id], (err) => {
          if (err) return reject(err);
          resolve();
        });
      });
    }
  }
  module.exports = Teacher;
  