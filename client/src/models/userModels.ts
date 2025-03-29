export interface UserRegister {
  login: string;
  password: string;
  phone: string;
}

export interface UserLogin {
  login: string;
  password: string;
}

export interface User {
  id: number;
  login: string;
  password: string;
  phone: string;
  role_id: number;
}
