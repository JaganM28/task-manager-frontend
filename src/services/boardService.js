// Filepath: src/services/boardService.js
import api from './api';

const getBoardsForWorkspace = (workspaceId) => {
  return api.get(`/workspaces/${workspaceId}/boards`);
};

const createBoard = (workspaceId, boardData) => {
    return api.post(`/workspaces/${workspaceId}/boards`, boardData);
};

const getBoardDetails = async (workspaceId, boardId) => {
    const response = await getBoardsForWorkspace(workspaceId);
    const boards = response.data;
    return boards.find(board => board.id === boardId);
};

const deleteBoard = (workspaceId, boardId) => api.delete(`/workspaces/${workspaceId}/boards/${boardId}`);

const boardService = {
  getBoardsForWorkspace,
  createBoard,
  getBoardDetails,
  deleteBoard
};

export default boardService;