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
    <div className="bg-gray-50 p-6 rounded-md shadow-sm">
  <h4 className="text-xl font-semibold text-[#2E7D32] mb-4">Temas Disponíveis</h4>
  {themes.length > 0 ? (
    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {themes.map((theme, index) => (
        <div
          key={index}
          className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200"
        >
          <h5 className="text-lg font-semibold text-[#2E7D32] mb-2">
            {theme.title}
          </h5>
          <p className="text-gray-700">{theme.description}</p>
        </div>
      ))}
    </div>
  ) : (
    <p className="text-gray-600">Nenhum tema disponível.</p>
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
