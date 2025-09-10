declare module "axios" {
    interface AxiosRequestConfig {
        requiresAuth?: boolean;
    }
}
declare const api: import("axios").AxiosInstance;
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
export declare const fetchUserType: () => Promise<import("axios").AxiosResponse<UserType[], any>>;
export declare const login: (email: string, password: string, userType: string) => Promise<import("axios").AxiosResponse<LoginResponse, any>>;
export declare const register: (data: RegisterData) => Promise<import("axios").AxiosResponse<{
    message: string;
}, any>>;
export declare const logout: () => Promise<import("axios").AxiosResponse<{
    message: string;
}, any>>;
export declare const getProfile: () => Promise<import("axios").AxiosResponse<Profile, any>>;
export declare const getUsers: () => Promise<import("axios").AxiosResponse<any, any>>;
export declare const getRoads: () => Promise<any>;
export declare const getAllRoads: () => Promise<any>;
export declare const getContractors: () => Promise<import("axios").AxiosResponse<Contractor[], any>>;
export declare const createContractor: (data: Partial<Contractor>) => Promise<import("axios").AxiosResponse<Contractor, any>>;
export declare const getInfraWorks: () => Promise<import("axios").AxiosResponse<InfraWork[], any>>;
export declare const getUpdates: (page?: number, pageSize?: number) => Promise<import("axios").AxiosResponse<any, any>>;
export declare const getUpdatesByWork: (workId: number) => Promise<import("axios").AxiosResponse<any, any>>;
export declare const createRoad: (data: Partial<Road>) => Promise<import("axios").AxiosResponse<Road, any>>;
export declare const updateRoad: (id: number, data: Partial<Road>) => Promise<import("axios").AxiosResponse<Road, any>>;
export declare const deleteRoad: (id: number, data: Partial<User>) => Promise<import("axios").AxiosResponse<{
    message: string;
}, any>>;
export declare const getCommentsByWork: (workId: number) => Promise<import("axios").AxiosResponse<Comment[], any>>;
export declare const addComment: (data: AddCommentPayload) => Promise<import("axios").AxiosResponse<any, any>>;
export declare const submitOtherDepartmentRequest: (data: OtherDepartmentRequestPayload) => Promise<import("axios").AxiosResponse<any, any>>;
export declare const getPendingRequests: () => Promise<any>;
export declare const getOtherRequests: () => Promise<any>;
export declare const updateRequestStatus: (id: number, payload: {
    status: string;
    response_by: string;
    response_date: string;
    login_user: string;
}) => Promise<import("axios").AxiosResponse<any, any>>;
export declare const uploadExcel: (file: File, data: Partial<User>) => Promise<import("axios").AxiosResponse<any, any>>;
export declare const createInfraWork: (data: Partial<InfraWork>) => Promise<import("axios").AxiosResponse<InfraWork, any>>;
export declare const createUpdate: (payload: any) => Promise<any>;
export declare const updateUser: (id: number, data: Partial<User>) => Promise<import("axios").AxiosResponse<any, any>>;
export declare const updateContractor: (id: number, data: Partial<Contractor>) => Promise<import("axios").AxiosResponse<any, any>>;
export declare const getWorksonRoad: (roadId: number) => Promise<import("axios").AxiosResponse<any, any>>;
export declare const logoutUser: () => Promise<import("axios").AxiosResponse<any, any>>;
export declare const getLoginUser: (id: number) => Promise<Profile>;
export declare const deleteUser: (id: number, data: Partial<User>) => Promise<import("axios").AxiosResponse<any, any>>;
export declare const deleteContractor: (id: number, data: Partial<User>) => Promise<import("axios").AxiosResponse<{
    message: string;
}, any>>;
export declare const deleteComment: (id: number, data: Partial<User>) => Promise<import("axios").AxiosResponse<{
    message: string;
}, any>>;
export declare const fetchAuditReport: (startDate: string, endDate: string) => Promise<any>;
export declare const ResetPassword: (uid: string | undefined, token: string | undefined, password: string) => Promise<import("axios").AxiosResponse<any, any>>;
export declare const ForgetPassword: (email: string) => Promise<import("axios").AxiosResponse<any, any>>;
//# sourceMappingURL=api.d.ts.map