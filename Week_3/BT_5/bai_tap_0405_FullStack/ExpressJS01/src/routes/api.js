const express = require('express');

const { createUser, handleLogin, getUser, getAccount, forgotPassword, resetPassword } = require('../controllers/userController');
const { 
    getProducts, 
    getProductById, 
    createProduct, 
    updateProduct, 
    deleteProduct, 
    getCategories 
} = require('../controllers/productController');
const auth = require('../middleware/auth');
const delay = require('../middleware/delay');
const { isAdmin, isUser } = require('../middleware/authorization');
const validate = require('../middleware/validate');
const {
    registerValidation,
    loginValidation,
    forgotPasswordValidation,
    resetPasswordValidation
} = require('../validation/auth.validation');
const {
    loginLimiter,
    registerLimiter,
    forgotPasswordLimiter,
    resetPasswordLimiter,
    apiLimiter
} = require('../middleware/rateLimiter');

// Express → ĐỊNH NGHĨA API
// Axios → GỌI API
const routerAPI = express.Router();

// Public routes (không cần auth) - có input validation và rate limiting
routerAPI.post("/register", registerLimiter, registerValidation, validate, createUser);
routerAPI.post("/login", loginLimiter, loginValidation, validate, handleLogin);
routerAPI.post("/forgot-password", forgotPasswordLimiter, forgotPasswordValidation, validate, forgotPassword);
routerAPI.post("/reset-password", resetPasswordLimiter, resetPasswordValidation, validate, resetPassword);

routerAPI.get("/", (req, res) => {
    res.status(200).json({ message: "Hello from API" });
});

// Public product routes
routerAPI.get("/products", getProducts); // Xem sản phẩm không cần auth
routerAPI.get("/products/:id", getProductById); // Xem chi tiết sản phẩm
routerAPI.get("/categories", getCategories); // Xem danh mục

// Áp dụng auth và rate limiter cho tất cả route tiếp theo
routerAPI.use(auth);
routerAPI.use(apiLimiter);

// Các route cần auth và authorization
// GET /user - Chỉ Admin mới xem được danh sách tất cả user
routerAPI.get("/user", isAdmin, getUser);

// GET /account - User và Admin đều có thể xem account của chính họ
routerAPI.get("/account", isUser, delay, getAccount);

// Admin product management routes
routerAPI.post("/products", isAdmin, createProduct);
routerAPI.put("/products/:id", isAdmin, updateProduct);
routerAPI.delete("/products/:id", isAdmin, deleteProduct);

module.exports = routerAPI;
