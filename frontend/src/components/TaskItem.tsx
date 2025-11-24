/**
 * TaskItem Component
 * 
 * Displays a single task with:
 * - Checkbox to toggle completion
 * - Title and description
 * - Delete button
 */

import { Task } from '../api/client';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
}

export default function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        padding: '16px',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        backgroundColor: task.completed ? '#f5f5f5' : '#ffffff',
      }}
    >
      <input
        type="checkbox"
        checked={task.completed}
        onChange={(e) => onToggle(task.id, e.target.checked)}
        style={{ marginTop: '4px', cursor: 'pointer' }}
      />
      
      <div style={{ flex: 1 }}>
        <h3
          style={{
            margin: '0 0 4px 0',
            fontSize: '16px',
            fontWeight: 500,
            textDecoration: task.completed ? 'line-through' : 'none',
            color: task.completed ? '#888' : '#333',
          }}
        >
          {task.title}
        </h3>
        
        {task.description && (
          <p
            style={{
              margin: '0',
              fontSize: '14px',
              color: task.completed ? '#999' : '#666',
            }}
          >
            {task.description}
          </p>
        )}
        
        <p
          style={{
            margin: '8px 0 0 0',
            fontSize: '12px',
            color: '#999',
          }}
        >
          Created: {new Date(task.createdAt).toLocaleString()}
        </p>
      </div>
      
      <button
        onClick={() => onDelete(task.id)}
        style={{
          padding: '6px 12px',
          backgroundColor: '#ff4444',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '14px',
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#cc0000')}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#ff4444')}
      >
        Delete
      </button>
    </div>
  );
}
