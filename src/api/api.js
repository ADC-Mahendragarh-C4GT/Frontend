import axios from "axios";
import BASE_URL from "./config";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, 
});

// AUTH APIs
export const login = (email, password, user_type) => {
  return api.post("/accounts/login/", { email, password, user_type });
};

export const register = (data) => {
  return api.post("/accounts/register/", data);
};

export const logout = () => {
  return api.post("/accounts/logout/");
};

export const getProfile = () => {
  return api.get("/accounts/profile/");
};


export const getRoads = () => {
  return api.get("/api/roads/");
};

export const getContractors = () => {
  return api.get("/api/contractors/");
};

export const getInfraWorks = () => {
  return api.get("/api/infra-works/");
};

export const getUpdates = () => {
  return api.get("/api/updates/");
};

export const createRoad = (data) => {
  return api.post("/api/roads/", data);
};

export const updateRoad = (id, data) => {
  return api.put(`/api/roads/${id}/`, data);
};

export const deleteRoad = (id) => {
  return api.delete(`/api/roads/${id}/`);
};

export default api;
