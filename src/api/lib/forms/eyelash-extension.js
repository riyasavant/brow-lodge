import axios from "src/api/config";

export const getEyelashExtensionEntries = (page, items) => {
  return axios.get(`/eyelash-extension?page=${page + 1}&pageSize=${items}`);
};

export const createEyelashExtension = (payload) => {
  return axios.post(`/eyelash-extension`, payload);
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
