import client from './client';

export const getMembersApi = async (config = {}) => {
  const response = await client.get('/members/', config);
  return response.data;
};

export const getMemberApi = async (id, config = {}) => {
  const response = await client.get(`/members/${id}`, config);
  return response.data;
};

export const createMemberApi = async (payload, config = {}) => {
  const response = await client.post('/members/', payload, config);
  return response.data;
};

export const updateMemberApi = async (id, payload, config = {}) => {
  const response = await client.put(`/members/${id}`, payload, config);
  return response.data;
};

export const deleteMemberApi = async (id, config = {}) => {
  const response = await client.delete(`/members/${id}`, config);
  return response.data;
};
