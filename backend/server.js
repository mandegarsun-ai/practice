const express = require('express');
const cors    = require('cors');
const bcrypt  = require('bcrypt');
const path    = require('path');
const { Pool } = require('pg');
require('dotenv').config();

const app  = express();
const PORT = process.env.PORT || 3000;
const SALT_ROUNDS = 10;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

const pool = new Pool({
  host:     process.env.DB_HOST,
  port:     process.env.DB_PORT,
  database: process.env.DB_NAME,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

/* ── helpers ──────────────────────────────────────── */
const ok  = (res, data, message = 'OK')        => res.json({ success: true,  data,    message });
const err = (res, message, status = 400)        => res.status(status).json({ success: false, data: null, message });

/* ════════════════════════════════════════════════════
   AUTH
════════════════════════════════════════════════════ */

/* POST /api/auth/register */
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return err(res, 'All fields are required');
    }

    const existing = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );
    if (existing.rows.length > 0) {
      return err(res, 'Email already registered', 409);
    }

    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, role`,
      [name, email, password_hash, role || 'support']
    );

    return ok(res, result.rows[0], 'Account created successfully');
  } catch (e) {
    console.error('register error:', e.message);
    return err(res, 'Registration failed. Please try again.', 500);
  }
});

/* POST /api/auth/login */
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return err(res, 'All fields are required');
    }

    const result = await pool.query(
      'SELECT id, name, role, password_hash FROM users WHERE email = $1',
      [email]
    );
    if (result.rows.length === 0) {
      return err(res, 'No account found with this email', 404);
    }

    const user  = result.rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return err(res, 'Incorrect password', 401);
    }

    return ok(res, { name: user.name, role: user.role }, 'Login successful');
  } catch (e) {
    console.error('login error:', e.message);
    return err(res, 'Login failed. Please try again.', 500);
  }
});

/* ════════════════════════════════════════════════════
   TICKETS CRUD
════════════════════════════════════════════════════ */

/* GET /api/tickets */
app.get('/api/tickets', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM tickets ORDER BY created_at DESC'
    );
    return ok(res, result.rows);
  } catch (e) {
    console.error('get tickets error:', e.message);
    return err(res, 'Failed to fetch tickets.', 500);
  }
});

/* POST /api/tickets */
app.post('/api/tickets', async (req, res) => {
  try {
    const { client_name, issue_type, status, priority } = req.body;

    if (!client_name || !issue_type) {
      return err(res, 'client_name and issue_type are required');
    }

    const result = await pool.query(
      `INSERT INTO tickets (client_name, issue_type, status, priority)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [client_name, issue_type, status || 'open', priority || 'medium']
    );

    return ok(res, result.rows[0], 'Ticket created');
  } catch (e) {
    console.error('create ticket error:', e.message);
    return err(res, 'Failed to create ticket.', 500);
  }
});

/* PUT /api/tickets/:id */
app.put('/api/tickets/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { client_name, issue_type, status, priority } = req.body;

    const result = await pool.query(
      `UPDATE tickets
       SET client_name = COALESCE($1, client_name),
           issue_type  = COALESCE($2, issue_type),
           status      = COALESCE($3, status),
           priority    = COALESCE($4, priority),
           updated_at  = NOW()
       WHERE id = $5
       RETURNING *`,
      [client_name, issue_type, status, priority, id]
    );

    if (result.rows.length === 0) {
      return err(res, 'Ticket not found', 404);
    }

    return ok(res, result.rows[0], 'Ticket updated');
  } catch (e) {
    console.error('update ticket error:', e.message);
    return err(res, 'Failed to update ticket.', 500);
  }
});

/* DELETE /api/tickets/:id */
app.delete('/api/tickets/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM tickets WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return err(res, 'Ticket not found', 404);
    }

    return ok(res, { id: result.rows[0].id }, 'Ticket deleted');
  } catch (e) {
    console.error('delete ticket error:', e.message);
    return err(res, 'Failed to delete ticket.', 500);
  }
});

/* ── legacy stats endpoint ──────────────────────── */
app.get('/api/stats', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM stats ORDER BY date DESC LIMIT 1'
    );
    return ok(res, result.rows[0] || null);
  } catch (e) {
    console.error('stats error:', e.message);
    return err(res, 'Failed to fetch stats.', 500);
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
