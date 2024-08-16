class Course {
  constructor(id, titre, description, enseignant_id, enseignant_nom) {
    this.id = id;
    this.titre = titre;
    this.description = description;
    this.enseignant_id = enseignant_id;
    this.enseignant_nom = enseignant_nom;
  }

  static async getAllCourses(connection) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT cours.*, enseignants.nom AS enseignant_nom
        FROM cours
        JOIN enseignants ON cours.enseignant_id = enseignants.id
      `;
      connection.query(query, (err, results) => {
        if (err) return reject(err);
        resolve(results.map(row => new Course(row.id, row.titre, row.description, row.enseignant_id, row.enseignant_nom)));
      });
    });
  }

  
    static async addCourse(connection, titre, description, enseignant_id) {
      return new Promise((resolve, reject) => {
        connection.query('INSERT INTO cours (titre, description, enseignant_id) VALUES (?, ?, ?)', [titre, description, enseignant_id], (err, results) => {
          if (err) return reject(err);
          resolve(new Course(results.insertId, titre, description, enseignant_id));
        });
      });
    }
  
    static async updateCourse(connection, id, titre, description, enseignant_id) {
      return new Promise((resolve, reject) => {
        connection.query('UPDATE cours SET titre = ?, description = ?, enseignant_id = ? WHERE id = ?', [titre, description, enseignant_id, id], (err) => {
          if (err) return reject(err);
          resolve();
        });
      });
    }
  
    static async deleteCourse(connection, id) {
      return new Promise((resolve, reject) => {
        connection.query('DELETE FROM cours WHERE id = ?', [id], (err) => {
          if (err) return reject(err);
          resolve();
        });
      });
    }
  }
  module.exports = Course;
  