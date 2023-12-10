import Axios from "axios";

const baseURL =
  process.env.NODE_ENV === "production" ? "/api" : "http://localhost:9000/api";

const axios = Axios.create({
  baseURL,
});

// request interceptor to add token to request headers
axios.interceptors.request.use(
  async (config) => {
    let jwt;

    jwt = window.localStorage.getItem("auth-token");
    if (!jwt) {
      jwt = window.sessionStorage.getItem("auth-token");
    }

    if (jwt) {
      config.headers = {
        Authorization: `Bearer ${jwt}`,
      };
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Catch the UnAuthorized Request
 */
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (
      (error?.response?.status === 401 &&
        window.location.pathname !== "/auth/login") ||
      (error?.response?.status === 404 &&
        error?.response?.message === "User not found!")
    ) {
      window.localStorage.clear();
      window.sessionStorage.clear();
      window.location = "/auth/login";
    }
    return Promise.reject(error);
  }
);

export default axios;
