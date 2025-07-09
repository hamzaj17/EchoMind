const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'echomind',
    password: 'comsatsapply2023',
    port: 5432,
});

async function addTask(description) {
    const res = await pool.query('INSERT INTO tasks (description) VALUES ($1) RETURNING *', [description]);
    return res.rows[0];
}

async function addNote(content) {
    const res = await pool.query('INSERT INTO notes (content) VALUES ($1) RETURNING *', [content]);
    return res.rows[0];
}

module.exports = { addTask, addNote };
