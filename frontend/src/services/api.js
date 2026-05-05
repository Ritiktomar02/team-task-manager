import axios from "axios";

// In production the frontend is served by the same Express server, so calls
// go to /api on the same origin. In dev, VITE_BASE_URL points at the backend.
const BASE_URL = `${import.meta.env.VITE_BASE_URL || ""}/api`;

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export const AUTH = {
  REGISTER: "/user/register",
  LOGIN: "/user/login",
  LOGOUT: "/user/logout",
  PROFILE: "/user/profile",
  SEARCH: "/user/search",
};

export const PROJECT = {
  LIST: "/projects",
  CREATE: "/projects",
  GET: (id) => `/projects/${id}`,
  UPDATE: (id) => `/projects/${id}`,
  DELETE: (id) => `/projects/${id}`,
  ADD_MEMBER: (id) => `/projects/${id}/members`,
  REMOVE_MEMBER: (id, userId) => `/projects/${id}/members/${userId}`,
  UPDATE_ROLE: (id, userId) => `/projects/${id}/members/${userId}/role`,
};

export const TASK = {
  CREATE: "/tasks",
  BY_PROJECT: (projectId) => `/tasks/project/${projectId}`,
  UPDATE: (taskId) => `/tasks/${taskId}`,
  DELETE: (taskId) => `/tasks/${taskId}`,
  DASHBOARD: "/tasks/dashboard",
};
