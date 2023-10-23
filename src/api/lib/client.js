import axios from "src/api/config";

export const getClients = (page, items) => {
  return axios.get(
    `/client-profile?sort=preferredName:ASC&page=${page + 1}&pageSize=${items}`
  );
};

export const getClientProfileById = (id) => {
  return axios.get(`/client-profile/${id}`);
};

export const createClient = (payload) => {
  return axios.post("/client-profile", payload);
};

export const deleteClient = (id) => {
  return axios.delete(`/client-profile/${id}`);
};

export const updateClient = (id, payload) => {
  return axios.put(`/client-profile/${id}`, payload);
};