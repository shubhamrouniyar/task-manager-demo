import { useCallback, useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { API_URL, createTask, deleteTask, fetchTasks, toggleTask } from './api';
import type { Task } from './types';
import './App.css';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

  const loadTasks = useCallback(async () => {
    setError(null);
    try {
      const data = await fetchTasks();
      setTasks(
        [...data].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        ),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadTasks();
  }, [loadTasks]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;

    setError(null);
    try {
      const task = await createTask(trimmed);
      setTasks((prev) => [task, ...prev]);
      setTitle('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task');
    }
  }

  async function handleToggle(id: number) {
    setBusyId(id);
    setError(null);
    try {
      const updated = await toggleTask(id);
      setTasks((prev) => prev.map((task) => (task.id === id ? updated : task)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle task');
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(id: number) {
    setBusyId(id);
    setError(null);
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task');
    } finally {
      setBusyId(null);
    }
  }

  const remaining = tasks.filter((task) => !task.completed).length;

  return (
    <div className="page">
      <header className="header">
        <h1>Task Manager</h1>
        <p className="subtitle">Simple Java + React demo</p>
        <p className="api-hint">API: {API_URL}</p>
      </header>

      <form className="add-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="What needs to be done?"
          aria-label="New task title"
        />
        <button type="submit" disabled={!title.trim()}>
          Add
        </button>
      </form>

      {error && <div className="error">{error}</div>}
      {loading && <p className="muted">Loading tasks…</p>}

      {!loading && tasks.length === 0 && !error && (
        <p className="muted">No tasks yet. Add one above.</p>
      )}

      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task.id} className={task.completed ? 'task completed' : 'task'}>
            <label>
              <input
                type="checkbox"
                checked={task.completed}
                disabled={busyId === task.id}
                onChange={() => void handleToggle(task.id)}
              />
              <span>{task.title}</span>
            </label>
            <button
              type="button"
              className="delete"
              disabled={busyId === task.id}
              onClick={() => void handleDelete(task.id)}
              aria-label={`Delete ${task.title}`}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {tasks.length > 0 && (
        <footer className="footer">
          {remaining} item{remaining === 1 ? '' : 's'} left
        </footer>
      )}
    </div>
  );
}

export default App;
