import { getUsersApi, getUserByIdApi, getUserApi, updateUserRoleApi } from '../api/users';

export const fetchAllUsers = async (signal) => {
  return await getUsersApi({ signal });
};

export const fetchUserById = async (userId, signal) => {
  return await getUserByIdApi(userId, { signal });
};

export const fetchUser = async (id, signal) => {
  return await getUserApi(id, { signal });
};

export const submitUpdateUserRole = async (id, role, signal) => {
  return await updateUserRoleApi(id, role, { signal });
};
