import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./Header";
import { useNavigate } from "react-router-dom";

export default function Hub() {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const [senhaAtual, setSenhaAtual] = useState(null);
  const [senhasFila, setSenhasFila] = useState([]);
  const [historicoSenhas, setHistoricoSenhas] = useState([]);
  const [aviso, setAviso] = useState("");

  const [nome, setNome] = useState("");
  const [rg, setRg] = useState("");
  const [cpf, setCpf] = useState("");

  useEffect(() => {
    if (!usuario) navigate("/login");
    buscarUltimaSenha();
    buscarSenhasFila();
    buscarHistoricoSenhas();
  }, []);

  const gerarSenha = async (tipo) => {
    try {
      if (!nome || !rg || !cpf) {
        setAviso("Preencha nome, RG e CPF para gerar uma senha.");
        return;
      }

      await axios.post("http://localhost:3000/senha", {
        tipo,
        nome,
        rg,
        cpf,
      });

      buscarUltimaSenha();
      buscarSenhasFila();
      setAviso("Senha gerada com sucesso.");
      setNome("");
      setRg("");
      setCpf("");
    } catch (err) {
      if (err.response?.status === 409) {
        setAviso("CPF ou RG já cadastrados. Aguarde ser chamado.");
      } else {
        console.error(err);
        setAviso("Erro ao gerar senha. Tente novamente.");
      }
    }
  };

  const chamarSenha = async () => {
    try {
      const res = await axios.post("http://localhost:3000/senha/chamar");
      setSenhaAtual(res.data);
      buscarSenhasFila();
      buscarHistoricoSenhas();
      setAviso("");
    } catch (err) {
      setAviso("Nenhuma senha aguardando para ser chamada.");
    }
  };

  const buscarUltimaSenha = async () => {
    try {
      const res = await axios.get("http://localhost:3000/senha/ultima");
      setSenhaAtual(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const buscarSenhasFila = async () => {
    try {
      const res = await axios.get("http://localhost:3000/senha/fila");
      setSenhasFila(res.data);
    } catch (err) {
      setSenhasFila([]);
    }
  };

  const buscarHistoricoSenhas = async () => {
    try {
      const res = await axios.get("http://localhost:3000/senha/historico");
      setHistoricoSenhas(res.data);
    } catch (err) {
      setHistoricoSenhas([]);
    }
  };

  return (
    <>
      <Header email={usuario?.email} />
      <div className="container mt-4">
        <h3>Chamador de Senhas</h3>

        <div className="row mb-3">
          <div className="col-md-4">
            <input
              type="text"
              placeholder="Nome"
              className="form-control"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>
          <div className="col-md-4">
            <input
              type="text"
              placeholder="RG"
              className="form-control"
              value={rg}
              onChange={(e) => setRg(e.target.value)}
            />
          </div>
          <div className="col-md-4">
            <input
              type="text"
              placeholder="CPF"
              className="form-control"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
            />
          </div>
        </div>

        <div className="d-flex gap-3 my-3">
          <button className="btn btn-primary" onClick={() => gerarSenha("N")}>
            Gerar Senha Normal
          </button>
          <button className="btn btn-warning" onClick={() => gerarSenha("P")}>
            Gerar Senha Prioritária
          </button>
          <button className="btn btn-success" onClick={chamarSenha}>
            Chamar Próxima
          </button>
        </div>

        {aviso && <div className="alert alert-warning">{aviso}</div>}

        <div className="row mt-4">
          <div className="col-md-4">
            <h5>Senhas na Fila</h5>
            {senhasFila.length > 0 ? (
              <ul className="list-group">
                {senhasFila.map((senha, idx) => (
                  <li key={idx} className="list-group-item">
                    <strong>{senha.tipo}</strong> Nº {senha.numero}
                    <br />
                    {senha.nome && <small>Nome: {senha.nome}</small>}
                    <br />
                    {senha.rg && <small>RG: {senha.rg}</small>}
                    <br />
                    {senha.cpf && <small>CPF: {senha.cpf}</small>}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-muted">Nenhuma senha na fila.</div>
            )}
          </div>
          <div className="col-md-4">
            <h5>Última senha chamada:</h5>
            {senhaAtual?.numero ? (
              <div className="alert alert-secondary">
                Tipo: <strong>{senhaAtual.tipo}</strong> | Nº:{" "}
                <strong>{senhaAtual.numero}</strong>
                <br />
                {senhaAtual.nome && <small>Nome: {senhaAtual.nome}</small>}
                <br />
                {senhaAtual.rg && <small>RG: {senhaAtual.rg}</small>}
                <br />
                {senhaAtual.cpf && <small>CPF: {senhaAtual.cpf}</small>}
              </div>
            ) : (
              <div className="text-muted">Nenhuma senha chamada ainda.</div>
            )}
          </div>
          <div className="col-md-4">
            <h5>Histórico de Senhas</h5>
            {historicoSenhas.length > 0 ? (
              <ul className="list-group">
                {historicoSenhas.map((senha, idx) => (
                  <li key={idx} className="list-group-item">
                    <strong>{senha.tipo}</strong> Nº {senha.numero}
                    <br />
                    {senha.nome && <small>Nome: {senha.nome}</small>}
                    <br />
                    {senha.rg && <small>RG: {senha.rg}</small>}
                    <br />
                    {senha.cpf && <small>CPF: {senha.cpf}</small>}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-muted">Nenhuma senha chamada ainda.</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
