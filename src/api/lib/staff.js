import axios from "../config";

export const getStaffProfiles = () => {
  return axios.get("/staff-profile?sort=preferredName:ASC");
};

export const getStaffProfileById = (id) => {
  return axios.get(`/staff-profile/${id}`);
};
