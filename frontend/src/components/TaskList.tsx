/**
 * TaskList Component
 * 
 * Displays a list of tasks.
 * Shows loading state, empty state, and error state.
 */

import { Task } from '../api/client';
import TaskItem from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
}

export default function TaskList({ tasks, isLoading, error, onToggle, onDelete }: TaskListProps) {
  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
        <p>Loading tasks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          padding: '20px',
          backgroundColor: '#ffebee',
          border: '1px solid #f44336',
          borderRadius: '8px',
          color: '#c62828',
        }}
      >
        <strong>Error:</strong> {error}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '40px',
          color: '#999',
          border: '2px dashed #ddd',
          borderRadius: '8px',
        }}
      >
        <p style={{ fontSize: '16px', margin: 0 }}>
          No tasks yet. Add your first task above!
        </p>
      </div>
    );
  }

  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
          padding: '12px',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
        }}
      >
        <h2 style={{ margin: 0, fontSize: '18px', color: '#333' }}>
          Your Tasks
        </h2>
        <span style={{ fontSize: '14px', color: '#666' }}>
          {completedCount} of {tasks.length} completed
        </span>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={onToggle}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}
