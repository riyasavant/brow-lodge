import axios from "../config";

export const getStaffProfiles = (page, items, sort = null, filter = null) => {
  const filterQuery = filter
    ? `&where[${filter.column}_contains]=${filter.value}`
    : "";
  const sortQuery = sort
    ? `&sort=${sort.column}:${sort.value}`
    : "&sort=preferredName:ASC";
  return axios.get(
    `/staff-profile?page=${
      page + 1
    }&pageSize=${items}${sortQuery}${filterQuery}`
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
