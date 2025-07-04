import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Login from "../pages/Login";
import Cadastro from "../pages/Cadastro";
import Hub from "../pages/Hub";
import Painel from "../pages/Painel";
import Historico from "../pages/Historico";

function LoadingScreen() {
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h2>Carregando...</h2>
    </div>
  );
}

// Wrapper para centralizar
function Centered({ children }) {
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {children}
    </div>
  );
}

export default function AppRoutes() {
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  const isAuth = localStorage.getItem("usuario");

  if (loading) return <LoadingScreen />;

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route
        path="/login"
        element={
          <Centered>
            <Login />
          </Centered>
        }
      />
      <Route
        path="/cadastro"
        element={
          <Centered>
            <Cadastro />
          </Centered>
        }
      />
      <Route
        path="/hub"
        element={isAuth ? <Hub /> : <Navigate to="/login" />}
      />
      <Route path="/painel" element={<Painel />} />
      <Route path="/historico" element={<Historico />} />
    </Routes>
  );
}
