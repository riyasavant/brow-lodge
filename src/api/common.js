import axios from "./config";

export const getAllStaff = () => {
  return axios.get("/staff-profile?page=1&pageSize=10000&sort=firstName:ASC");
};

export const getAllClients = () => {
  return axios.get("/client-profile?page=1&pageSize=10000&sort=firstName:ASC");
};
