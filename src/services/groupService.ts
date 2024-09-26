// src/services/groupService.ts
import { db } from '../firebase';
import { ref, set, get, push, update } from 'firebase/database';

// Adiciona um grupo à tarefa especificada
export const addGroupToTask = async (taskId: string, group: { name: string; members: string[] }) => {
  const groupRef = push(ref(db, `tasks/${taskId}/groups`));
  await set(groupRef, group);
};

// Obtém todos os grupos associados a uma tarefa
export const getGroupsFromTask = async (taskId: string) => {
  const snapshot = await get(ref(db, `tasks/${taskId}/groups`));
  return snapshot.exists() ? snapshot.val() : [];
};

// Atualiza os grupos de uma tarefa
export const updateGroupsOfTask = async (taskId: string, groups: any) => {
  await update(ref(db, `tasks/${taskId}`), { groups });
};
