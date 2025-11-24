/**
 * AddTaskForm Component
 * 
 * Form for creating new tasks.
 * Includes title (required) and description (optional).
 */

import { useState, FormEvent } from 'react';

interface AddTaskFormProps {
  onAdd: (title: string, description?: string) => void;
  isLoading: boolean;
}

export default function AddTaskForm({ onAdd, isLoading }: AddTaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (title.trim()) {
      onAdd(title.trim(), description.trim() || undefined);
      setTitle('');
      setDescription('');
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
      <h2 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#333' }}>
        Add New Task
      </h2>
      
      <input
        type="text"
        placeholder="Task title (required)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        disabled={isLoading}
        style={{
          padding: '10px',
          fontSize: '14px',
          border: '1px solid #ddd',
          borderRadius: '4px',
        }}
      />
      
      <textarea
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        disabled={isLoading}
        rows={3}
        style={{
          padding: '10px',
          fontSize: '14px',
          border: '1px solid #ddd',
          borderRadius: '4px',
          fontFamily: 'inherit',
          resize: 'vertical',
        }}
      />
      
      <button
        type="submit"
        disabled={isLoading || !title.trim()}
        style={{
          padding: '10px 20px',
          backgroundColor: title.trim() && !isLoading ? '#4CAF50' : '#ccc',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: title.trim() && !isLoading ? 'pointer' : 'not-allowed',
          fontSize: '14px',
          fontWeight: 500,
        }}
      >
        {isLoading ? 'Adding...' : 'Add Task'}
      </button>
    </form>
  );
}
