/**
 * API Client
 * 
 * Handles all HTTP requests to the backend API.
 * Uses environment variable for API URL (different per environment).
 */

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  dueDate?: string;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  dueDate?: string;
  completed?: boolean;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  count?: number;
  error?: string;
  message?: string;
}

// Get API URL from environment variable
// In development: uses Vite proxy (/api)
// In production: uses actual API Gateway URL
const API_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Generic fetch wrapper with error handling
 */
async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred');
  }
}

/**
 * Get all tasks
 */
export async function getAllTasks(): Promise<Task[]> {
  // Demo mode: return mock data if API is unavailable
  try {
    const response = await fetchApi<ApiResponse<Task[]>>('/tasks');
    return response.data || [];
  } catch (error) {
    console.warn('API unavailable, using demo data');
    return [
      {
        id: '1',
        title: 'Demo Task 1',
        description: 'This is a demo task showing the UI',
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        title: 'Demo Task 2',
        description: 'Backend API not deployed yet',
        completed: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  }
}

/**
 * Get a single task by ID
 */
export async function getTaskById(id: string): Promise<Task> {
  const response = await fetchApi<ApiResponse<Task>>(`/tasks/${id}`);
  if (!response.data) {
    throw new Error('Task not found');
  }
  return response.data;
}

/**
 * Create a new task
 */
export async function createTask(input: CreateTaskInput): Promise<Task> {
  const response = await fetchApi<ApiResponse<Task>>('/tasks', {
    method: 'POST',
    body: JSON.stringify(input),
  });
  if (!response.data) {
    throw new Error('Failed to create task');
  }
  return response.data;
}

/**
 * Update a task
 */
export async function updateTask(id: string, input: UpdateTaskInput): Promise<Task> {
  const response = await fetchApi<ApiResponse<Task>>(`/tasks/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
  if (!response.data) {
    throw new Error('Failed to update task');
  }
  return response.data;
}

/**
 * Delete a task
 */
export async function deleteTask(id: string): Promise<void> {
  await fetchApi<ApiResponse<void>>(`/tasks/${id}`, {
    method: 'DELETE',
  });
}
