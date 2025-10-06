// Auth request/response types

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface IRegisterRequest {
  email: string;
  password: string;
  phone_number: string;
}

export interface IAuthResponse {
  user: IUser;
  token: string;
}

export interface ILoginResponse {
  success: boolean;
  data: IAuthResponse;
  message: string;
}

export interface IRegisterResponse {
  success: boolean;
  data: IAuthResponse;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
