// src/validation/schemas/forgot-email.schema.js
import * as Yup from "yup";

export const forgotEmailSchema = Yup.object({
  email: Yup.string()
    .trim()
    .required("Vui lòng nhập email!")
    .email("Email không hợp lệ!")
    .max(100, "Email không được vượt quá 100 ký tự!"),
});
