import { apiRequest } from "./api";
import { getToken } from "./authService";

const USER_ID = 'user_id';

export async function getTasks(filters = {}) {
  const query = new URLSearchParams(filters).toString();
  return await apiRequest(`/tasks?${query}`, "GET", null, getToken());
}

export async function createTask(taskData) {
  return await apiRequest("/tasks", "POST", taskData, getToken());
}

export async function updateTask(taskId, taskData) {
  const payload = { ...(taskData || {}), userId: getUserId() };
  return await apiRequest(`/tasks/${taskId}`, "PATCH", payload, getToken());
}

export async function toggleComplete(taskId) {
  return await apiRequest(`/tasks/toggle/${taskId}`, "PATCH", null, getToken());
}

export async function toggleImportant(taskId) {
  return await apiRequest(`/tasks/toggle-important/${taskId}`, "PATCH", null, getToken());
}

export async function deleteTask(taskId) {
  return await apiRequest(`/tasks/${taskId}`, "DELETE", null, getToken());
}

export async function clearTasks() {
  return await apiRequest("/tasks/clear", "POST", null, getToken());
}

export function getUserId() {
  return localStorage.getItem(USER_ID);
}

export async function getStats() {
  return await apiRequest('/tasks/stats', 'GET', null, getToken());
}