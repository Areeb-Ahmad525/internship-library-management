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
