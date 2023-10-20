import axios from "../config";

export const getUserProfile = (jwt) => {
  return axios.get("/user/me", {
    headers: { Authorization: `Bearer ${jwt}` },
  });
};

export const getUserById = (jwt, userId) => {
  return axios.get(`/user/${userId}`, {
    headers: { Authorization: `Bearer ${jwt}` },
  });
};

export const doLogin = (email, password) => {
  return axios.post("/user/login", {
    email,
    password,
  });
};
