import axios from "axios";
import BASE_URL from "./config";
axios.defaults.withCredentials = true;

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

interface AddCommentPayload {
  workId: number;
  updateId: number;
  text: string;
}

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

export const  getUpdates = (page: number = 1, pageSize: number = 10) => {
  const token = localStorage.getItem("access_token");
  console.log(`Fetching updates with token: ${token}`);
  return api.get("/api/updatesPage/", {
    params: {
      page,
      page_size: pageSize,
    },
     headers: {
    "Authorization": `Bearer ${token}`
  }
  });
};



export const getUpdatesByWork = (workId: number) => {
  const token = localStorage.getItem("access_token");
  const response = api.get(`/api/infra-works/${workId}/updates/`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
  console.log('Fetching updates for work ID:', workId, response);
  return response;
};


export const createRoad = (data: Partial<Road>) => {
  return api.post<Road>("/api/roads/", data);
};

export const updateRoad = (id: number, data: Partial<Road>) => {
  return api.put<Road>(`/api/roads/${id}/`, data);
};

export const deleteRoad = (id: number) => {
  return api.delete<{ message: string }>(`/api/roads/${id}/`);
};


export const getCommentsByWork = (workId: number) => {
  const token = localStorage.getItem("access_token");
  return api.get<Comment[]>("/api/comments/", {
    params: {
      work_id: workId,
    },
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
};

export default api;



export const addComment = (data: AddCommentPayload) => {
  const token = localStorage.getItem("access_token");
  return api.post("/api/comments/", {
    infra_work: data.workId,
    update: data.updateId,
    comment_text: data.text,
  }, {
    withCredentials: true,
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
};



