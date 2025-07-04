import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import styles from "./Cadastro.module.css";

export default function Cadastro() {
  const [form, setForm] = useState({
    nome: "",
    sobrenome: "",
    email: "",
    senha: "",
    confirmSenha: "",
  });

  const [mensagem, setMensagem] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.senha !== form.confirmSenha) {
      setMensagem("As senhas não coincidem.");
      return;
    }

    try {
      await axios.post("http://localhost:3000/cadastrar", form);
      setMensagem("Cadastro realizado com sucesso!");
      navigate("/login");
    } catch (error) {
      console.error(error);
      setMensagem("Erro ao cadastrar. Tente novamente.");
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <p className={styles.title}>Cadastre-se</p>
      <p className={styles.message}>
        Cadastre-se agora e tenha acesso total ao nosso site.
      </p>

      <div className={styles.flex}>
        <label>
          <input
            className={styles.input}
            type="text"
            name="nome"
            value={form.nome}
            onChange={handleChange}
            required
            placeholder=" "
          />
          <span>Nome</span>
        </label>

        <label>
          <input
            className={styles.input}
            type="text"
            name="sobrenome"
            value={form.sobrenome}
            onChange={handleChange}
            required
            placeholder=" "
          />
          <span>Sobrenome</span>
        </label>
      </div>

      <label>
        <input
          className={styles.input}
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          placeholder=" "
        />
        <span>Email</span>
      </label>

      <label>
        <input
          className={styles.input}
          type="password"
          name="senha"
          value={form.senha}
          onChange={handleChange}
          required
          placeholder=" "
        />
        <span>Senha</span>
      </label>

      <label>
        <input
          className={styles.input}
          type="password"
          name="confirmSenha"
          value={form.confirmSenha}
          onChange={handleChange}
          required
          placeholder=" "
        />
        <span>Confirmar Senha</span>
      </label>

      <button className={styles.submit} type="submit">
        Cadastrar
      </button>
      {mensagem && <p className={styles.feedback}>{mensagem}</p>}
      <p className={styles.signin}>
        Já tem uma conta? <Link to="/login">Entrar</Link>
      </p>
    </form>
  );
}
