const express = require("express");
const router = express.Router();
const Joi = require("joi");
const validateRequest = require("_middleware/validate-request");
const authService = require("../service/auth.service");

// Định nghĩa các route
router.post("/login", loginSchema, login); // Route xử lý đăng nhập
router.post("/signup", signupSchema, signup); // Route xử lý đăng ký

module.exports = router;

// Hàm xử lý route
function login(req, res, next) {
  authService
    .login(req.body) // Gọi hàm login từ authService với dữ liệu từ body request
    .then((user) => res.json(user)) // Trả về thông tin user nếu đăng nhập thành công
    .catch(next); // Bắt lỗi nếu có
}

function signup(req, res, next) {
  authService
    .signup(req.body) // Gọi hàm signup từ authService với dữ liệu từ body request
    .then(() => res.json({ message: "Signup successful" })) // Trả về thông báo thành công nếu đăng ký thành công
    .catch(next); // Bắt lỗi nếu có
}

// Hàm xác thực dữ liệu đầu vào
function loginSchema(req, res, next) {
  const schema = Joi.object({
    email: Joi.string().email().required(), // Kiểm tra email hợp lệ và bắt buộc phải có
    password: Joi.string().min(6).required(), // Kiểm tra password có tối thiểu 6 ký tự và bắt buộc phải có
  });
  validateRequest(req, next, schema); // Gọi middleware validateRequest để xác thực schema
}

function signupSchema(req, res, next) {
  const schema = Joi.object({
    username: Joi.string().required(), // Kiểm tra username và bắt buộc phải có
    email: Joi.string().email().required(), // Kiểm tra email hợp lệ và bắt buộc phải có
    password: Joi.string().min(6).required(), // Kiểm tra password có tối thiểu 6 ký tự và bắt buộc phải có
  });
  validateRequest(req, next, schema); // Gọi middleware validateRequest để xác thực schema
}
