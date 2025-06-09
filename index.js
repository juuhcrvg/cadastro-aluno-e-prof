// Importação dos módulos necessários
const express = require('express'); // Framework para criar o servidor HTTP
const cors = require('cors'); // Middleware para habilitar requisições de diferentes origens (CORS)
const sqlite3 = require('sqlite3').verbose(); // Driver para interagir com o banco de dados SQLite

// Inicializa a aplicação Express
const app = express();
// Define a porta do servidor. Usa a variável de ambiente PORT ou 3000 como padrão.
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors()); // Habilita o CORS para todas as rotas
app.use(express.json()); // Permite que o servidor entenda requisições com corpo no formato JSON

// Conecta ou cria o arquivo do banco de dados SQLite
const db = new sqlite3.Database('./bancodedados.db', (err) => {
  if (err) {
    console.error("Erro ao conectar ao banco de dados:", err.message);
  } else {
    console.log("Conectado ao banco de dados SQLite.");

    // Criação das tabelas (Alunos, Professores)
    criarTabelaAlunos();
    criarTabelaProfessores();
  }
});

// Função para criar a tabela de Alunos
function criarTabelaAlunos() {
  db.run(`CREATE TABLE IF NOT EXISTS Alunos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    curso TEXT
  )`, (err) => {
    if (err) {
      console.error("Erro ao criar tabela 'Alunos':", err.message);
    } else {
      console.log("Tabela 'Alunos' verificada/criada com sucesso.");
    }
  });
}

// Função para criar a tabela de Professores
function criarTabelaProfessores() {
  db.run(`CREATE TABLE IF NOT EXISTS Professores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    disciplina TEXT
  )`, (err) => {
    if (err) {
      console.error("Erro ao criar tabela 'Professores':", err.message);
    } else {
      console.log("Tabela 'Professores' verificada/criada com sucesso.");
    }
  });
}

// --- ROTAS DA API ---
// Rota para LISTAR todos os alunos (Método GET)
app.get('/alunos', (req, res) => {
  db.all('SELECT * FROM Alunos ORDER BY nome', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: "Erro ao buscar alunos: " + err.message });
      return;
    }
    res.json(rows);
  });
});

// Rota para LISTAR todos os professores (Método GET)
app.get('/professores', (req, res) => {
  db.all('SELECT * FROM Professores ORDER BY nome', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: "Erro ao buscar professores: " + err.message });
      return;
    }
    res.json(rows);
  });
});

// Rota para CADASTRAR um novo aluno (Método POST)
app.post('/alunos', (req, res) => {
  const { nome, email, curso } = req.body;
  if (!nome) return res.status(400).json({ error: 'O campo "nome" é obrigatório.' });
  if (!email) return res.status(400).json({ error: 'O campo "email" é obrigatório.' });

  const sql = 'INSERT INTO Alunos (nome, email, curso) VALUES (?, ?, ?)';
  db.run(sql, [nome, email, curso], function (err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(400).json({ error: 'Este email já está cadastrado.' });
      }
      return res.status(500).json({ error: "Erro ao cadastrar aluno: " + err.message });
    }
    res.status(201).json({ id: this.lastID, nome, email, curso });
  });
});

// Rota para CADASTRAR um novo professor (Método POST)
app.post('/professores', (req, res) => {
  const { nome, email, disciplina } = req.body;
  if (!nome) return res.status(400).json({ error: 'O campo "nome" é obrigatório.' });
  if (!email) return res.status(400).json({ error: 'O campo "email" é obrigatório.' });

  const sql = 'INSERT INTO Professores (nome, email, disciplina) VALUES (?, ?, ?)';
  db.run(sql, [nome, email, disciplina], function (err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(400).json({ error: 'Este email já está cadastrado.' });
      }
      return res.status(500).json({ error: "Erro ao cadastrar professor: " + err.message });
    }
    res.status(201).json({ id: this.lastID, nome, email, disciplina });
  });
});

// Rota para DELETAR um aluno pelo ID (Método DELETE)
app.delete('/alunos/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM Alunos WHERE id = ?';
  db.run(sql, [id], function (err) {
    if (err) {
      return res.status(500).json({ error: "Erro ao deletar aluno: " + err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Aluno não encontrado.' });
    }
    res.json({ message: 'Aluno removido com sucesso!' });
  });
});

// Rota para DELETAR um professor pelo ID (Método DELETE)
app.delete('/professores/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM Professores WHERE id = ?';
  db.run(sql, [id], function (err) {
    if (err) {
      return res.status(500).json({ error: "Erro ao deletar professor: " + err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Professor não encontrado.' });
    }
    res.json({ message: 'Professor removido com sucesso!' });
  });
});

// Rota para ATUALIZAR um aluno pelo ID (Método PUT)
app.put('/alunos/:id', (req, res) => {
  const { id } = req.params;
  const { nome, email, curso } = req.body;
  if (!nome && !email && !curso) {
    return res.status(400).json({ error: 'Forneça ao menos um campo para atualizar (nome,email, curso).' });
  }

  let fieldsToUpdate = [];
  let values = [];
  if (nome) { fieldsToUpdate.push("nome = ?"); values.push(nome); }
  if (email) { fieldsToUpdate.push("email = ?"); values.push(email); }
  if (curso) { fieldsToUpdate.push("curso = ?"); values.push(curso); }
  values.push(id);

  const sql = `UPDATE Alunos SET ${fieldsToUpdate.join(', ')} WHERE id = ?`;
  db.run(sql, values, function (err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(400).json({ error: 'Este email já está cadastrado para outro aluno.' });
      }
      return res.status(500).json({ error: "Erro ao atualizar aluno: " + err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Aluno não encontrado para atualização.' });
    }
    res.json({ message: 'Aluno atualizado com sucesso!', changes: this.changes });
  });
});

// Rota para ATUALIZAR um professor pelo ID (Método PUT)
app.put('/professores/:id', (req, res) => {
  const { id } = req.params;
  const { nome, email, disciplina } = req.body;

  if (!nome && !email && !disciplina) {
    return res.status(400).json({ error: 'Forneça ao menos um campo para atualizar (nome, email, disciplina).' });
  }

  let fieldsToUpdate = [];
  let values = [];
  if (nome) { fieldsToUpdate.push("nome = ?"); values.push(nome); }
  if (email) { fieldsToUpdate.push("email = ?"); values.push(email); }
  if (disciplina) { fieldsToUpdate.push("disciplina = ?"); values.push(disciplina); }
  values.push(id);

  const sql = `UPDATE Professores SET ${fieldsToUpdate.join(', ')} WHERE id = ?`;
  db.run(sql, values, function (err) {
    if (err) {
      return res.status(500).json({ error: "Erro ao atualizar professor: " + err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Professor não encontrado para atualização.' });
    }
    res.json({ message: 'Professor atualizado com sucesso!', changes: this.changes });
  });
});

// Inicia o servidor na porta definida
app.listen(port, () => {
  console.log(`Servidor backend rodando em http://localhost:${port}`);
});