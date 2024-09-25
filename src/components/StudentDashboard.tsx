// src/components/StudentDashboard.tsx
import React, { useState, useEffect } from 'react';
import { fetchTasks } from '../services/taskService';
import { Link } from 'react-router-dom';

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
}

const StudentDashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const fetchedTasks = await fetchTasks();
        setTasks(fetchedTasks);
      } catch (error) {
        console.error('Erro ao carregar as tarefas:', error);
      }
    };

    loadTasks();
  }, []);

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-3xl font-bold text-center text-[#2E7D32] mb-4">Painel do Estudante</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task) => (
          <Link
            to={`/student/task/${task.id}`} // Redireciona para a página de detalhes da tarefa do estudante
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
  );
};

export default StudentDashboard;
