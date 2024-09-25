// src/components/StudentDashboard.tsx
import React, { useState, useEffect } from 'react';
import { fetchTasks } from '../services/taskService'; // Certifique-se de importar corretamente o fetchTasks

const StudentDashboard: React.FC = () => {
  const [tasks, setTasks] = useState<any[]>([]); // Define o estado para armazenar as tarefas

  // Função para buscar as tarefas quando o componente é montado
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const fetchedTasks = await fetchTasks(); // Busca as tarefas do serviço
        setTasks(fetchedTasks); // Armazena as tarefas no estado
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
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <div key={task.id} className="bg-[#E8F5E9] p-4 rounded-lg shadow hover:shadow-xl transition-shadow duration-300 hover:bg-[#F8F9FA]">
              <h4 className="text-lg font-semibold text-[#2E7D32]">{task.title}</h4>
              <p className="text-sm text-gray-600 mb-2">{task.description}</p>
              <p className="text-sm text-[#2E7D32]">Data de Entrega: {task.dueDate}</p>
              <button className="text-blue-500 hover:text-blue-600 mt-2">Acessar Tarefa</button>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600">Nenhuma tarefa disponível.</p>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
