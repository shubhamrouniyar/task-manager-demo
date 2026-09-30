import type { Task } from './types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed: ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export function fetchTasks(): Promise<Task[]> {
  return request<Task[]>('/api/tasks');
}

export function createTask(title: string): Promise<Task> {
  return request<Task>('/api/tasks', {
    method: 'POST',
    body: JSON.stringify({ title }),
  });
}

export function toggleTask(id: number): Promise<Task> {
  return request<Task>(`/api/tasks/${id}/toggle`, { method: 'PATCH' });
}

export function deleteTask(id: number): Promise<void> {
  return request<void>(`/api/tasks/${id}`, { method: 'DELETE' });
}

export { API_URL };
