import api from '../config/api';
import { removeToken, saveToken } from '../config/auth';

type AuthResponse = {
  success: boolean;
  token?: string;
};

export async function signIn(email: string, password: string) {
  const response = await api.post<AuthResponse>('/auth/login', {
    userEmail: email,
    userPassword: password,
  });

  if (!response.data.success || !response.data.token) {
    throw new Error('Não foi possível iniciar a sessão.');
  }

  await saveToken(response.data.token);
}

export async function registerAccount(formData: FormData) {
  const response = await api.post<AuthResponse>('/auth/register', formData);

  if (!response.data.success || !response.data.token) {
    throw new Error('Não foi possível concluir o cadastro.');
  }

  await saveToken(response.data.token);
}

export async function signOut() {
  try {
    await api.get('/auth/logout');
  } finally {
    await removeToken();
  }
}
