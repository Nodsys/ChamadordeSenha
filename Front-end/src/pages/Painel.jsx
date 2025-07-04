import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Painel() {
  const [senhaAtual, setSenhaAtual] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const intervalo = setInterval(buscarUltimaSenha, 3000);
    buscarUltimaSenha();
    return () => clearInterval(intervalo);
  }, []);

  const buscarUltimaSenha = async () => {
    try {
      const res = await axios.get("http://localhost:3000/senha/ultima");
      setSenhaAtual(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        minWidth: "100vw",
        background: "#f8f9fa",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "flex-end",
          padding: "2rem 3rem 0 0",
        }}
      >
        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate("/historico")}
        >
          <i className="bi bi-clock-history"></i> Ver Histórico
        </button>
      </div>
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h1 style={{ fontSize: "3rem", marginBottom: "2rem" }}>
          Painel de Senhas
        </h1>
        {senhaAtual && senhaAtual.numero ? (
          <div style={{ fontSize: "6rem", fontWeight: "bold" }}>
            {senhaAtual.tipo} - {senhaAtual.numero}
          </div>
        ) : (
          <div style={{ fontSize: "2rem", color: "gray" }}>
            Nenhuma senha chamada ainda.
          </div>
        )}
      </div>
    </div>
  );
}
