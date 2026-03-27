import { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";
import { getTasks, createTask, deleteTask, toggleTaskStatus } from "../services/taskService";
import TaskCard from "../components/TaskCard";
import { updateTask } from "../services/taskService";

function TasksPage() {
  const { user, logout } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState("medium");
  const [error, setError] = useState("");
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getTasks();
        setTasks(data);
      } catch (err) {
        setError(err.message);
      }
    }
    load();
  }, []);

  async function handleAdd(e) {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const newTask = await createTask(
        title,
        description,
        deadline,
        priority
      );

      setTasks((prev) => [newTask, ...prev]);
      setTitle("");
      setDescription("");
      setDeadline("");
      setPriority("medium");
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleToggle(id) {
    try {
      const updatedTask = await toggleTaskStatus(id);

      setTasks((prev) =>
        prev.map((task) =>
          task.id === id ? updatedTask : task
        )
      );
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleUpdate(updatedTask) {
    try {
      const updated = await updateTask(updatedTask.id, updatedTask);

      setTasks((prev) =>
        prev.map((t) => (t.id === updated.id ? updated : t))
      );

      setEditingTask(null);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="w-full max-w-5xl mx-auto mt-10 space-y-6">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-white">Tasks</h2>
          <p className="text-sm text-white/70">
            Logged in as {user?.email}
          </p>
        </div>

        <button
          onClick={logout}
          className="bg-rose-400 px-3 py-1 rounded text-sm"
        >
          Logout
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleAdd} className="space-y-3 bg-white/10 p-4 rounded-xl">

        <input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 rounded text-black"
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 rounded text-black"
        />

        <div className="flex items-center gap-3">
          <p className="text-white whitespace-nowrap">
            Select Deadline :
          </p>
          <input 
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="flex-1 p-2 rounded text-black"
          />
        </div>

        <di className="flex items-center gap-3">
          <p className="text-white whitespace-nowrap">
            Select Priority &nbsp;&nbsp;&nbsp;:
          </p>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full p-2 rounded text-black"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </di>

        <button className="bg-emerald-600 px-4 py-2 rounded text-white">
          Add Task
        </button>
      </form>

      {editingTask && (
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-lg space-y-4">

          <h3 className="text-white text-lg font-semibold">
            Edit Task
          </h3>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdate(editingTask);
            }}
            className="space-y-4"
          >

            {/* Title */}
            <input
              type="text"
              placeholder="Task Title"
              value={editingTask.title}
              onChange={(e) =>
                setEditingTask({ ...editingTask, title: e.target.value })
              }
              className="w-full rounded-md px-3 py-2 text-black border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Description */}
            <textarea
              placeholder="Description"
              value={editingTask.description}
              onChange={(e) =>
                setEditingTask({
                  ...editingTask,
                  description: e.target.value,
                })
              }
              className="w-full rounded-md px-3 py-2 text-black border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Deadline */}
            <input
              type="date"
              value={editingTask.deadline || ""}
              onChange={(e) =>
                setEditingTask({
                  ...editingTask,
                  deadline: e.target.value,
                })
              }
              className="w-full rounded-md px-3 py-2 text-black border border-slate-300"
            />

            {/* Priority */}
            <select
              value={editingTask.priority}
              onChange={(e) =>
                setEditingTask({
                  ...editingTask,
                  priority: e.target.value,
                })
              }
              className="w-full rounded-md px-3 py-2 text-black border border-slate-300"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>

            {/* Buttons */}
            <div className="flex justify-end gap-3">

              <button
                type="button"
                onClick={() => setEditingTask(null)}
                className="px-4 py-2 rounded-md bg-gray-400 text-white hover:bg-gray-500"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-4 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700"
              >
                Save Changes
              </button>

            </div>
          </form>
        </div>
      )}

      {/* Error */}
      {error && <p className="text-red-400">{error}</p>}

      {/* Tasks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tasks.map((task) => (
          <TaskCard
            task={task}
            onDelete={handleDelete}
            onToggle={handleToggle}
            onEdit={setEditingTask}
          />
        ))}
      </div>

    </div>
  );
}

export default TasksPage;