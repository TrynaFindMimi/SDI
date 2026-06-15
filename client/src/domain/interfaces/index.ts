export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: {
    code: string;
    message: string;
  };
}

export interface IApiClient {
  get<T>(url: string): Promise<T>;
  post<T>(url: string, data: any): Promise<T>;
  put<T>(url: string, data: any): Promise<T>;
  patch<T>(url: string, data: any): Promise<T>;
  delete(url: string): Promise<void>;
  setToken(token: string): void;
  clearToken(): void;
}
