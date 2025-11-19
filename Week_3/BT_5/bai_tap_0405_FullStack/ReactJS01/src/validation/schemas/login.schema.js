// src/validation/schemas/login.schema.js
import * as Yup from "yup";

export const loginSchema = Yup.object({
  email: Yup.string()
    .trim()
    .required("Vui lòng nhập email!")
    .email("Email không hợp lệ!")
    .max(100, "Email không được vượt quá 100 ký tự!"),

  password: Yup.string()
    .required("Vui lòng nhập mật khẩu!")
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự!")
    .max(100, "Mật khẩu không được vượt quá 100 ký tự!"),
});
