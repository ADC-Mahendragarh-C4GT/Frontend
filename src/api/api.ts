import axios from "axios";
import BASE_URL from "./config";
axios.defaults.withCredentials = true;

const token = localStorage.getItem("access_token");

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

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


export const fetchUserType = () =>
  api.get<UserType[]>("/accounts/user-types/");

export const login = (email: string, password: string, userType: string) => {
  return api.post<LoginResponse>("/accounts/login/", {
    email,
    password,
    user_type: userType,
  });
};

export const register = (data: RegisterData) => {
  console.log('--------data--------', data);
  return api.post<{ message: string }>("/accounts/register/", data);
};

export const logout = () => {
  return api.post<{ message: string }>("/accounts/logout/");
};

export const getProfile = () => {
  const  res = api.get<Profile>("/accounts/profile/", {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });
  console.log('-----res--------', res);
  return res;
};

export const getUsers = () => {
  const  res = api.get("/accounts/Users/", {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });
  console.log('-----res--------', res);
  return res;
};
export const getRoads = async () => {
  const response = await api.get("/api/roads/");
  console.log('-------response--------', response.data);
  return response.data;
};
export const getContractors = () => api.get<Contractor[]>("/api/contractors/", {
  headers:{
    Authorization: `Bearer ${token}`,
  }
});

export const createContractor = (data: Partial<Contractor>) => {
  return api.post<Contractor>("/api/contractors/", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getInfraWorks = () => api.get<InfraWork[]>("/api/infra-works/", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const getUpdates = (page: number = 1, pageSize: number = 10) => {
  console.log(`Fetching updates with token: ${token}`);
  const res =  api.get("/api/updatesPage/", {
    params: {
      page,
      page_size: pageSize,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log('-------res--------', res);
  return res;
};

export const getUpdatesByWork = (workId: number) => {
  const response = api.get(`/api/infra-works/${workId}/updates/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log("Fetching updates for work ID:", workId, response);
  return response;
};

export const createRoad = (data: Partial<Road>) => {
  return api.post<Road>("/api/roads/", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateRoad = (id: number, data: Partial<Road>) => {
  return api.patch<Road>(`/api/roads/${id}/`, data);
};

export const deleteRoad = (id: number) => {
  return api.delete<{ message: string }>(`/api/roads/${id}/`);
};

export const getCommentsByWork = (workId: number) => {
  return api.get<Comment[]>("/api/comments/", {
    params: {
      work_id: workId,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export default api;

export const addComment = (data: AddCommentPayload) => {
  return api.post(
    "/api/comments/",
    {
      infra_work: data.workId,
      update: data.updateId,
      comment_text: data.text,
    },
    {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
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
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  // filter only pending requests
  const pending = response.data.filter(
    (req: { status: string }) => req.status === "Pending"
  );
  return pending;
};

export const getOtherRequests = async () => {

  const response = await api.get("/api/other-department-requests/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
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
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const uploadExcel = (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  return api.post("/upload-csv/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
};


export const createInfraWork = (data: Partial<InfraWork>) => {
  return api.post<InfraWork>("/api/infra-works/", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};


export const createUpdate = async (payload: any) => {
  const res = await api.post("/api/updates/", payload,{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};


export const updateUser = (id: number, data: Partial<User>) => {
  console.log('--------data--------', data);
  return api.patch(`/accounts/updateUser/${id}/`, data,);
};