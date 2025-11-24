/**
 * Task Routes
 * 
 * HTTP endpoints for task CRUD operations.
 * Handles request validation, calls service layer, and formats responses.
 */

import { Router, Request, Response } from 'express';
import * as taskService from '../services/taskService';
import { validateCreateTaskInput, validateUpdateTaskInput } from '../models/task';
import { logInfo, logError } from '../utils/logger';

const router = Router();

/**
 * GET /tasks
 * Get all tasks
 */
router.get('/', async (req: Request, res: Response) => {
  const requestId = (req as any).requestId;
  const startTime = Date.now();
  
  try {
    logInfo('GET /tasks - Fetching all tasks', { requestId });
    
    const tasks = await taskService.getAllTasks();
    const duration = Date.now() - startTime;
    
    logInfo('GET /tasks - Success', {
      requestId,
      count: tasks.length,
      duration,
      statusCode: 200,
    });
    
    res.status(200).json({
      success: true,
      data: tasks,
      count: tasks.length,
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    logError('GET /tasks - Failed', error as Error, { requestId, duration });
    
    res.status(500).json({
      success: false,
      error: 'Failed to fetch tasks',
    });
  }
});

/**
 * GET /tasks/:id
 * Get a single task by ID
 */
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  const requestId = (req as any).requestId;
  const { id } = req.params;
  const startTime = Date.now();
  
  try {
    logInfo('GET /tasks/:id - Fetching task', { requestId, taskId: id });
    
    const task = await taskService.getTaskById(id);
    const duration = Date.now() - startTime;
    
    if (!task) {
      logInfo('GET /tasks/:id - Task not found', { requestId, taskId: id, duration, statusCode: 404 });
      res.status(404).json({
        success: false,
        error: 'Task not found',
      });
      return;
    }
    
    logInfo('GET /tasks/:id - Success', { requestId, taskId: id, duration, statusCode: 200 });
    
    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    logError('GET /tasks/:id - Failed', error as Error, { requestId, taskId: id, duration });
    
    res.status(500).json({
      success: false,
      error: 'Failed to fetch task',
    });
  }
});

/**
 * POST /tasks
 * Create a new task
 */
router.post('/', async (req: Request, res: Response): Promise<void> => {
  const requestId = (req as any).requestId;
  const startTime = Date.now();
  
  try {
    logInfo('POST /tasks - Creating task', { requestId, body: req.body });
    
    // Validate input
    if (!validateCreateTaskInput(req.body)) {
      const duration = Date.now() - startTime;
      logInfo('POST /tasks - Invalid input', { requestId, duration, statusCode: 400 });
      
      res.status(400).json({
        success: false,
        error: 'Invalid input. Title is required and must be a non-empty string.',
      });
      return;
    }
    
    const task = await taskService.createTask(req.body);
    const duration = Date.now() - startTime;
    
    logInfo('POST /tasks - Success', {
      requestId,
      taskId: task.id,
      duration,
      statusCode: 201,
    });
    
    res.status(201).json({
      success: true,
      data: task,
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    logError('POST /tasks - Failed', error as Error, { requestId, duration });
    
    res.status(500).json({
      success: false,
      error: 'Failed to create task',
    });
  }
});

/**
 * PATCH /tasks/:id
 * Update a task (title, description, or completion status)
 */
router.patch('/:id', async (req: Request, res: Response): Promise<void> => {
  const requestId = (req as any).requestId;
  const { id } = req.params;
  const startTime = Date.now();
  
  try {
    logInfo('PATCH /tasks/:id - Updating task', { requestId, taskId: id, body: req.body });
    
    // Validate input
    if (!validateUpdateTaskInput(req.body)) {
      const duration = Date.now() - startTime;
      logInfo('PATCH /tasks/:id - Invalid input', { requestId, taskId: id, duration, statusCode: 400 });
      
      res.status(400).json({
        success: false,
        error: 'Invalid input. Provide at least one field to update (title, description, or completed).',
      });
      return;
    }
    
    const task = await taskService.updateTask(id, req.body);
    const duration = Date.now() - startTime;
    
    if (!task) {
      logInfo('PATCH /tasks/:id - Task not found', { requestId, taskId: id, duration, statusCode: 404 });
      res.status(404).json({
        success: false,
        error: 'Task not found',
      });
      return;
    }
    
    logInfo('PATCH /tasks/:id - Success', {
      requestId,
      taskId: id,
      duration,
      statusCode: 200,
    });
    
    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    logError('PATCH /tasks/:id - Failed', error as Error, { requestId, taskId: id, duration });
    
    res.status(500).json({
      success: false,
      error: 'Failed to update task',
    });
  }
});

/**
 * DELETE /tasks/:id
 * Delete a task
 */
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  const requestId = (req as any).requestId;
  const { id } = req.params;
  const startTime = Date.now();
  
  try {
    logInfo('DELETE /tasks/:id - Deleting task', { requestId, taskId: id });
    
    const deleted = await taskService.deleteTask(id);
    const duration = Date.now() - startTime;
    
    if (!deleted) {
      logInfo('DELETE /tasks/:id - Task not found', { requestId, taskId: id, duration, statusCode: 404 });
      res.status(404).json({
        success: false,
        error: 'Task not found',
      });
      return;
    }
    
    logInfo('DELETE /tasks/:id - Success', {
      requestId,
      taskId: id,
      duration,
      statusCode: 200,
    });
    
    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    logError('DELETE /tasks/:id - Failed', error as Error, { requestId, taskId: id, duration });
    
    res.status(500).json({
      success: false,
      error: 'Failed to delete task',
    });
  }
});

export default router;
