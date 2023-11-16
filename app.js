'use strict';

const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser')

const PORT = 3000;
const HOST = '0.0.0.0';

const connection = mysql.createConnection({
  host: 'db',
  user: 'root',
  port: '3306',
  password: 'root',
  database: 'nodedb',
  connectionLimit: 10
});

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {

  connection.query('SELECT * FROM people', (err, results) => {
    if (err) {
      console.error(err);
      res.send('Error fetching names');
      return;
    }

    const bodyHTML = `
    <h1>Full Cycle Rocks!</h1>
    <form method="post">
      <label for="name">Enter name:</label>
      <input type="text" id="name" name="name" required>
      <button type="submit">Register</button>
    </form>
    <table>
        <thead>
          <tr>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          ${results.map(person => `<tr><td>${person.name}</td></tr>`).join('')}
        </tbody>
      </table>
  `;
    res.send(bodyHTML);
  });
});

app.post('/', (req, res) => {
  const name = req.body.name;

  connection.query('INSERT INTO people (name) VALUES (?)', [name], (err) => {
    if (err) {
      console.error(err);
      res.send('Error registering name');
      return;
    }

    res.redirect('/'); // Redirect back to the registration form
  });
});

app.listen(PORT, HOST, () => {
  console.log(`Running on http://${HOST}:${PORT}`);
});