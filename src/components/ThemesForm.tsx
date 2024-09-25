// src/components/ThemesForm.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { addThemeToTask, updateThemes, getThemesFromTask } from '../services/taskService'; // Importar as funções corretas

interface Theme {
  title: string;
  description: string;
}

const ThemesForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [themes, setThemes] = useState<Theme[]>([]);
  const [newTheme, setNewTheme] = useState<Theme>({ title: '', description: '' });

  // Carrega os temas existentes da tarefa
  useEffect(() => {
    const loadThemes = async () => {
      if (id) {
        try {
          const loadedThemes = await getThemesFromTask(id); // Busca os temas usando o serviço
          setThemes(loadedThemes);
        } catch (error) {
          console.error("Erro ao carregar os temas:", error);
        }
      }
    };
    loadThemes();
  }, [id]);

  // Função para adicionar um novo tema localmente e ao Firebase
  const handleAddTheme = async () => {
    if (newTheme.title && newTheme.description && id) {
      try {
        await addThemeToTask(id, newTheme); // Adiciona o tema ao Firebase
        setThemes([...themes, newTheme]); // Atualiza a lista de temas localmente
        setNewTheme({ title: '', description: '' });
      } catch (error) {
        console.error("Erro ao adicionar o tema:", error);
        alert("Erro ao adicionar o tema. Tente novamente.");
      }
    } else {
      alert("Preencha todos os campos para adicionar um tema.");
    }
  };

  // Função para salvar todos os temas atualizados no Firebase
  const handleSaveThemes = async () => {
    if (id) {
      try {
        await updateThemes(id, themes); // Usa o serviço para atualizar os temas no Firebase
        alert('Temas atualizados com sucesso!');
        navigate(`/task/${id}`); // Retorna para a página da tarefa
      } catch (error) {
        console.error("Erro ao salvar os temas:", error);
        alert("Erro ao salvar os temas. Tente novamente.");
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-3xl font-bold text-center text-[#2E7D32] mb-4">Editar Temas</h2>
      <div className="bg-white shadow-md rounded-lg p-6 space-y-4">
        {themes.map((theme, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div className="flex-1">
              <p>
                <strong>{theme.title}:</strong> {theme.description}
              </p>
            </div>
            <button
              onClick={() => setThemes(themes.filter((_, i) => i !== index))}
              className="text-red-500 hover:text-red-700"
            >
              Remover
            </button>
          </div>
        ))}
        <input
          type="text"
          placeholder="Título do tema"
          value={newTheme.title}
          onChange={(e) => setNewTheme({ ...newTheme, title: e.target.value })}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <textarea
          placeholder="Descrição do tema"
          value={newTheme.description}
          onChange={(e) => setNewTheme({ ...newTheme, description: e.target.value })}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          onClick={handleAddTheme}
          className="mt-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Adicionar Tema
        </button>
        <button
          onClick={handleSaveThemes}
          className="mt-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
        >
          Salvar Temas
        </button>
      </div>
    </div>
  );
};

export default ThemesForm;
