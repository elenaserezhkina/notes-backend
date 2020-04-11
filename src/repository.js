const connection = require("./connection");

module.exports = {
  findAll(callback) {
    connection.query("SELECT * FROM notes;", (err, results) => {
      callback(err, results);
    });
  },
  create(text, callback) {
    connection.query(
      "INSERT INTO notes (text, created_at) values (?, ?)",
      [text, new Date()],
      (err) => {
        callback(err);
      }
    );
  },
  deleteAll(callback) {
    connection.query("DELETE FROM notes;", (err) => {
      callback(err);
    });
  },
  closeConnection(callback) {
    connection.end(callback);
  },
};
