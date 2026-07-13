import client from './client';

export const getUsersApi = async (config = {}) => {
  const response = await client.get('/users/', config);
  return response.data;
};

export const getUserApi = async (id, config = {}) => {
  const response = await client.get(`/users/${id}`, config);
  return response.data;
};

export const updateUserRoleApi = async (id, role, config = {}) => {
  const response = await client.patch(`/users/${id}/role`, { role }, config);
  return response.data;
};
