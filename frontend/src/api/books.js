import client from './client';

export const getBooksApi = async (config = {}) => {
  const response = await client.get('/books/', config);
  return response.data;
};

export const getBookApi = async (id, config = {}) => {
  const response = await client.get(`/books/${id}`, config);
  return response.data;
};

export const searchBooksApi = async (query, config = {}) => {
  const response = await client.get(`/books/search?query=${encodeURIComponent(query)}`, config);
  return response.data;
};

export const createBookApi = async (data) => {
  const response = await client.post('/books/', data);
  return response.data;
};

export const updateBookApi = async (id, data) => {
  const response = await client.put(`/books/${id}`, data);
  return response.data;
};

export const deleteBookApi = async (id) => {
  const response = await client.delete(`/books/${id}`);
  return response.data;
};
