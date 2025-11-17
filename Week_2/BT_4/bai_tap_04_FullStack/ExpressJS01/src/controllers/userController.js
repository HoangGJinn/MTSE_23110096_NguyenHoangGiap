const {
    createUserService,
    loginService,
    getUserService,
    forgotPasswordService,
    resetPasswordService
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
    console.log(">>> handleLogin - req.body: ", req.body);
    try {
        const { email, password } = req.body;

        const data = await loginService(email, password);

        if (!data || data.EC !== 0) {
            return res.status(401).json(data || { EC: -1, EM: "Email or password incorrect" });
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
        return res.status(200).json(req.user);
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

module.exports = {
    createUser,
    handleLogin,
    getUser,
    getAccount,
    forgotPassword,
    resetPassword,
};
