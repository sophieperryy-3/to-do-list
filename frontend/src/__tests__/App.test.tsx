/**
 * Frontend Unit Tests
 * 
 * Basic tests to demonstrate testing in CI pipeline.
 * In production, you'd have more comprehensive tests.
 */

import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach } from '@jest/globals';
import App from '../App';

// Mock the API client module
jest.mock('../api/client', () => ({
  createTask: jest.fn(),
  getAllTasks: jest.fn(),
  updateTask: jest.fn(),
  deleteTask: jest.fn(),
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock window.confirm
Object.defineProperty(window, 'confirm', {
  value: jest.fn(() => true),
});

describe('App Component Tests', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  it('should render the app title', () => {
    render(<App />);
    expect(screen.getByText(/Task Manager/)).toBeInTheDocument();
  });

  it('should render the add task form', () => {
    render(<App />);
    expect(screen.getByPlaceholderText('What needs to be done?')).toBeInTheDocument();
    expect(screen.getByText('✨ Add Task')).toBeInTheDocument();
  });

  it('should render without crashing', () => {
    render(<App />);
    // The app should render without crashing and show the basic structure
    expect(screen.getByText(/Task Manager/)).toBeInTheDocument();
  });
});

/**
 * Note: In a production application, you would test:
 * 
 * 1. Component rendering:
 *    - TaskList renders tasks correctly
 *    - AddTaskForm validates input
 *    - TaskItem displays task data
 * 
 * 2. User interactions:
 *    - Clicking checkbox toggles completion
 *    - Submitting form creates task
 *    - Delete button removes task
 * 
 * 3. API integration (with mocked fetch):
 *    - getAllTasks() called on mount
 *    - createTask() called on form submit
 *    - Error handling displays error messages
 * 
 * 4. Edge cases:
 *    - Empty task list
 *    - API errors
 *    - Loading states
 * 
 * For this DevOps demo, we focus on:
 * - Tests exist and run in CI
 * - Pipeline fails if tests fail
 * - Test results are visible in GitHub Actions
 */
