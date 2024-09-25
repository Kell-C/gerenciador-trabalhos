// src/components/Login.tsx
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { loginUser } from '../services/authService.ts';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const { userType } = await loginUser(email, password); // Obtemos o tipo de usuário

      // Redireciona com base no tipo de usuário
      if (userType === 'professor') {
        navigate('/professor');
      } else if (userType === 'estudante') {
        navigate('/estudante');
      } else {
        setError('Tipo de usuário desconhecido.');
      }
    } catch (error: any) {
      setError('Falha no login. Verifique suas credenciais e tente novamente.');
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2 font-semibold">Email</label>
        <input
          type="email"
          value={email}
          onChange={handleEmailChange}
          placeholder="Email"
          className="w-full p-2 border rounded"
          required
        />

        <label className="block mt-4 mb-2 font-semibold">Senha</label>
        <input
          type="password"
          value={password}
          onChange={handlePasswordChange}
          placeholder="Senha"
          className="w-full p-2 border rounded"
          required
        />

        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
        <button
          type="submit"
          className="w-full mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
