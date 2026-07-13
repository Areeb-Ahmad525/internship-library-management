import {
  getLoansApi,
  borrowBookApi,
  returnBookApi,
  getActiveLoansApi,
  getMemberLoansApi,
  getBookLoansApi,
  deleteLoanApi,
} from '../api/loans';
import { toast } from 'react-hot-toast';

export const fetchAllLoans = async (signal) => {
  return await getLoansApi({ signal });
};

export const submitBorrow = async (payload, signal) => {
  return await borrowBookApi(payload, { signal });
};

export const submitReturn = async (loanId, signal) => {
  try {
    const res = await returnBookApi(loanId, { signal });
    toast.success('Book returned successfully!');
    return res;
  } catch (err) {
    toast.error('Failed to return book.');
    throw err;
  }
};

export const fetchActiveLoans = async (signal) => {
  return await getActiveLoansApi({ signal });
};

export const fetchMemberLoans = async (memberId, signal) => {
  return await getMemberLoansApi(memberId, { signal });
};

export const fetchBookLoans = async (bookId, signal) => {
  return await getBookLoansApi(bookId, { signal });
};

export const deleteLoan = async (loanId) => {
  try {
    await deleteLoanApi(loanId);
    toast.success('Loan deleted successfully!');
    return true;
  } catch (err) {
    toast.error('Failed to delete loan.');
    throw err;
  }
};
