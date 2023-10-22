import axios from "../config";

export const getStaffProfiles = (page, items) => {
  return axios.get(
    `/staff-profile?sort=preferredName:ASC&page=${page + 1}&pageSize=${items}`
  );
};

export const getStaffProfileById = (id) => {
  return axios.get(`/staff-profile/${id}`);
};

export const createStaff = (payload) => {
  return axios.post("/staff-profile", payload);
};

export const deleteStaff = (id) => {
  return axios.delete(`/staff-profile/${id}`);
};

export const updateStaff = (id, payload) => {
  return axios.put(`/staff-profile/${id}`, payload);
};
