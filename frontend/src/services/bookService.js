import {
  getBooksApi,
  getBookApi,
  searchBooksApi,
  createBookApi,
  updateBookApi,
  deleteBookApi,
} from '../api/books';
import { toast } from 'react-hot-toast';

export const fetchAllBooks = async (signal) => {
  return await getBooksApi({ signal });
};

export const fetchBookById = async (id, signal) => {
  return await getBookApi(id, { signal });
};

export const findBooks = async (query, signal) => {
  return await searchBooksApi(query, { signal });
};

export const createBook = async (data) => {
  try {
    const newBook = await createBookApi(data);
    toast.success('Book created successfully!');
    return newBook;
  } catch (error) {
    if (error.response && error.response.status === 409) {
      toast.error(error.response.data.detail || 'Book already exists.');
    } else {
      toast.error('Failed to create book. Please check the form.');
    }
    throw error;
  }
};

export const updateBook = async (id, data) => {
  try {
    const updatedBook = await updateBookApi(id, data);
    toast.success('Book updated successfully!');
    return updatedBook;
  } catch (error) {
    if (error.response && error.response.status === 409) {
      toast.error(error.response.data.detail || 'Conflict while updating book.');
    } else {
      toast.error('Failed to update book.');
    }
    throw error;
  }
};

export const deleteBook = async (id) => {
  try {
    await deleteBookApi(id);
    toast.success('Book deleted successfully!');
    return true;
  } catch (error) {
    toast.error('Failed to delete book.');
    throw error;
  }
};
