// src/services/taskService.ts
import { ref, set, update, push, remove, onValue, get } from 'firebase/database';
import { db } from '../firebase';

interface Theme {
  title: string;
  description: string;
}

interface Group {
  name: string;
  members: string[];
}
// Definindo o tipo da tarefa
interface Task {
  id?: string;
  title: string;
  description: string;
  dueDate: string;
  instructions: string;
  criteria: string;
  materials?: File[];
  todolist?: string[];
  themes: Theme[];
  groups: Group[];
  
}

// Função para criar uma nova tarefa
export const createTask = async (task: Task) => {
  const taskRef = ref(db, 'tasks');
  const newTaskRef = push(taskRef);
  await set(newTaskRef, task);
};

// Função para atualizar uma tarefa existente
export const updateTask = async (id: string, task: Task) => {
  const taskRef = ref(db, `tasks/${id}`);
  await update(taskRef, task);
};

// Função para deletar uma tarefa
export const deleteTask = async (id: string) => {
  const taskRef = ref(db, `tasks/${id}`);
  await remove(taskRef);
};

// Função para buscar todas as tarefas
export const fetchTasks = async () => {
  const taskRef = ref(db, 'tasks');
  const snapshot = await get(taskRef);
  if (snapshot.exists()) {
    const data = snapshot.val();
    return Object.entries(data).map(([id, task]) => ({  id,
  ...Object.assign({}, task), // Isso garante que task seja tratado como um objeto
}));
  }
  return [];
}

// Função para adicionar um tema a uma tarefa específica
export const addThemeToTask = async (taskId: string, theme: { title: string; description: string }) => {
  const themesRef = ref(db, `tasks/${taskId}/themes`);
  const newThemeRef = push(themesRef); // Cria um novo nó para o tema
  await set(newThemeRef, theme); // Adiciona o tema no nó criado
};

// Função para atualizar todos os temas de uma tarefa específica
export const updateThemes = async (taskId: string, themes: { title: string; description: string }[]) => {
  const taskRef = ref(db, `tasks/${taskId}`);
  await update(taskRef, { themes }); // Atualiza o campo "themes" da tarefa com a lista de temas
};

// Função para remover um tema específico da tarefa
export const removeThemeFromTask = async (taskId: string, themeId: string) => {
  const themeRef = ref(db, `tasks/${taskId}/themes/${themeId}`);
  await remove(themeRef); // Remove o tema específico da tarefa
};

// Função para obter os temas de uma tarefa
export const getThemesFromTask = async (taskId: string): Promise<{ title: string; description: string }[]> => {
  const themesRef = ref(db, `tasks/${taskId}/themes`);
  return new Promise((resolve, reject) => {
    onValue(themesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        resolve(Object.values(data));
      } else {
        resolve([]);
      }
    }, reject);
  });
};

// Função para adicionar um novo grupo à tarefa
export const addGroupToTask = async (taskId: string, groupData: any) => {
  const groupsRef = ref(db, `tasks/${taskId}/groups`);
  const newGroupRef = push(groupsRef);
  await set(newGroupRef, groupData);
}


// Função para buscar grupos da tarefa pelo ID
export const fetchGroupsFromTask = async (taskId: string) => {
  const groupsRef = ref(db, `tasks/${taskId}/groups`);
  const snapshot = await get(groupsRef);
  if (snapshot.exists()) {
    return Object.entries(snapshot.val()).map(([id, group]) => ({ id, ...(group as object) }));
  }
  return [];
};


