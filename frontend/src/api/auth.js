import client from './client';

export const loginApi = async (credentials) => {
  const response = await client.post('/auth/login', credentials);
  return response.data; // { access_token, token_type }
};

export const registerApi = async (userData) => {
  const response = await client.post('/auth/register', userData);
  return response.data;
};
