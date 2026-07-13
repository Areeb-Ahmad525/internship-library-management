import { getBooksApi, getBookApi, searchBooksApi } from '../api/books';

export const fetchAllBooks = async (signal) => {
  return await getBooksApi({ signal });
};

export const fetchBookById = async (id, signal) => {
  return await getBookApi(id, { signal });
};

export const findBooks = async (query, signal) => {
  return await searchBooksApi(query, { signal });
};
