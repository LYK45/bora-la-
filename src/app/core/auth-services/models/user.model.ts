export interface User {
  _id: string;
  email: string;
  senha: string;
}

export interface AuthResponse {
  message?: string;
  user?: User;
  token?: string;
  // Algumas APIs retornam { token, usuario } ou apenas { token }
  usuario?: User;
}
export interface LoginPayload {
  email: string;
  senha: string;
}
export interface RegisterPayload {
  nome: string;
  email: string;
  senha: string;
}
