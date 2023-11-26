import axios from "src/api/config";

export const getEyelashExtensionEntries = (
  page,
  items,
  sort = null,
  filter = null
) => {
  const filterQuery = filter
    ? `&where[${filter.column}_contains]=${filter.value}`
    : "";
  const sortQuery = sort
    ? `&sort=${sort.column}:${sort.value}`
    : "&sort=date:DESC";
  return axios.get(
    `/eyelash-extension?page=${
      page + 1
    }&pageSize=${items}${sortQuery}${filterQuery}`
  );
};

export const createEyelashExtension = (payload) => {
  return axios.post(`/eyelash-extension`, payload);
};

export const getEyelashExtensionById = (id) => {
  return axios.get(`/eyelash-extension/${id}`);
};

export const deleteEyelashExtensionForm = (id) => {
  return axios.delete(`/eyelash-extension/${id}`);
};

export const updateEyelashExtensionForm = (id, payload) => {
  return axios.put(`/eyelash-extension/${id}`, payload);
};
