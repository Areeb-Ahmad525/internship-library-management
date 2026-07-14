import {
  getMembersApi,
  getMemberApi,
  createMemberApi,
  updateMemberApi,
  deleteMemberApi,
} from '../api/members';

export const fetchAllMembers = async (signal) => {
  return await getMembersApi({ signal });
};

export const fetchMember = async (id, signal) => {
  return await getMemberApi(id, { signal });
};

export const submitCreateMember = async (payload, signal) => {
  return await createMemberApi(payload, { signal });
};

export const submitUpdateMember = async (id, payload, signal) => {
  return await updateMemberApi(id, payload, { signal });
};

export const submitDeleteMember = async (id, signal) => {
  return await deleteMemberApi(id, { signal });
};
