import React, { useState } from 'react';
import type { Task } from '../types/task';
import type { TaskStatus } from '../types/task';
import * as taskApi from '../api/taskApi';
import './TaskManager.css';

interface TaskItemProps {
  task: Task;
  onUpdate: (task: Task) => void;
  onDelete: (id: number) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState<Task>({ ...task });
  // Status is handled through the editedTask state directly

  const handleSave = async () => {
    try {
      const updatedTask = await taskApi.updateTask(task.id, {
        title: editedTask.title,
        description: editedTask.description ?? '',
        status: editedTask.status,
        dueDate: editedTask.dueDate ?? undefined,
      });
      setIsEditing(false);
      onUpdate(updatedTask);
    } catch (error) {
      // Error will be handled by the parent component
      throw error;
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedTask({ ...task });
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        onDelete(task.id);
      } catch (error) {
        // Error will be handled by the parent component
        throw error;
      }
    }
  };

  return (
    <div className="task-card">
      {isEditing ? (
        <>
          <div className="task-form-group">
            <label className="task-form-label">Title:</label>
            <input
              className="task-form-input"
              value={editedTask.title}
              onChange={(e) => setEditedTask((prev) => ({ ...prev, title: e.target.value }))}
              required
              maxLength={100}
            />
          </div>
          <div className="task-form-group">
            <label className="task-form-label">Description:</label>
            <textarea
              className="task-form-textarea"
              value={editedTask.description ?? ''}
              onChange={(e) => setEditedTask((prev) => ({ ...prev, description: e.target.value || undefined }))}
              maxLength={500}
            />
          </div>
          <div className="task-form-group">
            <label className="task-form-label">Status:</label>
            <select
              className="task-form-select"
              value={editedTask.status}
              onChange={(e) => setEditedTask((prev) => ({ ...prev, status: e.target.value as TaskStatus }))}
            >
              <option value="TODO">TODO</option>
              <option value="IN_PROGRESS">IN PROGRESS</option>
              <option value="DONE">DONE</option>
            </select>
          </div>
          <div className="task-form-group">
            <label className="task-form-label">Due Date:</label>
            <input
              className="task-form-input"
              type="date"
              value={editedTask.dueDate ?? ''}
              onChange={(e) => setEditedTask((prev) => ({ ...prev, dueDate: e.target.value || undefined }))}
            />
          </div>
          <div className="task-form-actions">
            <button className="btn btn-sm btn-outline" onClick={handleSave}>
              Save
            </button>
            <button className="btn btn-sm btn-outline" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="task-header">
            <h3 className="task-title">{task.title}</h3>
            <div className="task-actions">
              <button
                className="btn btn-sm btn-outline"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </button>
              <button
                className="btn btn-sm btn-outline"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>

          {task.description && (
            <p className="task-description">{task.description}</p>
          )}

          <div className="task-meta">
            <span className={`task-status-badge task-status-${task.status.toLowerCase().replace('_', '-')}`}>
              {task.status.replace('_', ' ')}
            </span>
            {task.dueDate && (
              <span className="task-due-date">
                📅 {new Date(task.dueDate).toLocaleDateString()}
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default TaskItem;