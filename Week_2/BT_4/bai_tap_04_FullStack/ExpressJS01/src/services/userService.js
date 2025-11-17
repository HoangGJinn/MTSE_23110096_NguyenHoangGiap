require('dotenv').config();
console.log('>>> JWT_SECRET loaded:', !!process.env.JWT_SECRET, process.env.JWT_SECRET ? '[hidden]' : null);

const User = require('../models/user');
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
        let result = await User.find({}).select("-password");
        return result;

    } catch (error) {
        console.log(error);
        return null;
    }
};

module.exports = {createUserService, loginService, getUserService};
