// src/components/ThemesSection.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface Theme {
  title: string;
  description: string;
}

interface ThemesSectionProps {
  themes: Theme[];
  taskId: string; // ID da tarefa para redirecionar corretamente para o formulário de temas
}

const ThemesSection: React.FC<ThemesSectionProps> = ({ themes, taskId }) => {
  const navigate = useNavigate();

  const handleEditThemes = () => {
    navigate(`/task/${taskId}/edit-themes`); // Navega para o formulário de edição de temas
  };

  return (
    <div className="mt-6">
      <h4 className="font-semibold text-lg text-[#2E7D32] mb-2">Temas Disponíveis:</h4>
      {themes.length > 0 ? (
        <ul className="list-disc ml-5 text-gray-700">
          {themes.map((theme, index) => (
            <li key={index}>
              <strong>{theme.title}:</strong> {theme.description}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-700">Nenhum tema disponível.</p>
      )}
      <button
        onClick={handleEditThemes}
        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-transform duration-200 transform hover:scale-105"
      >
        Editar Temas
      </button>
    </div>
  );
};

export default ThemesSection;
