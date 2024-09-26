import React, { useState, useEffect } from 'react';
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
  themes: { title: string; description: string; available: boolean }[];
  materials: File[];
  todoList: string[];
}

interface Group {
  id: string;
  name: string;
  members: string[];
  theme: string;
}

interface Theme {
    title: string;
    description: string
}


const StudentTaskPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [task, setTask] = useState<Task | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [groupName, setGroupName] = useState('');
  const [groupMembers, setGroupMembers] = useState<string[]>(['']);
  const [selectedThemeIndex, setSelectedThemeIndex] = useState<number | null>(null);

  useEffect(() => {
    if (id) {
      const taskRef = ref(db, `tasks/${id}`);
      onValue(taskRef, (snapshot) => {
        const taskData = snapshot.val();
        if (taskData) {
          // Verifica se taskData.themes é um array, caso contrário, define um array vazio
          const themes = Array.isArray(taskData.themes) ? taskData.themes : [];

          setTask({
            id,
            title: taskData.title || '',
            description: taskData.description || '',
            dueDate: taskData.dueDate || '',
            instructions: taskData.instructions || '',
            criteria: taskData.criteria || '',
            themes: themes.map((theme: Theme) => ({
              ...theme,
              available: !groups.some((group) => group.theme === theme.title),
            })),
            
            materials: taskData.materials || [],
            todoList: taskData.todoList || [],
          });
        }
      });
    }
  }, [id, groups]); // Certifique-se de que `groups` está correto na lista de dependências

  const loadGroups = async () => {
    if (id) {
      const loadedGroups = await getGroupsFromTask(id);
      setGroups(loadedGroups ? Object.values(loadedGroups) : []);
    }
  };

  useEffect(() => {
    loadGroups();
  }, [id]); // Chama a função para carregar grupos apenas quando `id` muda

  const handleRegisterGroup = async () => {
    if (!groupName.trim() || groupMembers.some((member) => !member.trim())) {
      alert('Preencha todos os campos do grupo.');
      return;
    }

    if (selectedThemeIndex === null) {
      alert('Selecione um tema para o grupo.');
      return;
    }

    const selectedTheme = task!.themes[selectedThemeIndex];

    const groupData = {
      name: groupName,
      members: groupMembers,
      theme: selectedTheme.title,
    };

    try {
      await addGroupToTask(task!.id, groupData);
      alert('Grupo registrado com sucesso!');
      setGroups([...groups, { id: Date.now().toString(), ...groupData }]);

      // Atualiza a disponibilidade do tema
      const updatedThemes = [...task!.themes];
      updatedThemes[selectedThemeIndex].available = false;
      setTask({ ...task!, themes: updatedThemes });

      setGroupName('');
      setGroupMembers(['']);
      setSelectedThemeIndex(null);
    } catch (error) {
      console.error('Erro ao registrar o grupo:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-full">
      <h2 className="text-4xl font-bold text-center text-[#2E7D32] mb-6">Detalhes da Tarefa</h2>
      {task ? (
        <div className="bg-white shadow-lg rounded-lg p-8 space-y-6">
          {/* Detalhes da Tarefa */}
          <div className="border-b pb-4 mb-4">
            <h3 className="text-3xl font-semibold text-[#2E7D32]">{task.title}</h3>
            <p className="text-gray-700 mt-2"><strong>Descrição:</strong> {task.description}</p>
            <p className="text-gray-700 mt-2"><strong>Data de Entrega:</strong> {task.dueDate}</p>
          </div>

          {/* Sessões de Instruções, Critérios, Materiais e To-Do List */}
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

          {/* Sessões de Materiais e To-Do List */}
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="bg-gray-50 p-6 rounded-md shadow-sm">
              <h4 className="text-xl font-semibold text-[#2E7D32]">Materiais</h4>
              {task.materials?.length > 0 ? (
                <ul className="list-disc ml-5 text-gray-700 mt-2">
                  {task.materials?.map((material, index) => (
                    <li key={index}>{material.name || `Material ${index + 1}`}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600">Nenhum material anexado.</p>
              )}
            </div>

            <div className="bg-gray-50 p-6 rounded-md shadow-sm">
              <h4 className="text-xl font-semibold text-[#2E7D32]">To-Do List</h4>
              {task.todoList?.length > 0 ? (
                <ul className="list-disc ml-5 text-gray-700 mt-2">
                  {task.todoList.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600">Nenhum item na lista.</p>
              )}
            </div>
          </div>

          {/* Seção de Temas com Criação de Grupos */}
          <div className="bg-gray-50 p-6 rounded-md shadow-sm">
            <h4 className="text-xl font-semibold text-[#2E7D32] mb-4">Temas Disponíveis</h4>
            {task.themes.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {task.themes.map((theme, index) => (
                  <div
                    key={index}
                    className={`p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200 ${!theme.available ? 'opacity-50' : ''
                      }`}
                  >
                    <h5 className="text-lg font-semibold text-[#2E7D32] mb-2">
                      {theme.title}
                    </h5>
                    <p className="text-gray-700">{theme.description}</p>
                    {theme.available && (
                      <div className="mt-4">
                        {selectedThemeIndex === index && (
                          <>
                            <input
                              type="text"
                              placeholder="Nome do Grupo"
                              value={groupName}
                              onChange={(e) => setGroupName(e.target.value)}
                              className="w-full p-2 border rounded mt-2"
                            />
                            {groupMembers.map((member, idx) => (
                              <input
                                key={idx}
                                type="text"
                                placeholder={`Membro ${idx + 1}`}
                                value={member}
                                onChange={(e) => {
                                  const updatedMembers = [...groupMembers];
                                  updatedMembers[idx] = e.target.value;
                                  setGroupMembers(updatedMembers);
                                }}
                                className="w-full p-2 border rounded mt-2"
                              />
                            ))}
                            
                            <button
                              onClick={handleRegisterGroup}
                              className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 mt-4"
                            >
                              Registrar Grupo
                            </button>
                          </>
                        )}
                        {selectedThemeIndex !== index && (
                          <button
                            onClick={() => setSelectedThemeIndex(index)}
                            className="mt-2 bg-blue-500 text-white py-1 px-4 rounded hover:bg-blue-600 transition-transform duration-200 transform hover:scale-105"
                          >
                            Criar Grupo
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">Nenhum tema disponível.</p>
            )}
          </div>

          {/* Seção de Grupos Cadastrados */}
          <div className="bg-gray-50 p-6 rounded-md shadow-sm">
            <h4 className="text-xl font-semibold text-[#2E7D32]">Grupos Cadastrados</h4>
            {groups.length > 0 ? (
              <ul className="list-disc ml-5 text-gray-700 mt-2">
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
        </div>
      ) : (
        <p>Carregando detalhes da tarefa...</p>
      )}
    </div>
  );
};

export default StudentTaskPage;
