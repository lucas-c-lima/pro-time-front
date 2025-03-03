export interface AuthResponse{
  id: number;
  name: string;
  email: string;
  token: string;
  profile: number;
}

// TODO verificar profile se aceita int, string ou enum
export enum Profile {
  ADMIN,
  USUARIO
}
