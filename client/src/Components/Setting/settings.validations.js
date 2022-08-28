import * as Yup from "yup"

export const editSchema = Yup.object({
    mobileNumber:Yup.string()
    .required("required")
    .matches(/^[0-9]{10}$/, "Phone number is not valid")
    .min(10, "to short")
    .max(10, "to long"),
    email:Yup.string().email().nullable(true),
    userName:Yup.string().max(30).required(),
    gender:Yup.string().oneOf(['Male','Female','Other',null]).nullable(true)
})