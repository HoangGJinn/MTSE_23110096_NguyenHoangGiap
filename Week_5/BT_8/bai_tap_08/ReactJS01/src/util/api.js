import axios from './axios.customize';

const createUserApi = (name, email, password) => {
    const URL_API = "v1/api/register";
    const data = {
        name, email, password
    }

    return axios.post(URL_API, data);
};

const loginApi = (email, password, rememberMe = false) => {
    const URL_API = "v1/api/login";
    const data = {
        email,
        password,
        rememberMe
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

// Product APIs
const getProductsAPI = (page = 1, limit = 10, categoryId = null, search = null) => {
    const URL_API = "v1/api/products";
    const params = { page, limit };
    if (categoryId) params.categoryId = categoryId;
    if (search && search.trim() !== '') params.search = search.trim();
    return axios.get(URL_API, { params });
}

const getProductByIdAPI = (id) => {
    const URL_API = `v1/api/products/${id}`;
    return axios.get(URL_API);
}

const createProductAPI = (productData) => {
    const URL_API = "v1/api/products";
    return axios.post(URL_API, productData);
}

const updateProductAPI = (id, productData) => {
    const URL_API = `v1/api/products/${id}`;
    return axios.put(URL_API, productData);
}

const deleteProductAPI = (id) => {
    const URL_API = `v1/api/products/${id}`;
    return axios.delete(URL_API);
}

const getCategoriesAPI = () => {
    const URL_API = "v1/api/categories";
    return axios.get(URL_API);
}

const getAccountAPI = () => {
    const URL_API = "v1/api/account";
    return axios.get(URL_API);
}

// Favorite Products APIs
const toggleFavoriteAPI = (productId) => {
    const URL_API = "v1/api/favorites/toggle";
    return axios.post(URL_API, { productId });
}

const checkFavoriteAPI = (productId) => {
    const URL_API = `v1/api/favorites/check/${productId}`;
    return axios.get(URL_API);
}

const getFavoritesAPI = (page = 1, limit = 10) => {
    const URL_API = "v1/api/favorites";
    return axios.get(URL_API, { params: { page, limit } });
}

// Viewed Products APIs
const addToViewedAPI = (productId) => {
    const URL_API = "v1/api/viewed";
    return axios.post(URL_API, { productId });
}

const getViewedProductsAPI = (limit = 10) => {
    const URL_API = "v1/api/viewed";
    return axios.get(URL_API, { params: { limit } });
}

// Comment APIs
const createCommentAPI = (productId, content, rating = null) => {
    const URL_API = "v1/api/comments";
    return axios.post(URL_API, { productId, content, rating });
}

const getCommentsAPI = (productId, page = 1, limit = 10) => {
    const URL_API = `v1/api/products/${productId}/comments`;
    return axios.get(URL_API, { params: { page, limit } });
}

const deleteCommentAPI = (commentId) => {
    const URL_API = `v1/api/comments/${commentId}`;
    return axios.delete(URL_API);
}

// Product Stats APIs
const getProductStatsAPI = (productId) => {
    const URL_API = `v1/api/products/${productId}/stats`;
    return axios.get(URL_API);
}

const getSimilarProductsAPI = (productId, limit = 4) => {
    const URL_API = `v1/api/products/${productId}/similar`;
    return axios.get(URL_API, { params: { limit } });
}

const getProductDetailWithStatsAPI = (productId) => {
    const URL_API = `v1/api/products/${productId}/detail`;
    return axios.get(URL_API);
}

export {
    createUserApi,
    loginApi,
    getUserApi,
    forgotPasswordAPI,
    resetPasswordAPI,
    getProductsAPI,
    getProductByIdAPI,
    createProductAPI,
    updateProductAPI,
    deleteProductAPI,
    getCategoriesAPI,
    getAccountAPI,
    toggleFavoriteAPI,
    checkFavoriteAPI,
    getFavoritesAPI,
    addToViewedAPI,
    getViewedProductsAPI,
    createCommentAPI,
    getCommentsAPI,
    deleteCommentAPI,
    getProductStatsAPI,
    getSimilarProductsAPI,
    getProductDetailWithStatsAPI
};