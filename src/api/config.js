import Axios from "axios";

const baseURL = "http://localhost:9000/api";

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
    console.log(error);
    if (
      error?.response?.status === 401 &&
      window.location.pathname !== "/auth/login"
    ) {
      window.localStorage.clear();
      window.sessionStorage.clear();
      window.location = "/auth/login";
    }
    return Promise.reject(error);
  }
);

export default axios;