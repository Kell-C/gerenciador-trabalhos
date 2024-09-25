// src/services/storageService.ts
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Inicializa o Firebase Storage
const storage = getStorage();

/**
 * Faz o upload de um arquivo para o Firebase Storage e retorna a URL do arquivo.
 * @param file O arquivo a ser carregado
 * @returns A URL do arquivo carregado
 */
export const uploadFile = async (file: File): Promise<string> => {
  try {
    // Cria uma referência para o arquivo no Firebase Storage
    const storageRef = ref(storage, `uploads/${file.name}`);
    
    // Faz o upload do arquivo para a referência criada
    await uploadBytes(storageRef, file);
    
    // Obtém a URL do arquivo carregado
    const downloadURL = await getDownloadURL(storageRef);
    
    return downloadURL;
  } catch (error) {
    console.error('Erro ao fazer upload do arquivo:', error);
    throw new Error('Erro ao fazer upload do arquivo');
  }
};
