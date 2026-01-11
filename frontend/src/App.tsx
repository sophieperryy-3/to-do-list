/**
 * Main App Component
 * 
 * Manages application state and orchestrates API calls.
 * Demonstrates DevOps-friendly error handling and user feedback.
 */

import { useState, useEffect } from 'react';
import * as api from './api/client';
import { Task } from './api/client';
import AddTaskForm from './components/AddTaskForm';
import TaskList from './components/TaskList';

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generate or get user session ID
  const getUserId = () => {
    let userId = localStorage.getItem('userId');
    if (!userId) {
      userId = `user-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('userId', userId);
    }
    return userId;
  };

  // Load tasks on mount
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const userId = getUserId();
      
      // For demo: use localStorage to store tasks per device
      const localTasks = localStorage.getItem(`tasks-${userId}`);
      if (localTasks) {
        setTasks(JSON.parse(localTasks));
      } else {
        setTasks([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tasks');
      console.error('Failed to load tasks:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTask = async (title: string, description?: string, dueDate?: string) => {
    try {
      setIsAdding(true);
      setError(null);
      
      // Create task locally
      const newTask = {
        id: `${Date.now()}-${Math.random()}`,
        title,
        description,
        dueDate,
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      const updatedTasks = [newTask, ...tasks];
      setTasks(updatedTasks);
      
      // Save to localStorage
      const userId = getUserId();
      localStorage.setItem(`tasks-${userId}`, JSON.stringify(updatedTasks));
      
      // Also save to backend for demo purposes
      try {
        await api.createTask({ title, description, dueDate });
      } catch {
        // Ignore backend errors - localStorage is primary
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task');
      console.error('Failed to create task:', err);
    } finally {
      setIsAdding(false);
    }
  };

  const handleToggleTask = async (id: string, completed: boolean) => {
    try {
      setError(null);
      const updatedTasks = tasks.map(t => 
        t.id === id ? { ...t, completed, updatedAt: new Date().toISOString() } : t
      );
      setTasks(updatedTasks);
      
      // Save to localStorage
      const userId = getUserId();
      localStorage.setItem(`tasks-${userId}`, JSON.stringify(updatedTasks));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task');
      console.error('Failed to update task:', err);
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (!confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      setError(null);
      const updatedTasks = tasks.filter(t => t.id !== id);
      setTasks(updatedTasks);
      
      // Save to localStorage
      const userId = getUserId();
      localStorage.setItem(`tasks-${userId}`, JSON.stringify(updatedTasks));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task');
      console.error('Failed to delete task:', err);
    }
  };

  return (
    <div
      style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '40px 20px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <header style={{ marginBottom: '40px', textAlign: 'center' }}>
        <h1 style={{ margin: '0 0 12px 0', fontSize: '48px', color: '#ffffff', fontWeight: '700', letterSpacing: '-0.5px' }}>
          Task Manager - Update
        </h1>
        <p style={{ margin: 0, color: '#ffffff', fontSize: '16px', opacity: 0.85, fontWeight: '400' }}>
          Streamline your productivity and stay effortlessly organized
        </p>
      </header>

      <div style={{ marginBottom: '32px', backgroundColor: '#ffffff', borderRadius: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
        <AddTaskForm onAdd={handleAddTask} isLoading={isAdding} />
      </div>

      {error && (
        <div
          style={{
            marginBottom: '20px',
            padding: '16px 20px',
            backgroundColor: '#ffffff',
            border: '2px solid #e74c3c',
            borderRadius: '12px',
            color: '#c0392b',
            boxShadow: '0 4px 12px rgba(231, 76, 60, 0.2)',
          }}
        >
          <strong>Error:</strong> {error}
          <button
            onClick={() => setError(null)}
            style={{
              marginLeft: '12px',
              padding: '4px 8px',
              backgroundColor: 'transparent',
              border: '1px solid #c62828',
              borderRadius: '4px',
              color: '#c62828',
              cursor: 'pointer',
              fontSize: '12px',
            }}
          >
            Dismiss
          </button>
        </div>
      )}

      <TaskList
        tasks={tasks}
        isLoading={isLoading}
        error={null}
        onToggle={handleToggleTask}
        onDelete={handleDeleteTask}
      />


    </div>
  );
}
