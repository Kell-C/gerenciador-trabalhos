// src/services/authService.ts
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { get, ref, set } from "firebase/database"; // Use Firestore se preferir
import { auth, db } from "../firebase.js";

// Função para registrar um novo usuário com Firebase Authentication
export const registerUser = async (
  email: string,
  password: string,
  userType: string
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const userId = userCredential.user.uid;

    // Armazena o tipo de usuário no Realtime Database
    await set(ref(db, `users/${userId}`), {
      email,
      type: userType,
    });

    return userCredential.user;
  } catch (error: any) {
    throw new Error("Erro no registro");
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const userId = userCredential.user.uid;

    // Busca o tipo de usuário no Realtime Database
    const userRef = ref(db, `users/${userId}`);
    const snapshot = await get(userRef);

    if (!snapshot.exists()) {
      throw new Error('Usuário não encontrado no banco de dados');
    }

    const userType = snapshot.val().type;

    // Retorna o usuário e o tipo
    return { user: userCredential.user, userType };
  } catch (error: any) {
    console.error('Erro no login:', error); // Log detalhado para o console
    // Ajustar a mensagem de erro com base no código de erro retornado pelo Firebase
    let errorMessage = 'Erro no login. Verifique suas credenciais.';
    if (error.code === 'auth/user-not-found') {
      errorMessage = 'Usuário não encontrado.';
    } else if (error.code === 'auth/wrong-password') {
      errorMessage = 'Senha incorreta. Verifique e tente novamente.';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Formato de email inválido.';
    } else if (error.code === 'auth/network-request-failed') {
      errorMessage = 'Falha de rede. Verifique sua conexão.';
    }

    throw new Error(errorMessage);
  }
};
