const {
    createUserService,
    loginService,
    getUserService,
    forgotPasswordService,
    resetPasswordService,
    getAccountService,
    refreshTokenService
} = require('../services/userService');

// Controller: Đăng ký user
const createUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const data = await createUserService(name, email, password);

        if (!data) {
            return res.status(400).json({
                EC: 1,
                EM: "Email đã tồn tại"
            });
        }

        return res.status(201).json({
            EC: 0,
            EM: "Register success",
            data: data,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ EC: -1, EM: "Server error" });
    }
};

// Controller: Đăng nhập
const handleLogin = async (req, res) => {
    try {
        const { email, password, rememberMe } = req.body;

        const data = await loginService(email, password, rememberMe);

        if (!data || data.EC !== 0) {
            return res.status(401).json(data || { EC: -1, EM: "Email or password incorrect" });
        }

        // Set cookie với access token (luôn session cookie - 30 phút)
        res.cookie('access_token', data.access_token, {
            httpOnly: true,
            secure: false, // Set to true if using HTTPS
            sameSite: 'lax'
            // Không set maxAge để tạo session cookie (hết hạn khi đóng browser)
        });

        // Set refresh token cookie nếu rememberMe = true (30 ngày)
        if (rememberMe && data.refresh_token) {
            res.cookie('refresh_token', data.refresh_token, {
                httpOnly: true,
                secure: false,
                sameSite: 'lax',
                maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
            });
        }

        // Trả về đúng format mà frontend expect
        return res.status(200).json(data);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ EC: -1, EM: "Server error" });
    }
};

// Controller: Lấy danh sách user
const getUser = async (req, res) => {
    try {
        const data = await getUserService();
        // Trả về trực tiếp array users
        return res.status(200).json(data);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error" });
    }
};

const getAccount = async (req, res) => {
    try {
        const account = await getAccountService(req.user.email);
        if (!account) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json(account);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error" });
    }
}

// Controller: Kiểm tra email cho quên mật khẩu
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({
                EC: 1,
                EM: "Email là bắt buộc"
            });
        }
        
        const data = await forgotPasswordService(email);
        
        if (data.EC !== 0) {
            return res.status(404).json(data);
        }
        
        return res.status(200).json(data);
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({ EC: -1, EM: "Server error" });
    }
};

// Controller: Đặt lại mật khẩu
const resetPassword = async (req, res) => {
    try {
        const { email, newPassword, confirmPassword } = req.body;
        
        if (!email || !newPassword || !confirmPassword) {
            return res.status(400).json({
                EC: 1,
                EM: "Vui lòng điền đầy đủ thông tin"
            });
        }
        
        const data = await resetPasswordService(email, newPassword, confirmPassword);
        
        if (data.EC !== 0) {
            return res.status(400).json(data);
        }
        
        return res.status(200).json(data);
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({ EC: -1, EM: "Server error" });
    }
};

// Controller: Refresh token
const handleRefreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies?.refresh_token;

        if (!refreshToken) {
            return res.status(401).json({
                EC: 1,
                EM: "Refresh token không tồn tại"
            });
        }

        const data = await refreshTokenService(refreshToken);

        if (data.EC !== 0) {
            return res.status(401).json(data);
        }

        // Set access token mới vào cookie
        res.cookie('access_token', data.access_token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax'
        });

        return res.status(200).json({
            EC: 0,
            EM: "Refresh token thành công",
            data: {
                access_token: data.access_token,
                user: data.user
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ EC: -1, EM: "Server error" });
    }
};

// Controller: Đăng xuất
const handleLogout = async (req, res) => {
    try {
        // Xóa cookie chứa access token và refresh token
        res.clearCookie('access_token');
        res.clearCookie('refresh_token');

        return res.status(200).json({
            EC: 0,
            EM: "Đăng xuất thành công"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ EC: -1, EM: "Server error" });
    }
};

module.exports = {
    createUser,
    handleLogin,
    getUser,
    getAccount,
    forgotPassword,
    resetPassword,
    handleRefreshToken,
    handleLogout,
};
