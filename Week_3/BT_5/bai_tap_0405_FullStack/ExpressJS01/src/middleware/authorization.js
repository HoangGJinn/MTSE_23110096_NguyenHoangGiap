/**
 * Middleware kiểm tra quyền truy cập dựa trên role
 * Sử dụng sau middleware auth để đảm bảo req.user đã được gán
 */

// Middleware kiểm tra role có trong danh sách cho phép
const checkRole = (...allowedRoles) => {
    return (req, res, next) => {
        // Kiểm tra xem user đã được authenticate chưa
        if (!req.user) {
            return res.status(401).json({
                EC: 1,
                EM: "Vui lòng đăng nhập để tiếp tục"
            });
        }

        // Kiểm tra role của user
        const userRole = req.user.role;

        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({
                EC: 1,
                EM: `Bạn không có quyền truy cập. Chỉ ${allowedRoles.join(', ')} mới có quyền truy cập`
            });
        }

        // User có quyền, cho phép tiếp tục
        next();
    };
};

// Middleware chỉ cho phép Admin
const isAdmin = checkRole('Admin');

// Middleware cho phép cả User và Admin
const isUser = checkRole('User', 'Admin');

// Middleware cho phép user chỉ truy cập tài nguyên của chính họ hoặc là Admin
const isOwnerOrAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            EC: 1,
            EM: "Vui lòng đăng nhập để tiếp tục"
        });
    }

    const userRole = req.user.role;
    const userEmail = req.user.email;
    
    // Lấy email từ params hoặc body hoặc query
    const targetEmail = req.params.email || req.body.email || req.query.email;

    // Admin có thể truy cập mọi tài nguyên
    if (userRole === 'Admin') {
        return next();
    }

    // User chỉ có thể truy cập tài nguyên của chính họ
    if (userEmail === targetEmail) {
        return next();
    }

    return res.status(403).json({
        EC: 1,
        EM: "Bạn không có quyền truy cập tài nguyên này"
    });
};

module.exports = {
    checkRole,
    isAdmin,
    isUser,
    isOwnerOrAdmin
};
