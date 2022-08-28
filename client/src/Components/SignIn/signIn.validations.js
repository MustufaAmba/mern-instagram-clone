import * as Yup from "yup";
const loginSchema = Yup.object({
  loginId: Yup.string().required(),
  password: Yup.string()
    .required("Password cannot be empty")
    .min(6, "Password must be at least 6 char"),
  otp: Yup.string().max(6),
});
const passwordSchema = Yup.object({
  password:Yup.string().required().min(6),
  newPassword: Yup.string().required("Password cannot be empty").min(6,"Password must be at least 6 char"),
  confirmNewPassword: Yup.string().oneOf(
    [Yup.ref("newPassword")],
    "Passwords must match"
  ).required(),
});
export {passwordSchema,loginSchema};
