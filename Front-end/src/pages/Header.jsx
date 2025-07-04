import React from 'react'
import { useNavigate } from 'react-router-dom'
import farm from '../assets/logoFarm.avif'

export default function Header({ email }) {
    const navigate = useNavigate()

    const handleLogout = () => {
        localStorage.removeItem('usuario')
        navigate('/login')
    }

    return (
        <header className="d-flex justify-content-between align-items-center p-3 bg-light border-bottom">
            <img src={farm} alt="Logo da empresa" height={40} />
            <div className="d-flex align-items-center gap-3">
                <span className="fw-bold">{email}</span>
                <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
                    Sair
                </button>
            </div>
        </header>
    )
}
