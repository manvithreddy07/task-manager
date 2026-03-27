import {API_URL} from "../api.js";

function getAuthHeader() {
  const token = localStorage.getItem("token");
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

export async function getTasks() {
  const res = await fetch(`${API_URL}/tasks`, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
  });

  if (!res.ok) throw new Error("Failed to load tasks");
  return res.json();
}

export async function createTask(title, description, deadline, priority) {
  const res = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify({ title, description, deadline, priority }),
  });

  if (!res.ok) throw new Error("Failed to create task");
  return res.json();
}

export async function deleteTask(id) {
  const res = await fetch(`${API_URL}/tasks/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
  });

  if (!res.ok) throw new Error("Failed to delete task");
}

export async function toggleTaskStatus(id) {
  const res = await fetch(`${API_URL}/tasks/${id}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
  });

  if (!res.ok) throw new Error("Failed to update status");
  return res.json();
}

export async function updateTask(id, updatedData) {
  const res = await fetch(`${API_URL}/tasks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(updatedData),
  });

  if (!res.ok) throw new Error("Failed to update task");
  return res.json();
}