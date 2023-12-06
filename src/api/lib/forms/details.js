import axios from "src/api/config";

export const getEyelashExtensionDetails = (
  page,
  items,
  id,
  sort = null,
  filter = null
) => {
  const filterQuery = filter
    ? `&where[${filter.column}_${
        filter.column === "date" ? "eq" : "contains"
      }]=${filter.value}`
    : "";
  const sortQuery = sort
    ? `&sort=${sort.column}:${sort.value}`
    : "&sort=date:DESC";
  return axios.get(
    `/eyelash-extension-details?page=${
      page + 1
    }&pageSize=${items}&where[Eyelash.id_eq]=${id}${filterQuery}${sortQuery}`
  );
};

export const createEyelashExtensionDetail = (payload) => {
  return axios.post(`/eyelash-extension-details`, payload);
};

export const getEyelashExtensionDetailById = (id) => {
  return axios.get(`/eyelash-extension-details/${id}`);
};

export const deleteEyelashExtensionDetail = (id) => {
  return axios.delete(`/eyelash-extension-details/${id}`);
};

export const updateEyelashExtensionDetail = (id, payload) => {
  return axios.put(`/eyelash-extension-details/${id}`, payload);
};
