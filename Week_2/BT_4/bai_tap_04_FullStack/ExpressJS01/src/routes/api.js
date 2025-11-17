const express = require('express');

const { createUser, handleLogin, getUser, getAccount } = require('../controllers/userController');
const auth = require('../middleware/auth');
const delay = require('../middleware/delay');

// Express → ĐỊNH NGHĨA API
// Axios → GỌI API
const routerAPI = express.Router();

routerAPI.post("/register", createUser);
routerAPI.post("/login", handleLogin);



// Áp dụng auth cho tất cả route tiếp theo
routerAPI.use(auth);
// router.get(path, [middleware1], [middleware2], ..., handler)
// Public routes (không cần auth)
routerAPI.get("/", (req, res) => {
  res.status(200).json({ message: "Hello from API" });
});

// Các route cần auth
routerAPI.get("/user", getUser);
// Nếu delay là middleware (req,res,next) thì truyền delay (không gọi)
// Nếu delay là factory (ví dụ delay(3000) trả về middleware) -> dùng delay(3000)
routerAPI.get("/account", delay, getAccount);

module.exports = routerAPI;
