require('dotenv').config();

const db = require('../../models');
const User = db.User;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); 
const saltRounds = 10;

const createUserService = async (name, email, password) => {
    try{
        const user = await User.findOne({ where: { email } });
        if(user){
            return null;
        }

        //hah user password
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        //save user to database
        const result = await User.create({
            name, //shorthand property -> name: name
            email, // email: email
            password: hashedPassword,
            role: 'User',
        });
        return result;
    } catch (error){
        console.log("Loi createUserService: ", error);
        return null;
    }
}

const loginService = async (email, password, rememberMe = false) => {
    try{
        //fetch user by email
        const user = await User.findOne({ where: { email: email } });
        if(user){
            //compare password
            const isMatchPassword = await bcrypt.compare(password, user.password);
            if(!isMatchPassword){
                return {
                    EC: 2,
                    EM: "Email/Password khong hop le",
                }
            } else{
                //create jwt token
                const payload ={
                    email: user.email,
                    name: user.name,
                    role: user.role, // Thêm role vào payload
                };
                
                // Access token luôn hết hạn sau 30 phút
                const access_token = jwt.sign(
                    payload, 
                    process.env.JWT_SECRET,
                    {expiresIn: '30m'}
                );
                
                // Refresh token chỉ tạo khi rememberMe = true, hết hạn sau 30 ngày
                let refresh_token = null;
                if (rememberMe) {
                    refresh_token = jwt.sign(
                        { email: user.email, type: 'refresh' },
                        process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
                        {expiresIn: '30d'}
                    );
                }
                
                return {
                    EC: 0,
                    access_token,
                    refresh_token, // Chỉ có khi rememberMe = true
                    user: {
                        email: user.email,
                        name: user.name,
                        role: user.role
                    }
                };
            }
        }
        else{
            return {
                EC: 1,
                EM: "Email/Password khong hop le",
            }
        }
    } catch (error){
        console.log("Loi loginService: ", error);
        return null;
    }
}

const getUserService = async () => {
    try {
        // Lấy toàn bộ user, bỏ field password
        let result = await User.findAll({
            attributes: { exclude: ['password'] }
        });
        return result;

    } catch (error) {
        console.log(error);
        return null;
    }
};

const forgotPasswordService = async (email) => {
    try {
        // Kiểm tra email có tồn tại không
        const user = await User.findOne({ where: { email } });
        
        if (!user) {
            return {
                EC: 1,
                EM: "Email không tồn tại trong hệ thống"
            };
        }
        
        return {
            EC: 0,
            EM: "Email hợp lệ",
            data: {
                email: user.email,
                name: user.name
            }
        };
    } catch (error) {
        console.log("Lỗi forgotPasswordService: ", error);
        return {
            EC: -1,
            EM: "Lỗi server"
        };
    }
};

const resetPasswordService = async (email, newPassword, confirmPassword) => {
    try {
        // Kiểm tra mật khẩu mới và xác nhận mật khẩu
        if (newPassword !== confirmPassword) {
            return {
                EC: 1,
                EM: "Mật khẩu xác nhận không khớp"
            };
        }
        
        // Kiểm tra độ dài mật khẩu
        if (newPassword.length < 6) {
            return {
                EC: 2,
                EM: "Mật khẩu phải có ít nhất 6 ký tự"
            };
        }
        
        // Tìm user
        const user = await User.findOne({ where: { email } });
        
        if (!user) {
            return {
                EC: 3,
                EM: "Email không tồn tại"
            };
        }
        
        // Hash mật khẩu mới
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
        
        // Cập nhật mật khẩu
        await user.update({ password: hashedPassword });
        
        return {
            EC: 0,
            EM: "Đổi mật khẩu thành công"
        };
    } catch (error) {
        console.log("Lỗi resetPasswordService: ", error);
        return {
            EC: -1,
            EM: "Lỗi server"
        };
    }
};

const getAccountService = async (email) => {
    try {
        const UserProfile = db.UserProfile;
        // Lấy user với profile
        const user = await User.findOne({
            where: { email },
            attributes: { exclude: ['password'] },
            include: [{
                model: UserProfile,
                as: 'profile',
                required: false
            }]
        });
        
        if (!user) {
            return null;
        }
        
        return user;
    } catch (error) {
        console.log("Lỗi getAccountService: ", error);
        return null;
    }
};

// Service: Refresh access token
const refreshTokenService = async (refreshToken) => {
    try {
        // Verify refresh token
        const decoded = jwt.verify(
            refreshToken, 
            process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET
        );

        // Kiểm tra type của token
        if (decoded.type !== 'refresh') {
            return {
                EC: 1,
                EM: "Invalid refresh token"
            };
        }

        // Tìm user
        const user = await User.findOne({ where: { email: decoded.email } });
        if (!user) {
            return {
                EC: 1,
                EM: "User not found"
            };
        }

        // Tạo access token mới (30 phút)
        const payload = {
            email: user.email,
            name: user.name,
            role: user.role
        };

        const access_token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            {expiresIn: '30m'}
        );

        return {
            EC: 0,
            access_token,
            user: {
                email: user.email,
                name: user.name,
                role: user.role
            }
        };
    } catch (error) {
        console.log("Lỗi refreshTokenService: ", error);
        return {
            EC: 1,
            EM: "Refresh token không hợp lệ hoặc đã hết hạn"
        };
    }
};

module.exports = {
    createUserService, 
    loginService, 
    getUserService, 
    forgotPasswordService, 
    resetPasswordService, 
    getAccountService,
    refreshTokenService
};
