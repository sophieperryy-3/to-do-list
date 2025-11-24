/**
 * AddTaskForm Component
 * 
 * Form for creating new tasks.
 * Includes title (required) and description (optional).
 */

import { useState, FormEvent } from 'react';

interface AddTaskFormProps {
  onAdd: (title: string, description?: string, dueDate?: string) => void;
  isLoading: boolean;
}

export default function AddTaskForm({ onAdd, isLoading }: AddTaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (title.trim()) {
      onAdd(title.trim(), description.trim() || undefined, dueDate || undefined);
      setTitle('');
      setDescription('');
      setDueDate('');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        padding: '20px',
        border: '2px solid #4CAF50',
        borderRadius: '8px',
        backgroundColor: '#f9f9f9',
      }}
    >
      <h2 style={{ margin: '0 0 12px 0', fontSize: '20px', color: '#2c3e50', fontWeight: '600' }}>
        ➕ Add New Task
      </h2>
      
      <input
        type="text"
        placeholder="What needs to be done?"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        disabled={isLoading}
        style={{
          padding: '12px',
          fontSize: '15px',
          border: '2px solid #e0e0e0',
          borderRadius: '8px',
          outline: 'none',
          transition: 'border-color 0.2s',
        }}
        onFocus={(e) => e.target.style.borderColor = '#4CAF50'}
        onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
      />
      
      <textarea
        placeholder="Add details (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        disabled={isLoading}
        rows={2}
        style={{
          padding: '12px',
          fontSize: '14px',
          border: '2px solid #e0e0e0',
          borderRadius: '8px',
          fontFamily: 'inherit',
          resize: 'vertical',
          outline: 'none',
          transition: 'border-color 0.2s',
        }}
        onFocus={(e) => e.target.style.borderColor = '#4CAF50'}
        onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
      />
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <label style={{ fontSize: '13px', color: '#7f8c8d', fontWeight: '500' }}>
          📅 Due Date (optional)
        </label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          disabled={isLoading}
          style={{
            padding: '12px',
            fontSize: '14px',
            border: '2px solid #e0e0e0',
            borderRadius: '8px',
            outline: 'none',
            transition: 'border-color 0.2s',
          }}
          onFocus={(e) => e.target.style.borderColor = '#4CAF50'}
          onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
        />
      </div>
      
      <button
        type="submit"
        disabled={isLoading || !title.trim()}
        style={{
          padding: '14px 24px',
          backgroundColor: title.trim() && !isLoading ? '#4CAF50' : '#bdc3c7',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: title.trim() && !isLoading ? 'pointer' : 'not-allowed',
          fontSize: '16px',
          fontWeight: 600,
          transition: 'all 0.2s',
          boxShadow: title.trim() && !isLoading ? '0 2px 8px rgba(76, 175, 80, 0.3)' : 'none',
        }}
        onMouseOver={(e) => {
          if (title.trim() && !isLoading) {
            e.currentTarget.style.backgroundColor = '#45a049';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }
        }}
        onMouseOut={(e) => {
          if (title.trim() && !isLoading) {
            e.currentTarget.style.backgroundColor = '#4CAF50';
            e.currentTarget.style.transform = 'translateY(0)';
          }
        }}
      >
        {isLoading ? '⏳ Adding...' : '✨ Add Task'}
      </button>
    </form>
  );
}
