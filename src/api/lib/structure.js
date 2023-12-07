import axios from "src/api/config";

const DATE_COLUMNS = ["date", "dateOfBirth"];

const useApiStructure = (endpoint) => {
  const getAll = (page, items, sort = null, filter = null) => {
    const filterQuery = filter
      ? `&where[${filter.column}_${
          DATE_COLUMNS.includes(filter.column) ? "eq" : "contains"
        }]=${filter.value}`
      : "";
    const sortQuery = sort ? `&sort=${sort.column}:${sort.value}` : "";
    return axios.get(
      `${endpoint}?page=${page + 1}&pageSize=${items}${sortQuery}${filterQuery}`
    );
  };

  const create = (payload) => {
    return axios.post(endpoint, payload);
  };

  const getById = (id) => {
    return axios.get(`${endpoint}/${id}`);
  };

  const deleteEntry = (id) => {
    return axios.delete(`${endpoint}/${id}`);
  };

  const update = (id, payload) => {
    return axios.put(`${endpoint}/${id}`, payload);
  };

  const getAllDetails = (
    id,
    columnId,
    page,
    items,
    sort = null,
    filter = null
  ) => {
    const filterQuery = filter
      ? `&where[${filter.column}_${
          DATE_COLUMNS.includes(filter.column) ? "eq" : "contains"
        }]=${filter.value}`
      : "";
    const sortQuery = sort
      ? `&sort=${sort.column}:${sort.value}`
      : "&sort=date:DESC";
    return axios.get(
      `${endpoint}?page=${
        page + 1
      }&pageSize=${items}&where[${columnId}.id_eq]=${id}${filterQuery}${sortQuery}`
    );
  };

  return {
    getAll,
    getById,
    update,
    deleteEntry,
    create,
    getAllDetails,
  };
};

export default useApiStructure;
