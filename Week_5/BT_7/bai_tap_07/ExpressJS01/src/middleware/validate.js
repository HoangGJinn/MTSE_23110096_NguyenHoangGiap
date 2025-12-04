const { validationResult } = require('express-validator');

// Middleware để kiểm tra kết quả validation
const validate = (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        return res.status(400).json({
            EC: 1,
            EM: 'Validation failed',
            errors: errors.array().map(err => ({
                field: err.path,
                message: err.msg
            }))
        });
    }
    
    next();
};

module.exports = validate;
