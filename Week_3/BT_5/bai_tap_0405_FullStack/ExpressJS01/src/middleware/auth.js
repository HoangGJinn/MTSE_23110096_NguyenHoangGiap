require("dotenv").config();
const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    console.log('>>> auth hit:', { originalUrl: req.originalUrl, baseUrl: req.baseUrl, path: req.path, method: req.method });
    
    const white_lists = ["/", "/register", "/login", "/forgot-password", "/reset-password"];

    // Nếu URL thuộc whitelist => bỏ qua kiểm tra token
    if (white_lists.find(item => item === req.path)) {
        return next();
    }

    // Kiểm tra header Authorization tồn tại
    if (req.headers.authorization) {
        // Lấy token
        const token = req.headers.authorization.split(' ')[1];

        try {
            // Giải mã token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Gắn data user vào req để dùng ở controller và middleware khác
            req.user = {
                email: decoded.email,
                name: decoded.name,
                role: decoded.role || 'User', // Lấy role từ token
                decryptedBy: "hoainqt"
            };

            console.log(">>> check token: ", decoded);

            return next();

        } catch (error) {
            console.log(error);
            return res.status(401).json({
                EC: 1,
                EM: "Token bị hết hạn hoặc không hợp lệ"
            });
        }

    } else {
        // Không có token
        return res.status(401).json({
            EC: 1,
            EM: "Bạn chưa truyền Access Token hoặc token bị hết hạn"
        });
    }
};

module.exports = auth;
