import { ACCESS_TOKEN_KEY } from './constants';

export const setToken = (token) => localStorage.setItem(ACCESS_TOKEN_KEY, token);

export const getToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);

export const removeToken = () => localStorage.removeItem(ACCESS_TOKEN_KEY);
