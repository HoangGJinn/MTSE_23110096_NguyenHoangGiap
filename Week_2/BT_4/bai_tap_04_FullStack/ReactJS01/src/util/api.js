import axios from './axios.customize';

const createUserApi = (name, email, password) => {
    const URL_API = "v1/api/register";
    const data = {
        name, email, password
    }

    return axios.post(URL_API, data);
};

const loginApi = (email, password) => {
    const URL_API = "v1/api/login";
    const data = {
        email,
        password
    }
    return axios.post(URL_API, data);
}

const getUserApi = () => {
    const URL_API = "v1/api/user";
    return axios.get(URL_API);
}

const forgotPasswordAPI = (email) => {
    const URL_API = "v1/api/forgot-password";
    const data = { email };
    return axios.post(URL_API, data);
}

const resetPasswordAPI = (email, newPassword, confirmPassword) => {
    const URL_API = "v1/api/reset-password";
    const data = {
        email,
        newPassword,
        confirmPassword
    };
    return axios.post(URL_API, data);
}

export {
    createUserApi,
    loginApi,
    getUserApi,
    forgotPasswordAPI,
    resetPasswordAPI
};