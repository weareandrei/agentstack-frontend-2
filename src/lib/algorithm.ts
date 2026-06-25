import api from '@/lib/api'

const ALGORITHM = {
  createAccount: (email: string, password: string) =>
    api.post('/account/create', { email, password }),
  login: (email: string, password: string) =>
    api.post('/account/login', { email, password }),
  createProject: (name: string) => api.post('/projects', { name }),
  renameProject: (projectId: string, name: string) =>
    api.patch(`/projects/${projectId}`, { name }),
  deleteProject: (projectId: string) => api.delete(`/projects/${projectId}`),
  rotateProjectToken: (projectId: string) =>
    api.post(`/projects/${projectId}/rotate_token`),
  listProjects: () => api.get('/projects'),
  getAccountApiKey: () => api.get('/account/api_key'),
  rotateAccountApiKey: () => api.post('/account/api_key/rotate'),
  getLogs: (
    projectId: string,
    params?: { from?: string; to?: string; limit?: string },
  ) => api.get(`/projects/${projectId}/logs`, params),
}

export default ALGORITHM
