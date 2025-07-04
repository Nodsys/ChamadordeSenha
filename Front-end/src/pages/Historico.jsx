import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Historico() {
  const [historico, setHistorico] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    buscarHistorico();

    const intervalo = setInterval(() => {
      buscarHistorico();
    }, 5000); // atualiza a cada 5s

    return () => clearInterval(intervalo);
  }, []);

  const buscarHistorico = async () => {
    try {
      const res = await axios.get("http://localhost:3000/senha/historico");
      setHistorico(res.data);
    } catch (err) {
      console.error("Erro ao buscar histórico:", err);
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-end container mt-3">
        <button
          className="btn btn-outline-primary"
          onClick={() => navigate("/painel")}
        >
          <i className="bi bi-arrow-left-circle"></i> Voltar para o Painel
        </button>
      </div>
      <h2>Histórico de Senhas Chamadas</h2>
      {historico.length > 0 ? (
        <ul className="list-group">
          {historico.map((senha, idx) => (
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
        <p className="text-muted mt-3">Nenhuma senha foi chamada ainda.</p>
      )}
    </div>
  );
}
