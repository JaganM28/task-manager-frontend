// Filepath: src/services/taskService.js
import api from './api';

const createTask = (boardId, taskData) => {
  return api.post(`/tasks/board/${boardId}`, taskData);
};

const updateTaskStatus = (taskId, status) => {
  return api.patch(`/tasks/${taskId}/status`, { status });
};


const moveTask = (taskId, newBoardId) => {
  return api.patch(`/tasks/${taskId}/move`, { newBoardId });
};

const getTasksForBoard = (boardId) => {
  return api.get(`/workspaces/0/boards/${boardId}/tasks`); 
};

const deleteTask = (taskId) => api.delete(`/tasks/${taskId}`);

const taskService = {
  createTask,
  updateTaskStatus,
  moveTask,
  getTasksForBoard, 
  deleteTask
};

export default taskService;