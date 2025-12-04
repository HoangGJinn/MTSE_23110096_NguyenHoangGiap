require("dotenv").config();
const jwt = require("jsonwebtoken");
const { refreshTokenService } = require('../services/userService');

const auth = async (req, res, next) => {
    const white_lists = ["/", "/register", "/login", "/refresh-token", "/forgot-password", "/reset-password", "/products", "/categories"];

    // Nếu URL thuộc whitelist => bỏ qua kiểm tra token
    if (white_lists.find(item => item === req.path)) {
        return next();
    }

    // Lấy token từ header hoặc cookie
    let token = null;
    
    if (req.headers.authorization) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.access_token) {
        token = req.cookies.access_token;
    }

    if (token) {
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

            return next();

        } catch (error) {
            // Nếu token hết hạn, thử refresh token
            if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
                const refreshToken = req.cookies?.refresh_token;
                
                if (refreshToken) {
                    try {
                        // Thử refresh token
                        const refreshData = await refreshTokenService(refreshToken);
                        
                        if (refreshData.EC === 0) {
                            // Set access token mới vào cookie
                            res.cookie('access_token', refreshData.access_token, {
                                httpOnly: true,
                                secure: false,
                                sameSite: 'lax'
                            });

                            // Gắn data user vào req
                            req.user = {
                                email: refreshData.user.email,
                                name: refreshData.user.name,
                                role: refreshData.user.role || 'User',
                                decryptedBy: "hoainqt"
                            };

                            return next();
                        }
                    } catch (refreshError) {
                        console.log('Refresh token error:', refreshError);
                    }
                }
            }

            console.log('Auth error:', error);
            // Xóa cookie nếu token không hợp lệ
            res.clearCookie('access_token');
            res.clearCookie('refresh_token');
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
