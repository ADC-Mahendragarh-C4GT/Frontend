import axios from "axios";
import BASE_URL from "./config";

// Initialize axios instance
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Define types
export interface UserType {
  value: string;
  label: string;
}

export interface LoginResponse {
  message: string;
  token?: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  user_type: string;
  phone_number?: string;
}

export interface Profile {
  id: number;
  username: string;
  email: string;
  user_type: string;
  phone_number?: string;
}

export interface Road {
  id: number;
  name: string;
  [key: string]: any;
}

export interface Contractor {
  id: number;
  name: string;
  [key: string]: any;
}

export interface InfraWork {
  id: number;
  name: string;
  [key: string]: any;
}

export interface Update {
  id: number;
  message: string;
  [key: string]: any;
}

// API calls

// Auth & User
export const fetchUserTypes = () => api.get<UserType[]>("/accounts/user-types/");

export const login = (email: string, password: string, userType: string) => {
  return api.post<LoginResponse>("/accounts/login/", { email, password, user_type: userType });
};

export const register = (data: RegisterData) => {
  return api.post<{ message: string }>("/accounts/register/", data);
};

export const logout = () => {
  return api.post<{ message: string }>("/accounts/logout/");
};

export const getProfile = () => {
  return api.get<Profile>("/accounts/profile/");
};

// Roads, Contractors, InfraWorks, Updates
export const getRoads = () => api.get<Road[]>("/api/roads/");
export const getContractors = () => api.get<Contractor[]>("/api/contractors/");
export const getInfraWorks = () => api.get<InfraWork[]>("/api/infra-works/");
export const getUpdates = () => api.get<Update[]>("/api/updates/");

export const createRoad = (data: Partial<Road>) => {
  return api.post<Road>("/api/roads/", data);
};

export const updateRoad = (id: number, data: Partial<Road>) => {
  return api.put<Road>(`/api/roads/${id}/`, data);
};

export const deleteRoad = (id: number) => {
  return api.delete<{ message: string }>(`/api/roads/${id}/`);
};

export default api;
