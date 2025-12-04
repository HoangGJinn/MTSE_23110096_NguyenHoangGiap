// src/validation/schemas/register.schema.js
import * as Yup from "yup";

export const registerSchema = Yup.object({
  email: Yup.string()
    .trim()
    .required("Vui lòng nhập email!")
    .email("Email không hợp lệ!")
    .max(100, "Email không được vượt quá 100 ký tự!"),

  name: Yup.string()
    .matches(/^[a-zA-Z\u00C0-\u1EF9\s]+$/, "Tên chỉ được chứa chữ cái")
    .min(2, "Tên phải có ít nhất 2 ký tự!")
    .max(50, "Tên không được vượt quá 50 ký tự!")
    .required("Vui lòng nhập họ tên!"),

  phone: Yup.string()
    .matches(/^(0|\+84)[0-9]{9}$/, "Số điện thoại không hợp lệ!")
    .required("Vui lòng nhập số điện thoại!"),

  password: Yup.string()
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự!")
    .max(50, "Mật khẩu không được vượt quá 50 ký tự!")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Mật khẩu phải có 1 chữ thường, 1 chữ hoa, 1 số")
    .required("Vui lòng nhập mật khẩu!"),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Xác nhận mật khẩu không khớp!")
    .required("Vui lòng xác nhận mật khẩu!"),
});
