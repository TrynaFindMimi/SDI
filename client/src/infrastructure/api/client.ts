import axios, { AxiosInstance } from 'axios';
import { IApiClient } from '@domain/interfaces';

const BASE_URL = '/api/v1';

class AxiosApiClient implements IApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: BASE_URL,
      headers: { 'Content-Type': 'application/json' }
    });

    this.client.interceptors.response.use(
      (response) => response.data,
      (error) => {
        const message = error.response?.data?.error?.message || 'Error de conexión';
        return Promise.reject(new Error(message));
      }
    );
  }

  setToken(token: string): void {
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  clearToken(): void {
    delete this.client.defaults.headers.common['Authorization'];
  }

  async get<T>(url: string): Promise<T> {
    return this.client.get(url) as any;
  }

  async post<T>(url: string, data: any): Promise<T> {
    return this.client.post(url, data) as any;
  }

  async put<T>(url: string, data: any): Promise<T> {
    return this.client.put(url, data) as any;
  }

  async patch<T>(url: string, data: any): Promise<T> {
    return this.client.patch(url, data) as any;
  }

  async delete(url: string): Promise<void> {
    await this.client.delete(url);
  }
}

export const apiClient = new AxiosApiClient();
