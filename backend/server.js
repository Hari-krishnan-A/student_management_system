var express = require('express');
var mysql = require('mysql2');

var app = express();

// This function gives result based on average
function getResultFromAverage(avg) {
  if (avg > 85) {
    return 'Distinction';
  }

  if (avg >= 50 && avg <= 85) {
    return 'Average';
  }

  return 'Fail';
}

// This allows frontend to send JSON data
app.use(express.json());

// Simple CORS (so browser can call APIs)
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});

// Database connection (edit password if needed)
var db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root456',
  database: 'student_management'
});

db.connect(function (err) {
  if (err) {
    console.log('Database connection failed');
    console.log(err);
  } else {
    console.log('Database connected');
  }
});

// This API checks login credentials
app.post('/login', function (req, res) {
  var username = req.body.username;
  var password = req.body.password;

  var sql = 'SELECT id, username, role FROM Users WHERE username = ? AND password = ? LIMIT 1';

  db.query(sql, [username, password], function (err, rows) {
    if (err) {
      return res.status(500).json({ success: false, message: 'Server error' });
    }

    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    return res.json({ success: true, user: rows[0] });
  });
});

// This API gets one student by regno
app.get('/student/:regno', function (req, res) {
  var regno = req.params.regno;

  var sql = 'SELECT * FROM Students WHERE regno = ?';
  db.query(sql, [regno], function (err, rows) {
    if (err) {
      return res.status(500).json({ message: 'Server error' });
    }

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }

    return res.json(rows[0]);
  });
});

// This API inserts a student into database
app.post('/student', function (req, res) {
  var s = req.body;

  // Calculate total and average (simple addition)
  var total =
    Number(s.dbms) +
    Number(s.cn) +
    Number(s.toc) +
    Number(s.daa) +
    Number(s.evs) +
    Number(s.os);

  // Keep 2 decimal places for database consistency (DECIMAL(5,2))
  var average = Number((total / 6).toFixed(2));
  var resultText = getResultFromAverage(average);

  var sql =
    'INSERT INTO Students (regno, name, year, section, dbms, cn, toc, daa, evs, os, total, average, result) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

  var values = [
    s.regno,
    s.name,
    s.year,
    s.section,
    s.dbms,
    s.cn,
    s.toc,
    s.daa,
    s.evs,
    s.os,
    total,
    average,
    resultText
  ];

  db.query(sql, values, function (err) {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ message: 'Regno already exists' });
      }
      return res.status(500).json({ message: 'Server error' });
    }

    return res.status(201).json({ message: 'Student inserted' });
  });
});

// This API updates a student by regno
app.put('/student/:regno', function (req, res) {
  var regno = req.params.regno;
  var s = req.body;

  var total =
    Number(s.dbms) +
    Number(s.cn) +
    Number(s.toc) +
    Number(s.daa) +
    Number(s.evs) +
    Number(s.os);

  // Keep 2 decimal places for database consistency (DECIMAL(5,2))
  var average = Number((total / 6).toFixed(2));
  var resultText = getResultFromAverage(average);

  var sql =
    'UPDATE Students SET name = ?, year = ?, section = ?, dbms = ?, cn = ?, toc = ?, daa = ?, evs = ?, os = ?, total = ?, average = ?, result = ? WHERE regno = ?';

  var values = [
    s.name,
    s.year,
    s.section,
    s.dbms,
    s.cn,
    s.toc,
    s.daa,
    s.evs,
    s.os,
    total,
    average,
    resultText,
    regno
  ];

  db.query(sql, values, function (err, result) {
    if (err) {
      return res.status(500).json({ message: 'Server error' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }

    return res.json({ message: 'Student updated' });
  });
});

// This API deletes a student by regno
app.delete('/student/:regno', function (req, res) {
  var regno = req.params.regno;

  var sql = 'DELETE FROM Students WHERE regno = ?';
  db.query(sql, [regno], function (err, result) {
    if (err) {
      return res.status(500).json({ message: 'Server error' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }

    return res.json({ message: 'Student deleted' });
  });
});

app.get('/', function (req, res) {
  res.send('Student Management System Backend');
});

var PORT = 3000;
app.listen(PORT, function () {
  console.log('Server running on http://localhost:' + PORT);
});
