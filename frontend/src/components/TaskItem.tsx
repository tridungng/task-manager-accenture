import React, { useState } from 'react';
import type { Task } from '../types/task';
import type { TaskStatus } from '../types/task';
import * as taskApi from '../api/taskApi';

interface TaskItemProps {
  task: Task;
  onUpdate: (task: Task) => void;
  onDelete: (id: number) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState<Task>({ ...task });
  const [status, setStatus] = useState<TaskStatus>(task.status);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as TaskStatus;
    setStatus(newStatus);
    setEditedTask((prev) => ({ ...prev, status: newStatus }));
  };

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
      alert('Failed to update task');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedTask({ ...task });
    setStatus(task.status);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskApi.deleteTask(task.id);
        onDelete(task.id);
      } catch (error) {
        alert('Failed to delete task');
      }
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
      {isEditing ? (
        <>
          <div>
            <label>Title:</label>
            <input
              value={editedTask.title}
              onChange={(e) => setEditedTask((prev) => ({ ...prev, title: e.target.value }))}
            />
          </div>
          <div>
            <label>Description:</label>
            <textarea
              value={editedTask.description ?? ''}
              onChange={(e) => setEditedTask((prev) => ({ ...prev, description: e.target.value || undefined }))}
            />
          </div>
          <div>
            <label>Status:</label>
            <select
              value={editedTask.status}
              onChange={(e) => setEditedTask((prev) => ({ ...prev, status: e.target.value as TaskStatus }))}
            >
              <option value="TODO">TODO</option>
              <option value="IN_PROGRESS">IN PROGRESS</option>
              <option value="DONE">DONE</option>
            </select>
          </div>
          <div>
            <label>Due Date:</label>
            <input
              type="date"
              value={editedTask.dueDate ?? ''}
              onChange={(e) => setEditedTask((prev) => ({ ...prev, dueDate: e.target.value || undefined }))}
            />
          </div>
          <div>
            <button onClick={handleSave}>Save</button>
            <button onClick={handleCancel} style={{ marginLeft: '10px' }}>
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <div>
            <strong>Title:</strong> {task.title}
          </div>
          <div>
            <strong>Description:</strong> {task.description ?? ''}
          </div>
          <div>
            <strong>Status:</strong>
            <select value={status} onChange={handleStatusChange}>
              <option value="TODO">TODO</option>
              <option value="IN_PROGRESS">IN PROGRESS</option>
              <option value="DONE">DONE</option>
            </select>
          </div>
          <div>
            <strong>Due Date:</strong> {task.dueDate ?? ''}
          </div>
          <div>
            <button onClick={() => setIsEditing(true)}>Edit</button>
            <button onClick={handleDelete} style={{ marginLeft: '10px' }}>
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TaskItem;