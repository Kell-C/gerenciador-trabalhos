// src/components/Register.tsx
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { registerUser } from '../services/authService'; // Função para registrar o usuário
import { useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState('estudante'); // Adiciona o tipo de usuário
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  const handleUserTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setUserType(e.target.value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // Verifica se as senhas coincidem
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    try {
      await registerUser(email, password, userType); // Inclui o tipo de usuário na função de registro
      navigate('/login'); // Redireciona para o login após registro bem-sucedido
    } catch (error: any) {
      setError('Erro no registro. Tente novamente.');
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-4 text-center">Registrar</h2>
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

        <label className="block mt-4 mb-2 font-semibold">Confirmar Senha</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          placeholder="Confirmar Senha"
          className="w-full p-2 border rounded"
          required
        />

        <label className="block mt-4 mb-2 font-semibold">Tipo de Usuário</label>
        <select
          value={userType}
          onChange={handleUserTypeChange}
          className="w-full p-2 border rounded"
        >
          <option value="professor">Professor</option>
          <option value="estudante">Estudante</option>
        </select>

        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
        <button
          type="submit"
          className="w-full mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Registrar
        </button>
      </form>
    </div>
  );
};

export default Register;
