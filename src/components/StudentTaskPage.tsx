// src/components/StudentTaskPage.tsx
import React, { useState, useEffect, ChangeEvent } from 'react';
import { useParams } from 'react-router-dom';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase';
import { getGroupsFromTask, addGroupToTask } from '../services/groupService';

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  instructions: string;
  criteria: string;
  themes: { title: string; description: string }[];
  maxGroupSize: number;
  materials?: File[];
  todoList?: string[];
}

interface Group {
  id: string;
  name: string;
  members: string[];
  theme: string;
}

const StudentTaskPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [task, setTask] = useState<Task | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [groupName, setGroupName] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('');
  const [groupMembers, setGroupMembers] = useState<string[]>(['']);

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
            themes: taskData.themes || [],
            maxGroupSize: taskData.maxGroupSize || 0,
            materials: taskData.materials || [],
            todoList: taskData.todoList || [],
          });
        }
      });

      // Carrega os grupos da tarefa
      loadGroups();
    }
  }, [id]);

  // Função para carregar os grupos da tarefa
  const loadGroups = async () => {
    if (id) {
      const loadedGroups = await getGroupsFromTask(id);
      setGroups(loadedGroups ? Object.values(loadedGroups) : []);
    }
  };

  const handleAddMember = () => {
    if (groupMembers.length < (task?.maxGroupSize || 1)) {
      setGroupMembers([...groupMembers, '']);
    } else {
      alert(`O grupo não pode ter mais que ${task?.maxGroupSize} membros.`);
    }
  };

  const handleRegisterGroup = async () => {
    if (!groupName.trim() || groupMembers.some((member) => !member.trim())) {
      alert('Preencha todos os campos do grupo.');
      return;
    }

    if (!selectedTheme) {
      alert('Selecione um tema para o grupo.');
      return;
    }

    const groupData = {
      name: groupName,
      members: groupMembers,
      theme: selectedTheme,
    };

    try {
      await addGroupToTask(task!.id, groupData);
      alert('Grupo registrado com sucesso!');
      setGroups([...groups, { id: Date.now().toString(), ...groupData }]);
      // Limpa os campos do grupo
      setGroupName('');
      setGroupMembers(['']);
      setSelectedTheme('');
    } catch (error) {
      console.error('Erro ao registrar o grupo:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-3xl font-bold text-center text-[#2E7D32] mb-4">Detalhes da Tarefa</h2>
      {task ? (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-2xl font-semibold text-[#2E7D32]">{task.title}</h3>
          <p><strong>Descrição:</strong> {task.description}</p>
          <p><strong>Data de Entrega:</strong> {task.dueDate}</p>
          <p><strong>Instruções:</strong> {task.instructions}</p>
          <p><strong>Critérios:</strong> {task.criteria}</p>
          <div>
            <strong>Materiais:</strong>
            {task.materials?.length > 0 ? (
              <ul className="list-disc ml-5">
                {task.materials.map((material, index) => (
                  <li key={index}>{material.name || `Material ${index + 1}`}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">Nenhum material anexado.</p>
            )}
          </div>
          <div className="mb-4">
            <strong>To-Do List:</strong>
            {task.todoList?.length > 0 ? (
              <ul className="list-disc ml-5">
                {task.todoList.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">Nenhum item na lista.</p>
            )}
          </div>
          <p><strong>Temas Disponíveis:</strong></p>
          <ul className="list-disc ml-5">
            {task.themes.map((theme, index) => (
              <li key={index}>{theme.title}: {theme.description}</li>
            ))}
          </ul>

          {/* Exibição dos grupos já cadastrados */}
          <div className="mt-4">
            <h4 className="text-lg font-semibold">Grupos Cadastrados:</h4>
            {groups.length > 0 ? (
              <ul className="list-disc ml-5">
                {groups.map((group, index) => (
                  <li key={index}>
                    <strong>{group.name}</strong> - Integrantes: {group.members.join(', ')}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">Nenhum grupo cadastrado.</p>
            )}
          </div>

          {/* Formulário para cadastrar grupo */}
          <div className="mt-6">
            <h4 className="text-lg font-semibold">Cadastrar Grupo:</h4>
            <input
              type="text"
              placeholder="Nome do Grupo"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full p-2 border rounded mt-2"
            />
            {groupMembers.map((member, index) => (
              <input
                key={index}
                type="text"
                placeholder={`Membro ${index + 1}`}
                value={member}
                onChange={(e) => {
                  const updatedMembers = [...groupMembers];
                  updatedMembers[index] = e.target.value;
                  setGroupMembers(updatedMembers);
                }}
                className="w-full p-2 border rounded mt-2"
              />
            ))}
            {groupMembers.length < (task.maxGroupSize || 0) && (
              <button
                onClick={handleAddMember}
                className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 mt-2"
              >
                Adicionar Membro
              </button>
            )}
            <select
              value={selectedTheme}
              onChange={(e) => setSelectedTheme(e.target.value)}
              className="w-full p-2 border rounded mt-2"
            >
              <option value="">Selecione um Tema</option>
              {task.themes.map((theme, index) => (
                <option key={index} value={theme.title}>
                  {theme.title}
                </option>
              ))}
            </select>
            <button
              onClick={handleRegisterGroup}
              className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 mt-4"
            >
              Registrar Grupo
            </button>
          </div>
        </div>
      ) : (
        <p>Carregando detalhes da tarefa...</p>
      )}
    </div>
  );
};

export default StudentTaskPage;
