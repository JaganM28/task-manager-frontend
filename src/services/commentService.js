// Filepath: src/services/commentService.js
import api from './api';

const getCommentsForTask = (taskId) => {
    return api.get(`/tasks/${taskId}/comments`);
};

const addCommentToTask = (taskId, commentData) => {
    return api.post(`/tasks/${taskId}/comments`, commentData);
};

const commentService = {
    getCommentsForTask,
    addCommentToTask,
};

export default commentService;