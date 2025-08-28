import axios from "axios";

import BASE_URL from "./config";
axios.defaults.withCredentials = true;

declare module "axios" {
  export interface AxiosRequestConfig {
    requiresAuth?: boolean;
  }
}

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Request Interceptor
api.interceptors.request.use(
  (config: any) => {
    if (config.requiresAuth) {
      const token = localStorage.getItem("access_token");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor for refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");
        if (!refreshToken) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          window.location.href = "/login";
          return;
        }

        const res = await axios.post(`${BASE_URL}/token/refresh/`, {
          refresh: refreshToken,
        });

        const newAccessToken = res.data.access;
        localStorage.setItem("access_token", newAccessToken);

        // retry with new token
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (err) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

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

export interface Comment {
  id: number;
  comment_date: string;
  text: string;
  update: any;
  infra_work: any;
  commenter: any;
  [key: string]: any;
}

export interface AddCommentPayload {
  workId: number;
  updateId: number;
  text: string;
  [key: string]: any;
}

export interface OtherDepartmentRequestPayload {
  department_name: string;
  work_description: string;
  contact_info: string;
  requested_by: string;
  [key: string]: any;
}

export interface getOtherDepartmentRequestPayload {
  id: number;
  [key: string]: any;
}

export interface updateRequestStatusPayload {
  id: number;
  [key: string]: any;
}

export interface User {
  id: number;
  username: string;
  email: string;
  user_type: string;
  phone_number?: string;
  [key: string]: any;
}

export const fetchUserType = () => api.get<UserType[]>("/accounts/user-types/");

export const login = (email: string, password: string, userType: string) => {
  return api.post<LoginResponse>("/accounts/login/", {
    email,
    password,
    user_type: userType,
  });
};

export const register = (data: RegisterData) => {
  console.log("--------data--------", data);
  return api.post<{ message: string }>("/accounts/register/", data, {
    requiresAuth: true,
  });
};

export const logout = () => {
  return api.post<{ message: string }>("/accounts/logout/");
};

export const getProfile = () => {
  const res = api.get<Profile>("/accounts/profile/", {
    requiresAuth: true,
  });
  console.log("-----res--------", res);
  return res;
};

export const getUsers = () => {
  const res = api.get("/accounts/Users/", {
    requiresAuth: true,
  });
  console.log("-----res--------", res);
  return res;
};
export const getRoads = async () => {
  const response = await api.get("/api/roads/");
  console.log("-------response--------", response.data);
  response.data = response.data.filter((road: { isActive: boolean }) => road.isActive);
  response.data = Array.isArray(response.data)
    ? response.data.sort((a, b) => (a.road_name || '').localeCompare(b.road_name || ''))
    : response.data;
  return response.data;
};
export const getContractors = () =>
  api.get<Contractor[]>("/api/contractors/", {
    requiresAuth: true,
  });

export const createContractor = (data: Partial<Contractor>) => {
  return api.post<Contractor>("/api/contractors/", data, {
    requiresAuth: true,
  });
};

export const getInfraWorks = () =>
  api.get<InfraWork[]>("/api/infra-works/", {
    requiresAuth: true,
  });

export const getUpdates = (page: number = 1, pageSize: number = 10) => {
  const res = api.get("/api/updatesPage/", {
    params: {
      page,
      page_size: pageSize,
    },
    requiresAuth: true,
  });
  console.log("-------res--------", res);
  return res;
};

export const getUpdatesByWork = (workId: number) => {
  const response = api.get(`/api/infra-works/${workId}/updates/`, {
    requiresAuth: true,
  });
  console.log("Fetching updates for work ID:", workId, response);
  return response;
};

export const createRoad = (data: Partial<Road>) => {
  return api.post<Road>("/api/roads/", data, {
    requiresAuth: true,
  });
};

export const updateRoad = (id: number, data: Partial<Road>) => {
  return api.patch<Road>(`/api/roads/${id}/`, data);
};

export const deleteRoad = (id: number, data: Partial<User>) => {
  return api.delete<{ message: string }>(`/api/roads/${id}/`, {
    data,
  });
};

export const getCommentsByWork = (workId: number) => {
  return api.get<Comment[]>("/api/comments/", {
    params: {
      work_id: workId,
    },
    requiresAuth: true,
  });
};

export const addComment = (data: AddCommentPayload) => {
  return api.post("/api/comments/", data, {
    withCredentials: true,
    requiresAuth: true,
  });
};

export const submitOtherDepartmentRequest = (
  data: OtherDepartmentRequestPayload
) => {
  return api.post("/api/other-department-requests/", {
    road: data.road.id,
    department_name: data.departmentName,
    work_description: data.workDescription,
    requested_by: data.requestedBy,
    contact_info: data.contactInfo,
  });
};

export const getPendingRequests = async () => {
  const response = await api.get("/api/other-department-requests/", {
    requiresAuth: true,
  });
  return response.data.filter(
    (req: { status: string }) => req.status === "Pending"
  );
};

export const getOtherRequests = async () => {
  const response = await api.get("/api/other-department-requests/", {
    requiresAuth: true,
  });
  // filter only pending requests
  const pending = response.data.filter(
    (req: { status: string }) => req.status != "Pending"
  );
  console.log("Pending -------------", pending);
  return pending;
};

export const updateRequestStatus = (
  id: number,
  payload: { status: string; response_by: string; response_date: string }
) => {
  return api.patch(`/api/other-department-requests/${id}/`, payload, {
    requiresAuth: true,
  });
};

export const uploadExcel = (file: File, data: Partial<User>) => {
  const formData = new FormData();
  formData.append("file", file);
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  });

  console.log("--------------formdata----------", formData);
  console.log("--------------data----------", data);

  return api.post("/upload-csv/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    requiresAuth: true,
  } as any);
};

export const createInfraWork = (data: Partial<InfraWork>) => {
  return api.post<InfraWork>("/api/infra-works/", data, {
    requiresAuth: true,
  });
};

export const createUpdate = async (payload: any) => {
  const res = await api.post("/api/updates/", payload, {
    requiresAuth: true,
  });
  return res.data;
};

export const updateUser = (id: number, data: Partial<User>) => {
  console.log("--------data--------", data);
  return api.patch(`/accounts/updateUser/${id}/`, data);
};

export const updateContractor = (id: number, data: Partial<Contractor>) => {
  return api.patch(`/api/contractors/${id}/`, data, { requiresAuth: true });
};

export const getWorksonRoad = (roadId: number) => {
  const response =  api.get(`/api/InfraWorksbyRoad/?road_id=${roadId}`, {
    requiresAuth: true,
  });
  response.then(res => {
    res.data = Array.isArray(res.data)
      ? res.data.sort((a, b) => (a.road_name || '').localeCompare(b.road_name || ''))
      : res.data;
  });
  return response;
};

export const logoutUser = () => {
  return api.post(
    "/accounts/logout/",
    {},
    {
      requiresAuth: true,
    }
  );
};

export const getLoginUser = async (id: number) => {
  const response = await api.get<Profile>(
    `/accounts/get-login-user/?id=${id}`,
    {
      requiresAuth: true,
    }
  );
  return response.data;
};

export const deleteUser = (id: number, data: Partial<User>) => {
  console.log("data---------------------", data);
  return api.delete(`/accounts/deleteUser/${id}/`, {
    data,
    requiresAuth: true,
  });
};

export const deleteContractor = (id: number, data: Partial<User>) => {
  return api.delete<{ message: string }>(`/api/contractors/${id}/`, {
    data,
    requiresAuth: true,
  });
};
