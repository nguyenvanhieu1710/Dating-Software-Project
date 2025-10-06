export interface IEmailSendRequest {
  subject: string;
  htmlContent: string;
}

export interface IEmailSendResponse {
  success: boolean;
  message: string;
  total: number;
  successful: number;
  failed: number;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
