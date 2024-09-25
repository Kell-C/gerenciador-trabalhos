// src/components/Navbar.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes, FaUser, FaSignInAlt, FaTasks } from 'react-icons/fa';
import logo from '../assets/logo.png'

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-[#A8D5BA] shadow-md"> {/* Cor suave para o Navbar */}
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center text-[#2E7D32] text-2xl font-bold">
          <img src={logo} alt="Logo" className="h-12 w-12 mr-3" /> {/* Ajuste o caminho da logo conforme necessário */}
          Gerenciador de Trabalhos
        </Link>

        {/* Botão de Menu para Mobile */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-[#2E7D32] text-2xl md:hidden focus:outline-none"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Links de Navegação */}
        <ul
          className={`md:flex md:items-center absolute md:static bg-[#A8D5BA] md:bg-transparent w-full md:w-auto left-0 md:left-auto transition-transform duration-300 ease-in ${
            menuOpen ? 'top-16' : 'top-[-400px]'
          }`}
        >
          <li className="md:ml-6 my-2 md:my-0">
            <Link
              to="/register"
              className="text-[#2E7D32] flex items-center hover:text-[#66BB6A] transition-colors duration-200"
            >
              <FaUser className="mr-2" /> Registrar
            </Link>
          </li>
          <li className="md:ml-6 my-2 md:my-0">
            <Link
              to="/login"
              className="text-[#2E7D32] flex items-center hover:text-[#66BB6A] transition-colors duration-200"
            >
              <FaSignInAlt className="mr-2" /> Login
            </Link>
          </li>
          <li className="md:ml-6 my-2 md:my-0">
            <Link
              to="/tasks"
              className="text-[#2E7D32] flex items-center hover:text-[#66BB6A] transition-colors duration-200"
            >
              <FaTasks className="mr-2" /> Lista de Usuários
            </Link>
          </li>
          <li className="md:ml-6 my-2 md:my-0">
            <Link
              to="/logout"
              className="text-[#2E7D32] flex items-center hover:text-red-400 transition-colors duration-200"
            >
              Sair
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
