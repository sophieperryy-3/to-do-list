/**
 * Task Model
 * 
 * Defines the structure of a Task entity in our application.
 * This model is used for both API responses and DynamoDB storage.
 */

export interface Task {
  id: string;              // Unique identifier (UUID)
  title: string;           // Task title (required)
  description?: string;    // Optional task description
  dueDate?: string;        // Optional due date (ISO 8601)
  completed: boolean;      // Completion status
  createdAt: string;       // ISO 8601 timestamp
  updatedAt: string;       // ISO 8601 timestamp
}

/**
 * Input for creating a new task
 */
export interface CreateTaskInput {
  title: string;
  description?: string;
  dueDate?: string;
}

/**
 * Input for updating a task
 */
export interface UpdateTaskInput {
  title?: string;
  description?: string;
  dueDate?: string;
  completed?: boolean;
}

/**
 * Validate task creation input
 */
export function validateCreateTaskInput(input: unknown): input is CreateTaskInput {
  if (typeof input !== 'object' || input === null) {
    return false;
  }
  
  const data = input as Record<string, unknown>;
  
  // Title is required and must be a non-empty string
  if (typeof data.title !== 'string' || data.title.trim().length === 0) {
    return false;
  }
  
  // Description is optional but must be a string if provided
  if (data.description !== undefined && typeof data.description !== 'string') {
    return false;
  }
  
  // Due date is optional but must be a string if provided
  if (data.dueDate !== undefined && typeof data.dueDate !== 'string') {
    return false;
  }
  
  return true;
}

/**
 * Validate task update input
 */
export function validateUpdateTaskInput(input: unknown): input is UpdateTaskInput {
  if (typeof input !== 'object' || input === null) {
    return false;
  }
  
  const data = input as Record<string, unknown>;
  
  // At least one field must be provided
  if (!data.title && !data.description && !data.dueDate && data.completed === undefined) {
    return false;
  }
  
  // Title must be a non-empty string if provided
  if (data.title !== undefined && (typeof data.title !== 'string' || data.title.trim().length === 0)) {
    return false;
  }
  
  // Description must be a string if provided
  if (data.description !== undefined && typeof data.description !== 'string') {
    return false;
  }
  
  // Due date must be a string if provided
  if (data.dueDate !== undefined && typeof data.dueDate !== 'string') {
    return false;
  }
  
  // Completed must be a boolean if provided
  if (data.completed !== undefined && typeof data.completed !== 'boolean') {
    return false;
  }
  
  return true;
}
