import axios from 'axios';

const API = axios.create({ baseURL: process.env.REACT_APP_SOCKET_URL });
API.interceptors.request.use((req) => {
    if (localStorage.getItem("profile")) {
        req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem("profile")).token
            }`;
    }
    return req;
});

export const signIn = (formData) => API.post("/api/v1/signin", formData);
export const signUp = (formData) => API.post("/api/v1/signup", formData);
