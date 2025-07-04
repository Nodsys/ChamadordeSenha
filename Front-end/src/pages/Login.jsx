import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";

export default function Login() {
    const [form, setForm] = useState({ email: "", senha: "" });
    const [mensagem, setMensagem] = useState("");
    const [lembrar, setLembrar] = useState(
        localStorage.getItem("lembrarEmail") ? true : false
    );
    const navigate = useNavigate();

    React.useEffect(() => {
        // Se lembrar de mim estiver ativo, preenche o email salvo
        const emailSalvo = localStorage.getItem("lembrarEmail");
        if (emailSalvo) {
            setForm((prev) => ({ ...prev, email: emailSalvo }));
        }
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleLembrarChange = (e) => {
        setLembrar(e.target.checked);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const resposta = await axios.post("http://localhost:3000/login", form);
            setMensagem(`Bem-vindo, ${resposta.data.usuario.nome}`);
            localStorage.setItem("usuario", JSON.stringify(resposta.data.usuario));
            if (lembrar) {
                localStorage.setItem("lembrarEmail", form.email);
            } else {
                localStorage.removeItem("lembrarEmail");
            }
            navigate("/hub");
        } catch (error) {
            setMensagem("Email ou senha incorretos.");
        }
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles["flex-column"]}>
                <label>Email</label>
            </div>
            <div className={styles.inputForm}>
                <svg height="20" viewBox="0 0 32 32" width="20">
                    <path d="M30.853 13.87a15 15 0 0 0 -29.729 4.082 15.1 15.1 0 0 0 12.876 12.918 15.6 15.6 0 0 0 2.016.13 14.85 14.85 0 0 0 7.715-2.145 1 1 0 1 0 -1.031-1.711 13.007 13.007 0 1 1 5.458-6.529 2.149 2.149 0 0 1 -4.158-.759v-10.856a1 1 0 0 0 -2 0v1.726a8 8 0 1 0 .2 10.325 4.135 4.135 0 0 0 7.83.274 15.2 15.2 0 0 0 .823-7.455zm-14.853 8.13a6 6 0 1 1 6-6 6.006 6.006 0 0 1 -6 6z" />
                </svg>
                <input
                    type="email"
                    className={styles.input}
                    name="email"
                    placeholder="Digite seu e-mail"
                    value={form.email}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className={styles["flex-column"]}>
                <label>Senha</label>
            </div>
            <div className={styles.inputForm}>
                <svg height="20" viewBox="-64 0 512 512" width="20">
                    <path d="m336 512h-288c-26.453125 0-48-21.523438-48-48v-224c0-26.476562 21.546875-48 48-48h288c26.453125 0 48 21.523438 48 48v224c0 26.476562-21.546875 48-48 48zm-288-288c-8.8125 0-16 7.167969-16 16v224c0 8.832031 7.1875 16 16 16h288c8.8125 0 16-7.167969 16-16v-224c0-8.832031-7.1875-16-16-16zm0 0" />
                    <path d="m304 224c-8.832031 0-16-7.167969-16-16v-80c0-52.929688-43.070312-96-96-96s-96 43.070312-96 96v80c0 8.832031-7.167969 16-16 16s-16-7.167969-16-16v-80c0-70.59375 57.40625-128 128-128s128 57.40625 128 128v80c0 8.832031-7.167969 16-16 16zm0 0" />
                </svg>
                <input
                    type="password"
                    className={styles.input}
                    name="senha"
                    placeholder="Digite sua senha"
                    value={form.senha}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className={styles["flex-row"]}>
                <div>
                    <input
                        type="checkbox"
                        id="remember"
                        checked={lembrar}
                        onChange={handleLembrarChange}
                    />
                    <label htmlFor="remember">Lembre de mim</label>
                </div>
                <span className={styles.span}>Esqueceu sua senha?</span>
            </div>

            <button type="submit" className={styles["button-submit"]}>
                Entrar
            </button>

            <p className={styles.p}>
                Não tem uma conta?{" "}
                <span className={styles.span} onClick={() => navigate("/cadastro")}>
                    Cadastrar
                </span>
            </p>
            {mensagem && <div className="alert alert-danger mt-2">{mensagem}</div>}
        </form>
    );
}
