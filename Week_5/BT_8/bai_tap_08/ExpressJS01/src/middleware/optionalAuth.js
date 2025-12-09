require("dotenv").config();
const jwt = require("jsonwebtoken");
const { refreshTokenService } = require('../services/userService');
const db = require('../../models');
const User = db.User;

// Optional auth middleware - không bắt buộc phải có token
// Nếu có token hợp lệ thì set req.user, nếu không thì tiếp tục mà không có req.user
const optionalAuth = async (req, res, next) => {
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

            // Lấy user từ database để có id
            const user = await User.findOne({ where: { email: decoded.email } });
            
            if (user) {
                // Gắn data user vào req để dùng ở controller và middleware khác
                req.user = {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role || 'User',
                    decryptedBy: "hoainqt"
                };
            } else {
                req.user = undefined;
            }

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

                            // Lấy user từ database
                            const user = await User.findOne({ where: { email: refreshData.user.email } });
                            
                            if (user) {
                                req.user = {
                                    id: user.id,
                                    email: user.email,
                                    name: user.name,
                                    role: user.role || 'User',
                                    decryptedBy: "hoainqt"
                                };
                            } else {
                                req.user = undefined;
                            }

                            return next();
                        }
                    } catch (refreshError) {
                        console.log('Refresh token error:', refreshError);
                    }
                }
            }

            // Nếu token không hợp lệ, không set req.user nhưng vẫn tiếp tục
            console.log('Optional auth: Token không hợp lệ, tiếp tục không có user');
            req.user = undefined;
            return next();
        }
    } else {
        // Không có token, tiếp tục mà không có req.user
        req.user = undefined;
        return next();
    }
};

module.exports = optionalAuth;

