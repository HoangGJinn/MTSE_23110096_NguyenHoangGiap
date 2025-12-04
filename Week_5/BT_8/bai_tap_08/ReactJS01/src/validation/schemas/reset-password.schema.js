// src/validation/schemas/reset-password.schema.js
import * as Yup from "yup";

export const resetPasswordSchema = Yup.object({
  newPassword: Yup.string()
    .required("Vui lòng nhập mật khẩu mới!")
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự!")
    .max(50, "Mật khẩu không được vượt quá 50 ký tự!")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Mật khẩu phải có 1 chữ thường, 1 chữ hoa, 1 số"),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Mật khẩu xác nhận không khớp!")
    .required("Vui lòng xác nhận mật khẩu!"),
});
