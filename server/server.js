const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Database } = require('@tursodatabase/database');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const db = new Database({
  url: process.env.TURSO_URL,
  authToken: process.env.TURSO_API_KEY,
});

app.get('/tasks', async (req, res) => {
  try {
    const result = await db.execute('SELECT id, texto, concluida FROM tarefas');
    const tasks = result.rows.map(row => ({
      id: row[0],
      texto: row[1],
      concluida: Boolean(row[2]),
    }));
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar tarefas' });
  }
});

app.post('/tasks', async (req, res) => {
  try {
    const { id, texto, concluida = false } = req.body;
    await db.execute(
      'INSERT INTO tarefas (id, texto, concluida) VALUES (?, ?, ?)',
      [String(id), texto, concluida ? 1 : 0]
    );
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
    await db.execute('UPDATE tarefas SET concluida = ? WHERE id = ?', [concluida ? 1 : 0, String(id)]);
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao atualizar tarefa' });
  }
});

app.delete('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.execute('DELETE FROM tarefas WHERE id = ?', [String(id)]);
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao remover tarefa' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
