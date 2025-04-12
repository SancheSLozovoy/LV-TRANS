export interface UserAuth {
  login: string;
  password: string;
  phone?: string;
}

export interface User {
  id: number;
  login: string;
  password: string;
  phone: string;
  role_id: number;
}

export interface UserDecodeJWT {
  id: number;
  login: string;
  role_id: number;
}
