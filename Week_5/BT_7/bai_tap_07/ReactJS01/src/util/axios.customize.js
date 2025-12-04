import axios from 'axios';

// Set config defaults when creating the instance
const instance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    timeout: 10000,
    withCredentials: true, // Cho phép gửi cookies
});

// Alter defaults after instance has been created
// Add a request interceptor
instance.interceptors.request.use(function (config) {
    //Do something before request is sent
    const token = localStorage.getItem('access_token');
    // Chỉ gửi token nếu có
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, function (error){
    //Do something with request error
    return Promise.reject (error);
});

// Add a response interceptor
instance.interceptors.response.use(function (response){
    //Any status code that lie within the range of 2xx cause this function to trigger
    //Do something with response data
    if (response && response.data) return response.data;
    return response;
}, function (error){
    //Any status codes that lie outside the range of 2xx cause this function to trigger
    //Do something with response error
    
    // Nếu nhận lỗi 401 (Unauthorized), clear token
    if (error?.response?.status === 401) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('rememberMe');
    }
    
    if (error?.response?.data) return error?.response.data;
    return Promise.reject (error);
});

export default instance;