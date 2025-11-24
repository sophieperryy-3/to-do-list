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
        gap: '14px',
        padding: '18px',
        border: '2px solid #ecf0f1',
        borderRadius: '12px',
        backgroundColor: task.completed ? '#f8f9fa' : '#ffffff',
        transition: 'all 0.2s',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <input
        type="checkbox"
        checked={task.completed}
        onChange={(e) => onToggle(task.id, e.target.checked)}
        style={{ 
          marginTop: '4px', 
          cursor: 'pointer',
          width: '20px',
          height: '20px',
          accentColor: '#4CAF50',
        }}
      />
      
      <div style={{ flex: 1 }}>
        <h3
          style={{
            margin: '0 0 4px 0',
            fontSize: '17px',
            fontWeight: 600,
            textDecoration: task.completed ? 'line-through' : 'none',
            color: task.completed ? '#95a5a6' : '#2c3e50',
          }}
        >
          {task.title}
        </h3>
        
        {task.description && (
          <p
            style={{
              margin: '4px 0 0 0',
              fontSize: '14px',
              color: task.completed ? '#95a5a6' : '#7f8c8d',
            }}
          >
            {task.description}
          </p>
        )}
        
        {task.dueDate && (
          <p
            style={{
              margin: '8px 0 0 0',
              fontSize: '13px',
              color: new Date(task.dueDate) < new Date() && !task.completed ? '#e74c3c' : '#95a5a6',
              fontWeight: new Date(task.dueDate) < new Date() && !task.completed ? '600' : '400',
            }}
          >
            📅 Due: {new Date(task.dueDate).toLocaleDateString()}
            {new Date(task.dueDate) < new Date() && !task.completed && ' (Overdue!)'}
          </p>
        )}
      </div>
      
      <button
        onClick={() => onDelete(task.id)}
        style={{
          padding: '8px 16px',
          backgroundColor: '#e74c3c',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '600',
          transition: 'all 0.2s',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = '#c0392b';
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = '#e74c3c';
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        🗑️ Delete
      </button>
    </div>
  );
}
