import axios from "src/api/config";

export const getClients = (page, items, filter = null, sort = null) => {
  const filterQuery = filter
    ? `&where[${filter.column}_startsWith]=${filter.value}`
    : "";
  const sortQuery = sort
    ? `&sort=${sort.column}:${sort.value}`
    : "&sort=preferredName:ASC";
  return axios.get(
    `/client-profile?page=${
      page + 1
    }&pageSize=${items}${filterQuery}${sortQuery}`
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
