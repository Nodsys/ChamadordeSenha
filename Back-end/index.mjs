// Importa os módulos necessários
import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

// Carrega variáveis de ambiente do arquivo .env
dotenv.config();

// Inicializa o app Express e middlewares
const app = express();
app.use(cors());
app.use(express.json());

// Define a porta a partir das variáveis de ambiente
const porta = process.env.DB_PORTA;

// Cria um pool de conexões com o banco de dados MySQL
const conexao = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// ================= ROTAS =================

// Rota para cadastro de usuário
app.post("/cadastrar", async (req, res) => {
  const { nome, sobrenome, email, senha } = req.body;
  if (!nome || !sobrenome || !email || !senha) {
    return res.status(400).json({ erro: "Preencha todos os campos." });
  }

  try {
    const [usuariosExistentes] = await conexao.execute(
      "SELECT id FROM usuarios WHERE email = ?",
      [email]
    );

    if (usuariosExistentes.length > 0) {
      return res.status(409).json({ erro: "Email já cadastrado." });
    }

    const hash = await bcrypt.hash(senha, 10);

    await conexao.execute(
      "INSERT INTO usuarios (nome, sobrenome, email, senha) VALUES (?, ?, ?, ?)",
      [nome, sobrenome, email, hash]
    );

    res.status(201).json({ msg: "Usuário cadastrado com sucesso!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao cadastrar usuário" });
  }
});

// Rota para login de usuário
app.post("/login", async (req, res) => {
  const { email, senha } = req.body;
  if (!email || !senha) {
    return res.status(400).json({ erro: "Informe o email e a senha." });
  }

  try {
    const [rows] = await conexao.execute(
      "SELECT * FROM usuarios WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ erro: "Usuário não encontrado." });
    }

    const usuario = rows[0];
    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      return res.status(401).json({ erro: "Senha inválida." });
    }

    res.json({
      msg: "Login bem-sucedido",
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        sobrenome: usuario.sobrenome,
        email: usuario.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao fazer login" });
  }
});

// Rota para gerar nova senha
app.post("/senha", async (req, res) => {
  try {
    const { tipo, nome, rg, cpf } = req.body;

    if (tipo !== "N" && tipo !== "P") {
      return res
        .status(400)
        .json({ erro: 'Tipo de senha inválido. Use "N" ou "P".' });
    }

    const [[ultima]] = await conexao.execute(
      "SELECT MAX(numero) AS numero FROM senhas WHERE tipo = ?",
      [tipo]
    );

    const numero = (ultima.numero || 0) + 1;

    await conexao.execute(
      "INSERT INTO senhas (tipo, numero, nome, rg, cpf) VALUES (?, ?, ?, ?, ?)",
      [tipo, numero, nome || null, rg || null, cpf || null]
    );

    res.json({ tipo, numero, nome, rg, cpf });
  } catch (error) {
    console.error(error);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ erro: "CPF ou RG já cadastrados." });
    }

    res.status(500).json({ erro: "Erro ao gerar senha" });
  }
});

// Rota para buscar senhas aguardando
app.get("/senha/fila", async (req, res) => {
  try {
    const [senhas] = await conexao.execute(
      `SELECT tipo, numero, nome, rg, cpf FROM senhas 
       WHERE status = 'aguardando' 
       ORDER BY tipo='P' DESC, id ASC`
    );
    res.json(senhas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao buscar senhas na fila" });
  }
});

// Rota para buscar histórico
app.get("/senha/historico", async (req, res) => {
  try {
    const [senhas] = await conexao.execute(
      `SELECT tipo, numero, nome, rg, cpf FROM senhas 
       WHERE status = 'chamada' 
       ORDER BY chamado_em DESC 
       LIMIT 20`
    );
    res.json(senhas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao buscar histórico de senhas" });
  }
});

// Rota para buscar a última senha chamada
app.get("/senha/ultima", async (req, res) => {
  try {
    const [[senha]] = await conexao.execute(
      `SELECT tipo, numero, nome, rg, cpf FROM senhas
       WHERE status = 'chamada'
       ORDER BY chamado_em DESC
       LIMIT 1`
    );

    res.json(senha || {});
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao buscar última senha chamada" });
  }
});

// Rota para chamar a próxima senha
app.post("/senha/chamar", async (req, res) => {
  try {
    const [[proxima]] = await conexao.execute(
      `SELECT * FROM senhas WHERE status = 'aguardando'
       ORDER BY tipo='P' DESC, id ASC
       LIMIT 1`
    );

    if (!proxima) {
      return res.status(404).json({ erro: "Nenhuma senha aguardando." });
    }

    await conexao.execute(
      `UPDATE senhas SET status = 'chamada', chamado_em = NOW() WHERE id = ?`,
      [proxima.id]
    );

    res.json(proxima);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao chamar senha" });
  }
});

app.listen(porta, () => {
  console.log(`Servidor rodando na porta ${porta}`);
});
