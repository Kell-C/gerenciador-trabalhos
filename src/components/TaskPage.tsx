// src/components/TaskPage.tsx
import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase';
import { updateTask, deleteTask } from '../services/taskService';
import { getGroupsFromTask } from '../services/groupService';
import ThemesSection from './ThemesSection';

interface Theme {
  title: string;
  description: string;
}

interface Group {
  name: string;
  members: string[];
}

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  instructions: string;
  criteria: string;
  materials: File[];
  todolist: string[];
  themes: Theme[];
  groups: Group[];
}

const TaskPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);
  const [editing, setEditing] = useState(false);
  const [newMaterials, setNewMaterials] = useState<File[]>([]);
  const [newTodoItem, setNewTodoItem] = useState('');
  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    if (id) {
      const taskRef = ref(db, `tasks/${id}`);
      onValue(taskRef, (snapshot) => {
        const taskData = snapshot.val();
        if (taskData) {
          setTask({
            id,
            title: taskData.title || '',
            description: taskData.description || '',
            dueDate: taskData.dueDate || '',
            instructions: taskData.instructions || '',
            criteria: taskData.criteria || '',
            materials: taskData.materials || [],
            todolist: taskData.todolist || [],
            themes: taskData.themes || [],
            groups: taskData.groups || [],
          });
        }
      });

      // Carrega os grupos da tarefa
      loadGroups();
    }
  }, [id]);

  // Carrega grupos da tarefa
  const loadGroups = async () => {
    if (id) {
      const loadedGroups = await getGroupsFromTask(id);
      setGroups(loadedGroups ? Object.values(loadedGroups) : []);
    }
  };

  const handleMaterialChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewMaterials(Array.from(e.target.files));
    }
  };

  const handleEdit = () => setEditing(true);

  const handleCancelEdit = () => setEditing(false);

  const handleDelete = async () => {
    if (task && window.confirm('Tem certeza que deseja excluir esta tarefa?')) {
      await deleteTask(task.id);
      alert('Tarefa excluída com sucesso!');
      navigate('/professor');
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (task) {
      const updatedMaterials = [...task.materials, ...newMaterials];
      await updateTask(task.id, {
        ...task,
        materials: updatedMaterials,
        todolist: task.todolist || [],
        themes: task.themes || [],
        groups: groups || [],
      });
      alert('Tarefa atualizada com sucesso!');
      setEditing(false);
    }
  };

  const handleAddTodoItem = () => {
    if (newTodoItem.trim()) {
      setTask((prev) => prev && { ...prev, todolist: [...prev.todolist, newTodoItem] });
      setNewTodoItem('');
    }
  };

  const handleRemoveTodoItem = (index: number) => {
    setTask((prev) => prev && { ...prev, todolist: prev.todolist.filter((_, i) => i !== index) });
  };

  const handleTodoItemChange = (index: number, value: string) => {
    setTask((prev) =>
      prev && {
        ...prev,
        todolist: prev.todolist.map((item, i) => (i === index ? value : item)),
      }
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-full">
      <h2 className="text-4xl font-bold text-center text-[#2E7D32] mb-6">Detalhes da Tarefa</h2>
      {task ? (
        <div className="bg-white shadow-lg rounded-lg p-8 space-y-6">
          <div className="border-b pb-4 mb-4">
            <h3 className="text-3xl font-semibold text-[#2E7D32]">{task.title}</h3>
            <p className="text-gray-700 mt-2"><strong>Descrição:</strong> {task.description}</p>
            <p className="text-gray-700 mt-2"><strong>Data de Entrega:</strong> {task.dueDate}</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="bg-gray-50 p-6 rounded-md shadow-sm">
              <h4 className="text-xl font-semibold text-[#2E7D32]">Instruções</h4>
              <p className="text-gray-700 mt-2">{task.instructions}</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-md shadow-sm">
              <h4 className="text-xl font-semibold text-[#2E7D32]">Critérios</h4>
              <p className="text-gray-700 mt-2">{task.criteria}</p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="bg-gray-50 p-6 rounded-md shadow-sm">
              <h4 className="text-xl font-semibold text-[#2E7D32]">Materiais</h4>
              {task.materials?.length > 0 ? (
                <ul className="list-disc ml-5 text-gray-700 mt-2">
                  {task.materials.map((material, index) => (
                    <li key={index}>{material.name || `Material ${index + 1}`}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600">Nenhum material anexado.</p>
              )}
            </div>

            <div className="bg-gray-50 p-6 rounded-md shadow-sm">
              <h4 className="text-xl font-semibold text-[#2E7D32]">To-Do List</h4>
              {task.todolist?.length > 0 ? (
                <ul className="list-disc ml-5 text-gray-700 mt-2">
                  {task.todolist.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600">Nenhum item na lista.</p>
              )}
            </div>
          </div>

          <ThemesSection themes={task.themes} taskId={task.id} />

                    {/* Seção de Grupos */}
          <div className="bg-gray-50 p-6 rounded-md shadow-sm">
            <h4 className="text-xl font-semibold text-[#2E7D32] mb-4">Grupos Cadastrados</h4>
            {groups.length > 0 ? (
              <div className="grid gap-4 lg:grid-cols-2">
                {groups.map((group, index) => (
                  <div
                    key={index}
                    className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
                  >
                    <h5 className="text-lg font-semibold text-[#2E7D32] mb-2">
                      {group.name || `Grupo ${index + 1}`}
                    </h5>
                    <p className="text-gray-700">
                      <strong>Integrantes:</strong> {group.members.join(', ')}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">Nenhum grupo cadastrado.</p>
            )}
          </div>

          <div className="mt-4 flex space-x-2">
            <button
              onClick={handleEdit}
              className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors duration-300"
            >
              Editar
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors duration-300"
            >
              Excluir
            </button>
          </div>

          {editing && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Campos de edição */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Título</label>
                <input
                  type="text"
                  name="title"
                  value={task.title}
                  onChange={(e) => setTask({ ...task, title: e.target.value })}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Descrição</label>
                <textarea
                  name="description"
                  value={task.description}
                  onChange={(e) => setTask({ ...task, description: e.target.value })}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Data de Entrega</label>
                <input
                  type="date"
                  name="dueDate"
                  value={task.dueDate}
                  onChange={(e) => setTask({ ...task, dueDate: e.target.value })}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Instruções</label>
                <textarea
                  name="instructions"
                  value={task.instructions}
                  onChange={(e) => setTask({ ...task, instructions: e.target.value })}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Critérios</label>
                <textarea
                  name="criteria"
                  value={task.criteria}
                  onChange={(e) => setTask({ ...task, criteria: e.target.value })}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Materiais</label>
                <input
                  type="file"
                  multiple
                  onChange={handleMaterialChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                {task.materials.length > 0 && (
                  <ul className="list-disc ml-5 mt-2">
                    {task.materials.map((material, index) => (
                      <li key={index}>{material.name || `Material ${index + 1}`}</li>
                    ))}
                  </ul>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">To-Do List</label>
                <ul className="list-disc ml-5">
                  {task.todolist.map((item, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => handleTodoItemChange(index, e.target.value)}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveTodoItem(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remover
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="flex mt-2">
                  <input
                    type="text"
                    value={newTodoItem}
                    onChange={(e) => setNewTodoItem(e.target.value)}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Adicionar novo item"
                  />
                  <button
                    type="button"
                    onClick={handleAddTodoItem}
                    className="ml-2 bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600"
                  >
                    Adicionar
                  </button>
                </div>
              </div>
              <div className="flex space-x-2 mt-4">
                <button
                  type="submit"
                  className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors duration-300"
                >
                  Salvar Alterações
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors duration-300"
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </div>
      ) : (
        <p>Carregando detalhes da tarefa...</p>
      )}
    </div>
  );
};

export default TaskPage;
