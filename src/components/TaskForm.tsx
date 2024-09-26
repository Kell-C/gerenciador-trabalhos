// src/components/TaskForm.tsx
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { createTask, updateTask } from '../services/taskService'; // Ajuste para chamar as funções de criar ou editar

interface TaskFormProps {
  onCreate: () => void;
  taskData?: {
    id?: string;
    title: string;
    description: string;
    dueDate: string;
    instructions: string;
    criteria: string;
    materials: [],
    todolist: [],
    themes: [],
    groups: [],

  };
}

const TaskForm: React.FC<TaskFormProps> = ({ onCreate, taskData }) => {
  const [task, setTask] = useState(taskData || {
    title: '',
    description: '',
    dueDate: '',
    instructions: '',
    criteria: '',
    materials: [],
    todolist: [],
    themes: [],
    groups: [],
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (taskData?.id) {
      await updateTask(taskData.id, task); // Editar tarefa existente
    } else {
      await createTask(task); // Criar nova tarefa
    }
    onCreate(); // Fecha o formulário
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-6 mb-6 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Título</label>
        <input
          type="text"
          name="title"
          value={task.title}
          onChange={handleChange}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Descrição</label>
        <textarea
          name="description"
          value={task.description}
          onChange={handleChange}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Data de Entrega</label>
        <input
          type="date"
          name="dueDate"
          value={task.dueDate}
          onChange={handleChange}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Instruções</label>
        <textarea
          name="instructions"
          value={task.instructions}
          onChange={handleChange}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors duration-300"
      >
        {taskData ? 'Salvar Alterações' : 'Criar Tarefa'}
      </button>
    </form>
  );
};

export default TaskForm;
