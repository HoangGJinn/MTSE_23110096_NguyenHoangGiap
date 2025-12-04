const express = require('express');

const { createUser, handleLogin, getUser, getAccount, forgotPassword, resetPassword, handleRefreshToken, handleLogout } = require('../controllers/userController');
const { 
    getProducts, 
    getProductById, 
    createProduct, 
    updateProduct, 
    deleteProduct, 
    getCategories 
} = require('../controllers/productController');
const {
    toggleFavoriteProduct,
    checkFavoriteStatus,
    getFavoriteProducts
} = require('../controllers/favoriteController');
const {
    addToViewed,
    getViewedProductsList
} = require('../controllers/viewedProductController');
const {
    createProductComment,
    getProductComments,
    deleteProductComment
} = require('../controllers/commentController');
const {
    getStats,
    getSimilar,
    getProductDetailWithStats
} = require('../controllers/productStatsController');
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
routerAPI.post("/refresh-token", handleRefreshToken); // Refresh token endpoint
routerAPI.post("/forgot-password", forgotPasswordLimiter, forgotPasswordValidation, validate, forgotPassword);
routerAPI.post("/reset-password", resetPasswordLimiter, resetPasswordValidation, validate, resetPassword);

routerAPI.get("/", (req, res) => {
    res.status(200).json({ message: "Hello from API" });
});

// Public product routes
routerAPI.get("/products", getProducts); // Xem sản phẩm không cần auth
routerAPI.get("/categories", getCategories); // Xem danh mục

// Public product stats routes (phải đặt TRƯỚC route /products/:id để tránh conflict)
routerAPI.get("/products/:productId/stats", getStats); // Lấy thống kê sản phẩm
routerAPI.get("/products/:productId/similar", getSimilar); // Lấy sản phẩm tương tự
routerAPI.get("/products/:productId/comments", getProductComments); // Lấy bình luận sản phẩm

// Route này phải đặt SAU các route cụ thể
routerAPI.get("/products/:id", getProductById); // Xem chi tiết sản phẩm

// Logout route (cần auth để xác định user)
routerAPI.post("/logout", auth, handleLogout);

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

// Favorite products routes (cần auth)
routerAPI.post("/favorites/toggle", isUser, toggleFavoriteProduct); // Thêm/xóa yêu thích
routerAPI.get("/favorites/check/:productId", isUser, checkFavoriteStatus); // Kiểm tra yêu thích
routerAPI.get("/favorites", isUser, getFavoriteProducts); // Lấy danh sách yêu thích

// Viewed products routes (cần auth)
routerAPI.post("/viewed", isUser, addToViewed); // Thêm vào danh sách đã xem
routerAPI.get("/viewed", isUser, getViewedProductsList); // Lấy danh sách đã xem

// Comment routes (cần auth)
routerAPI.post("/comments", isUser, createProductComment); // Tạo bình luận
routerAPI.delete("/comments/:commentId", isUser, deleteProductComment); // Xóa bình luận

// Product detail with stats (cần auth để có isFavorite)
routerAPI.get("/products/:id/detail", isUser, getProductDetailWithStats); // Lấy chi tiết với stats và similar

module.exports = routerAPI;
