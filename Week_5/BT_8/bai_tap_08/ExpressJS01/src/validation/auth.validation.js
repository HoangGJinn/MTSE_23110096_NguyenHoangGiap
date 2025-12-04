const { body } = require('express-validator');

// Validation cho đăng ký
const registerValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Tên không được để trống')
        .isLength({ min: 2, max: 50 }).withMessage('Tên phải từ 2-50 ký tự'),
    
    body('email')
        .trim()
        .notEmpty().withMessage('Email không được để trống')
        .isEmail().withMessage('Email không hợp lệ')
        .normalizeEmail(),
    
    body('password')
        .notEmpty().withMessage('Mật khẩu không được để trống')
        .isLength({ min: 6 }).withMessage('Mật khẩu phải có ít nhất 6 ký tự')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Mật khẩu phải chứa chữ hoa, chữ thường và số')
];

// Validation cho đăng nhập
const loginValidation = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email không được để trống')
        .isEmail().withMessage('Email không hợp lệ')
        .normalizeEmail(),
    
    body('password')
        .notEmpty().withMessage('Mật khẩu không được để trống')
];

// Validation cho quên mật khẩu
const forgotPasswordValidation = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email không được để trống')
        .isEmail().withMessage('Email không hợp lệ')
        .normalizeEmail()
];

// Validation cho đặt lại mật khẩu
const resetPasswordValidation = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email không được để trống')
        .isEmail().withMessage('Email không hợp lệ')
        .normalizeEmail(),
    
    body('newPassword')
        .notEmpty().withMessage('Mật khẩu mới không được để trống')
        .isLength({ min: 6 }).withMessage('Mật khẩu phải có ít nhất 6 ký tự')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Mật khẩu phải chứa chữ hoa, chữ thường và số'),
    
    body('confirmPassword')
        .notEmpty().withMessage('Xác nhận mật khẩu không được để trống')
        .custom((value, { req }) => {
            if (value !== req.body.newPassword) {
                throw new Error('Mật khẩu xác nhận không khớp');
            }
            return true;
        })
];

module.exports = {
    registerValidation,
    loginValidation,
    forgotPasswordValidation,
    resetPasswordValidation
};
