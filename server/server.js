const express = require('express');
const cors = require('cors');
const { getDb } = require('./db-client');

const app = express();
app.use(cors());
app.use(express.json());

let db;

async function start() {
  try {
    db = await getDb();

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Falha ao conectar ao banco:', err);
    process.exit(1);
  }
}

async function queryAll(sql) {
  // Try prepare()/all/get
  if (typeof db.prepare === 'function') {
    const stmt = db.prepare(sql);
    if (stmt && typeof stmt.all === 'function') {
      return await stmt.all();
    }
    if (stmt && typeof stmt.get === 'function') {
      const row = await stmt.get();
      return row ? [row] : [];
    }
  }

  // libsql compat: client.query(sql) -> may return rows or array
  if (typeof db.query === 'function') {
    const res = await db.query(sql);
    if (Array.isArray(res)) return res;
    if (res && Array.isArray(res.rows)) return res.rows;
    return [];
  }

  // serverless compat: client.execute(sql, params?) -> { rows }
  if (typeof db.execute === 'function') {
    const res = await db.execute(sql);
    return res && Array.isArray(res.rows) ? res.rows : [];
  }

  // fallback: no supported API found
  throw new Error('DB client does not support queries');
}

async function runStmt(statement, ...params) {
  if (typeof db.prepare === 'function') {
    const stmt = db.prepare(statement);
    if (stmt && typeof stmt.run === 'function') return await stmt.run(...params);
    if (stmt && typeof stmt.all === 'function') return await stmt.all(params);
  }

  if (typeof db.execute === 'function') {
    // serverless compat: execute(sql, args?)
    return await db.execute(statement, params.length ? params : undefined);
  }

  if (typeof db.batch === 'function') {
    // try batch for multiple statements
    return await db.batch([statement]);
  }

  throw new Error('DB client does not support statements');
}

app.get('/tasks', async (req, res) => {
  try {
    const rows = await queryAll('SELECT id, texto, concluida FROM tarefas');
    const tasks = rows.map(r => ({ id: r.id ?? r[0], texto: r.texto ?? r[1], concluida: Boolean(r.concluida ?? r[2]) }));
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar tarefas' });
  }
});

app.post('/tasks', async (req, res) => {
  try {
    const { id, texto, concluida = false } = req.body;
    await runStmt('INSERT INTO tarefas (id, texto, concluida) VALUES (?, ?, ?)', String(id), texto, concluida ? 1 : 0);
    res.status(201).json({ id, texto, concluida });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar tarefa' });
  }
});

app.put('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { concluida } = req.body;
    await runStmt('UPDATE tarefas SET concluida = ? WHERE id = ?', concluida ? 1 : 0, String(id));
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao atualizar tarefa' });
  }
});

app.delete('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await runStmt('DELETE FROM tarefas WHERE id = ?', String(id));
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao remover tarefa' });
  }
});

start();
