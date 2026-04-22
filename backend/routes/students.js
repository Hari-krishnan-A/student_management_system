const express = require('express');
const pool = require('../db');

const router = express.Router();

function toInt(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return null;
  return Math.trunc(n);
}

function calcTotalAndAverage(marks) {
  const subjects = ['dbms', 'cn', 'toc', 'daa', 'evs', 'os'];
  let total = 0;

  for (const s of subjects) {
    const v = toInt(marks[s]);
    if (v === null) return null;
    total += v;
  }

  const average = total / 6;
  return { total, average };
}

router.get('/student/:regno', async (req, res) => {
  try {
    const regno = toInt(req.params.regno);
    if (regno === null) return res.status(400).json({ message: 'Invalid regno' });

    const [rows] = await pool.query('SELECT * FROM Students WHERE regno = ? LIMIT 1', [regno]);
    if (rows.length === 0) return res.status(404).json({ message: 'Student not found' });

    return res.json(rows[0]);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

router.post('/student', async (req, res) => {
  try {
    const body = req.body;

    const regno = toInt(body.regno);
    const year = toInt(body.year);

    if (regno === null || !body.name || year === null || !body.section) {
      return res.status(400).json({ message: 'Missing or invalid fields' });
    }

    const computed = calcTotalAndAverage(body);
    if (!computed) return res.status(400).json({ message: 'Marks must be valid numbers' });

    const payload = {
      regno,
      name: body.name,
      year,
      section: body.section,
      dbms: toInt(body.dbms),
      cn: toInt(body.cn),
      toc: toInt(body.toc),
      daa: toInt(body.daa),
      evs: toInt(body.evs),
      os: toInt(body.os),
      total: computed.total,
      average: computed.average
    };

    await pool.query(
      'INSERT INTO Students (regno, name, year, section, dbms, cn, toc, daa, evs, os, total, average) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        payload.regno,
        payload.name,
        payload.year,
        payload.section,
        payload.dbms,
        payload.cn,
        payload.toc,
        payload.daa,
        payload.evs,
        payload.os,
        payload.total,
        payload.average
      ]
    );

    return res.status(201).json({ message: 'Student inserted', regno: payload.regno });
  } catch (err) {
    if (err && err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Regno already exists' });
    }
    return res.status(500).json({ message: 'Server error' });
  }
});

router.put('/student/:regno', async (req, res) => {
  try {
    const regno = toInt(req.params.regno);
    if (regno === null) return res.status(400).json({ message: 'Invalid regno' });

    const body = req.body;
    const year = toInt(body.year);

    if (!body.name || year === null || !body.section) {
      return res.status(400).json({ message: 'Missing or invalid fields' });
    }

    const computed = calcTotalAndAverage(body);
    if (!computed) return res.status(400).json({ message: 'Marks must be valid numbers' });

    const [result] = await pool.query(
      'UPDATE Students SET name = ?, year = ?, section = ?, dbms = ?, cn = ?, toc = ?, daa = ?, evs = ?, os = ?, total = ?, average = ? WHERE regno = ?',
      [
        body.name,
        year,
        body.section,
        toInt(body.dbms),
        toInt(body.cn),
        toInt(body.toc),
        toInt(body.daa),
        toInt(body.evs),
        toInt(body.os),
        computed.total,
        computed.average,
        regno
      ]
    );

    if (result.affectedRows === 0) return res.status(404).json({ message: 'Student not found' });

    return res.json({ message: 'Student updated' });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/student/:regno', async (req, res) => {
  try {
    const regno = toInt(req.params.regno);
    if (regno === null) return res.status(400).json({ message: 'Invalid regno' });

    const [result] = await pool.query('DELETE FROM Students WHERE regno = ?', [regno]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Student not found' });

    return res.json({ message: 'Student deleted' });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
