require('dotenv').config();
console.log('>>> JWT_SECRET loaded:', !!process.env.JWT_SECRET, process.env.JWT_SECRET ? '[hidden]' : null);

const db = require('../../models');
const User = db.User;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); 
const saltRounds = 10;

const createUserService = async (name, email, password) => {
    try{
        const user = await User.findOne({email});
        if(user){
            console.log("Email " + email + " da ton tai, vui long chon email khac" );
            // return {errCode: 1, message: "Email da ton tai"};
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

const loginService = async (email, password) => {
    try{
        //fetch user by email
        const user = await User.findOne({email: email});
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
                };
                const access_token = jwt.sign(
                    payload, 
                    process.env.JWT_SECRET,
                    {expiresIn: process.env.JWT_EXPIRES_IN || '1h'}
                )
                return {
                    EC: 0,
                    access_token, 
                    user: {
                        email: user.email,
                        name: user.name
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

module.exports = {createUserService, loginService, getUserService, forgotPasswordService, resetPasswordService};
