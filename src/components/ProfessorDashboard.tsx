// src/components/ProfessorDashboard.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TaskForm from './TaskForm';
import { fetchTasks } from '../services/taskService'; // Função correta para buscar tarefas do Firebase

const ProfessorDashboard: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [tasks, setTasks] = useState<any[]>([]);

  // Função para carregar as tarefas quando o componente é montado
  useEffect(() => {
    const loadTasks = async () => {
      const fetchedTasks = await fetchTasks();
      setTasks(fetchedTasks);
    };
    loadTasks();
  }, []);

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-3xl font-bold text-center text-[#2E7D32] mb-4">Painel do Professor</h2>

      {/* Botão para Mostrar o Formulário de Criação de Tarefas */}
      <div className="text-center mb-6">
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#81C784] text-white py-2 px-6 rounded-full shadow-md hover:bg-[#66BB6A] transition-transform transform hover:scale-105"
        >
          + Criar Nova Tarefa
        </button>
      </div>

      {/* Exibe o TaskForm ao clicar no botão */}
      {showForm && <TaskForm onCreate={() => setShowForm(false)} />}

      {/* Lista de Tarefas Criadas */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-2xl font-semibold text-[#2E7D32] mb-4">Tarefas Criadas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <Link
              to={`/task/${task.id}`}
              key={task.id}
              className="bg-[#E8F5E9] p-4 rounded-lg shadow hover:shadow-xl transition-shadow duration-300 hover:bg-[#F8F9FA]"
            >
              <h4 className="text-lg font-semibold text-[#2E7D32]">{task.title}</h4>
              <p className="text-sm text-gray-600 mb-2">{task.description}</p>
              <p className="text-sm text-[#2E7D32]">Data de Entrega: {task.dueDate}</p>
              <p className="text-blue-500 hover:text-blue-600 mt-2">Ver Detalhes</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfessorDashboard;
