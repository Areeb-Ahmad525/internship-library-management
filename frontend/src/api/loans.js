import client from './client';

export const getLoansApi = async (config = {}) => {
  const response = await client.get('/loans/', config);
  return response.data;
};

export const getLoanApi = async (id, config = {}) => {
  const response = await client.get(`/loans/${id}`, config);
  return response.data;
};

export const borrowBookApi = async (payload, config = {}) => {
  const response = await client.post('/loans/borrow', payload, config);
  return response.data;
};

export const returnBookApi = async (loanId, config = {}) => {
  const response = await client.post(`/loans/return/${loanId}`, {}, config);
  return response.data;
};
