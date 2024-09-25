// src/components/GroupsSection.tsx
import React, { useEffect, useState } from 'react';
import { getGroupsFromTask } from '../services/groupService';

interface Group {
  id: string;
  name: string;
  members: string[];
}

interface GroupsSectionProps {
  taskId: string;
}

const GroupsSection: React.FC<GroupsSectionProps> = ({ taskId }) => {
  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    const loadGroups = async () => {
      try {
        const loadedGroups = await getGroupsFromTask(taskId);
        setGroups(loadedGroups);
      } catch (error) {
        console.error('Erro ao carregar grupos:', error);
      }
    };

    loadGroups();
  }, [taskId]);

  return (
    <div className="mt-6">
      <h4 className="font-semibold text-lg text-[#2E7D32] mb-2">Grupos Cadastrados:</h4>
      {groups.length > 0 ? (
        <ul className="list-disc ml-5 text-gray-700">
          {groups.map((group) => (
            <li key={group.id}>
              <strong>{group.name}:</strong> {group.members.join(', ')}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-700">Nenhum grupo cadastrado.</p>
      )}
    </div>
  );
};

export default GroupsSection;
