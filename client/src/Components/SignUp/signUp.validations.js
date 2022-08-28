import * as Yup from "yup";
const signUpSchema = Yup.object({
  mobileNumber: Yup.string()
    .required("required")
    .matches(/^[0-9]{10}$/, "Phone number is not valid")
    .min(10, "to short")
    .max(10, "to long"),
  fullName: Yup.string(),
  userName: Yup.string().required(),
  password: Yup.string().required().min(6, "Password must be at least 6 char"),
  otp: Yup.string().max(6),
});
export default signUpSchema;
