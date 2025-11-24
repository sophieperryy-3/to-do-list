/**
 * Task Service
 * 
 * Business logic for task operations.
 * Interacts with DynamoDB to perform CRUD operations.
 * This layer is independent of HTTP/Express, making it testable.
 */

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, GetCommand, ScanCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import { Task, CreateTaskInput, UpdateTaskInput } from '../models/task';
import { config } from '../utils/config';
import { logInfo, logError } from '../utils/logger';

// Initialize DynamoDB client
const client = new DynamoDBClient({ region: config.awsRegion });
const docClient = DynamoDBDocumentClient.from(client);

/**
 * Get all tasks
 */
export async function getAllTasks(): Promise<Task[]> {
  try {
    logInfo('Fetching all tasks from DynamoDB', { table: config.dynamodbTableName });
    
    const command = new ScanCommand({
      TableName: config.dynamodbTableName,
    });
    
    const response = await docClient.send(command);
    const tasks = (response.Items || []) as Task[];
    
    // Sort by createdAt descending (newest first)
    tasks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    logInfo('Successfully fetched tasks', { count: tasks.length });
    return tasks;
  } catch (error) {
    logError('Failed to fetch tasks', error as Error, { table: config.dynamodbTableName });
    throw new Error('Failed to fetch tasks from database');
  }
}

/**
 * Get a single task by ID
 */
export async function getTaskById(id: string): Promise<Task | null> {
  try {
    logInfo('Fetching task by ID', { taskId: id });
    
    const command = new GetCommand({
      TableName: config.dynamodbTableName,
      Key: { id },
    });
    
    const response = await docClient.send(command);
    
    if (!response.Item) {
      logInfo('Task not found', { taskId: id });
      return null;
    }
    
    return response.Item as Task;
  } catch (error) {
    logError('Failed to fetch task', error as Error, { taskId: id });
    throw new Error('Failed to fetch task from database');
  }
}

/**
 * Create a new task
 */
export async function createTask(input: CreateTaskInput): Promise<Task> {
  try {
    const now = new Date().toISOString();
    const task: Task = {
      id: uuidv4(),
      title: input.title.trim(),
      description: input.description?.trim(),
      completed: false,
      createdAt: now,
      updatedAt: now,
    };
    
    logInfo('Creating new task', { taskId: task.id, title: task.title });
    
    const command = new PutCommand({
      TableName: config.dynamodbTableName,
      Item: task,
    });
    
    await docClient.send(command);
    
    logInfo('Task created successfully', { taskId: task.id });
    return task;
  } catch (error) {
    logError('Failed to create task', error as Error, { input });
    throw new Error('Failed to create task in database');
  }
}

/**
 * Update an existing task
 */
export async function updateTask(id: string, input: UpdateTaskInput): Promise<Task | null> {
  try {
    logInfo('Updating task', { taskId: id, updates: input });
    
    // First check if task exists
    const existingTask = await getTaskById(id);
    if (!existingTask) {
      return null;
    }
    
    // Build update expression dynamically
    const updateExpressions: string[] = [];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, unknown> = {};
    
    if (input.title !== undefined) {
      updateExpressions.push('#title = :title');
      expressionAttributeNames['#title'] = 'title';
      expressionAttributeValues[':title'] = input.title.trim();
    }
    
    if (input.description !== undefined) {
      updateExpressions.push('#description = :description');
      expressionAttributeNames['#description'] = 'description';
      expressionAttributeValues[':description'] = input.description.trim();
    }
    
    if (input.completed !== undefined) {
      updateExpressions.push('#completed = :completed');
      expressionAttributeNames['#completed'] = 'completed';
      expressionAttributeValues[':completed'] = input.completed;
    }
    
    // Always update the updatedAt timestamp
    updateExpressions.push('#updatedAt = :updatedAt');
    expressionAttributeNames['#updatedAt'] = 'updatedAt';
    expressionAttributeValues[':updatedAt'] = new Date().toISOString();
    
    const command = new UpdateCommand({
      TableName: config.dynamodbTableName,
      Key: { id },
      UpdateExpression: `SET ${updateExpressions.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW',
    });
    
    const response = await docClient.send(command);
    
    logInfo('Task updated successfully', { taskId: id });
    return response.Attributes as Task;
  } catch (error) {
    logError('Failed to update task', error as Error, { taskId: id, input });
    throw new Error('Failed to update task in database');
  }
}

/**
 * Delete a task
 */
export async function deleteTask(id: string): Promise<boolean> {
  try {
    logInfo('Deleting task', { taskId: id });
    
    // First check if task exists
    const existingTask = await getTaskById(id);
    if (!existingTask) {
      return false;
    }
    
    const command = new DeleteCommand({
      TableName: config.dynamodbTableName,
      Key: { id },
    });
    
    await docClient.send(command);
    
    logInfo('Task deleted successfully', { taskId: id });
    return true;
  } catch (error) {
    logError('Failed to delete task', error as Error, { taskId: id });
    throw new Error('Failed to delete task from database');
  }
}
