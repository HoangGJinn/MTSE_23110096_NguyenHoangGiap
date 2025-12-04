const rateLimit = require('express-rate-limit');

// Rate limiter cho đăng nhập - chặt chẽ hơn để tránh brute force
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 phút
    max: 5, // Giới hạn 5 requests mỗi 15 phút
    message: {
        EC: 1,
        EM: 'Quá nhiều lần đăng nhập thất bại. Vui lòng thử lại sau 15 phút'
    },
    standardHeaders: true, // Trả về thông tin rate limit trong headers
    legacyHeaders: false,
    skipSuccessfulRequests: false, // Đếm cả request thành công
});

// Rate limiter cho đăng ký
const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 giờ
    max: 3, // Giới hạn 3 accounts mỗi giờ
    message: {
        EC: 1,
        EM: 'Quá nhiều tài khoản được tạo. Vui lòng thử lại sau 1 giờ'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Rate limiter cho quên mật khẩu
const forgotPasswordLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 giờ
    max: 3, // Giới hạn 3 requests mỗi giờ
    message: {
        EC: 1,
        EM: 'Quá nhiều yêu cầu quên mật khẩu. Vui lòng thử lại sau 1 giờ'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Rate limiter cho reset password
const resetPasswordLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 giờ
    max: 5, // Giới hạn 5 requests mỗi giờ
    message: {
        EC: 1,
        EM: 'Quá nhiều yêu cầu đặt lại mật khẩu. Vui lòng thử lại sau 1 giờ'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Rate limiter chung cho các API khác
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 phút
    max: 100, // Giới hạn 100 requests mỗi 15 phút
    message: {
        EC: 1,
        EM: 'Quá nhiều requests. Vui lòng thử lại sau'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = {
    loginLimiter,
    registerLimiter,
    forgotPasswordLimiter,
    resetPasswordLimiter,
    apiLimiter
};
