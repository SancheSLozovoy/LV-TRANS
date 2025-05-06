export interface UserAuth {
  email: string;
  password: string;
  phone?: string;
}

export interface User {
  id: number;
  email: string;
  password: string;
  phone: string;
  role_id: number;
}

export interface UserDecodeJWT {
  id: number;
  email: string;
  role_id: number;
}
