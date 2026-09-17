import React, { useState } from 'react';
import type { Task, TaskStatus } from '../types/task';
import './TaskManager.css';

interface TaskFormProps {
  task?: Task; // if provided, we are editing
  onSave: (task: Task) => void;
  onCancel: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ task, onSave, onCancel }) => {
  const [title, setTitle] = useState(task?.title ?? '');
  const [description, setDescription] = useState(task?.description ?? '');
  const [status, setStatus] = useState<TaskStatus>(task?.status ?? 'TODO');
  const [dueDate, setDueDate] = useState(task?.dueDate ?? '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.length > 100) {
      newErrors.title = 'Title must be 100 characters or less';
    }
    if (description.length > 500) {
      newErrors.description = 'Description must be 500 characters or less';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      const taskData: Task = {
        id: task?.id ?? 0, // id will be ignored by backend for create
        title,
        description: description || undefined,
        status,
        dueDate: dueDate || undefined,
      };
      onSave(taskData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <h2>{task ? 'Edit Task' : 'Add Task'}</h2>

      <div className="task-form-group">
        <label className="task-form-label" htmlFor="title">Title:</label>
        <input
          className="task-form-input"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          maxLength={100}
        />
        {errors.title && <span className="validation-error">{errors.title}</span>}
      </div>

      <div className="task-form-group">
        <label className="task-form-label" htmlFor="description">Description:</label>
        <textarea
          className="task-form-textarea"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={500}
        />
        {errors.description && <span className="validation-error">{errors.description}</span>}
      </div>

      <div className="task-form-group">
        <label className="task-form-label" htmlFor="status">Status:</label>
        <select
          className="task-form-select"
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value as TaskStatus)}
        >
          <option value="TODO">TODO</option>
          <option value="IN_PROGRESS">IN PROGRESS</option>
          <option value="DONE">DONE</option>
        </select>
      </div>

      <div className="task-form-group">
        <label className="task-form-label" htmlFor="dueDate">Due Date:</label>
        <input
          className="task-form-input"
          type="date"
          id="dueDate"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>

      <div className="task-form-actions">
        <button type="submit" className="btn btn-primary">
          {task ? 'Update' : 'Create'}
        </button>
        <button type="button" className="btn btn-outline" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default TaskForm;