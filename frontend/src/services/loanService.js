import { getLoansApi, borrowBookApi, returnBookApi } from '../api/loans';

export const fetchAllLoans = async (signal) => {
  return await getLoansApi({ signal });
};

export const submitBorrow = async (payload, signal) => {
  return await borrowBookApi(payload, { signal });
};

export const submitReturn = async (loanId, signal) => {
  return await returnBookApi(loanId, { signal });
};
