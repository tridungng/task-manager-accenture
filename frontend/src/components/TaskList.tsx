import React, {useEffect, useState} from 'react';
import type {Task} from '../types/task';
import * as taskApi from '../api/taskApi';
import TaskItem from './TaskItem';
import TaskForm from './TaskForm';
import './TaskManager.css';

const TaskList: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [editingTaskId, setEditingTaskId] = useState<number | null>(null);

    const loadTasks = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await taskApi.getTasks();
            setTasks(data);
        } catch (err) {
            setError('Failed to load tasks');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (taskData: Task) => {
        if (editingTaskId) {
            // update
            try {
                const updatedTask = await taskApi.updateTask(editingTaskId, {
                    title: taskData.title,
                    description: taskData.description ?? '',
                    status: taskData.status,
                    dueDate: taskData.dueDate ?? undefined,
                });
                setTasks(tasks.map(t => t.id === editingTaskId ? updatedTask : t));
                setEditingTaskId(null);
            } catch (err) {
                setError('Failed to update task');
                console.error(err);
            }
        } else {
            // create
            try {
                const createdTask = await taskApi.createTask({
                    title: taskData.title,
                    description: taskData.description ?? '',
                    status: taskData.status,
                    dueDate: taskData.dueDate ?? undefined,
                });
                setTasks([...tasks, createdTask]);
            } catch (err) {
                setError('Failed to create task');
                console.error(err);
            }
        }
    };

    const handleDeleteTask = async (id: number) => {
        try {
            await taskApi.deleteTask(id);
            setTasks(tasks.filter((t) => t.id !== id));
        } catch (err) {
            setError('Failed to delete task');
            console.error(err);
        }
    };

    useEffect(() => {
        loadTasks();
    }, []);

    if (loading) return <div className="loading-state">Loading tasks...</div>;
    if (error) return <div className="validation-error" style={{color: 'red'}}>{error}</div>;

    return (
        <div className="task-manager-container">
            <div className="task-manager-header">
                <h1 className="task-manager-title">Task Manager</h1>
                <p className="task-manager-subtitle">Stay organized and productive</p>
            </div>

            <div className="task-form">
                <TaskForm
                    task={editingTaskId ? tasks.find((t) => t.id === editingTaskId) : undefined}
                    onSave={handleSave}
                    onCancel={() => setEditingTaskId(null)}
                />
            </div>

            {tasks.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">📝</div>
                    <h2 className="empty-state-title">No tasks yet</h2>
                    <p className="empty-state-description">
                        Get started by creating your first task using the form above!
                    </p>
                </div>
            ) : (
                <div className="task-list">
                    {tasks.map((task) => (
                        <TaskItem
                            key={task.id}
                            task={task}
                            onUpdate={handleSave}
                            onDelete={handleDeleteTask}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default TaskList;