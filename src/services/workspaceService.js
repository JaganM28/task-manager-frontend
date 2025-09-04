// Filepath: src/services/workspaceService.js
import api from './api';

const getMyWorkspaces = () => {
  return api.get('/workspaces/my');
};

const createWorkspace = (workspaceData) => {
  return api.post('/workspaces', workspaceData);
};

const deleteWorkspace = (workspaceId) => {
    return api.delete(`/workspaces/${workspaceId}`);
};

const workspaceService = {
  getMyWorkspaces,
  createWorkspace,
  deleteWorkspace,
};

export default workspaceService;