import { useFormik } from "formik";
import React from "react";
import { toast } from "react-toastify";
import { changePassword } from "../../Apis/Account/account.apis";
import CustomButton from "../../CommonComponents/customButton/CustomButton";
import CustomPasswordField from "../../CommonComponents/customPasswordField/CustomPasswordField";
import CustomTextfield from "../../CommonComponents/customTextField/CustomTextfield";
import { passwordSchema } from "./signIn.validations";
const PasswordForm = ({ accountData,setTogglePasswordOtpForm,setTogglePasswordForm }) => {
  
  const notify = (message, type) => {
    toast[type](message, {
      position: toast.POSITION.TOP_CENTER,
    });
  };
  const formik = useFormik({
    initialValues: {
      password:process.env.REACT_APP_PASSWORD_ERROR,
      newPassword: "",
      confirmNewPassword: "",
    },
    initialErrors: {
      newPassword: "password is required",
      confirmNewPassword: "confirm password is required",
    },
    validationSchema: passwordSchema,
    onSubmit: (values) => {
      (async () => {
        try {
         const result =  await changePassword({
          newPassword:values.newPassword,
          confirmNewPassword:values.confirmNewPassword,
            accountId: accountData.accountId,
          });
          if(result.status===200)
          {
            notify(result.data.message,'success')
            formik.setValues({
              newPassword: "",
              confirmNewPassword: "",
            })
            setTogglePasswordForm(false)
            setTogglePasswordOtpForm(false)
          }
        }
        catch (error) {
          notify(error.message, 'error')
        }
      })();
    },
  });
  return (
    <div className=" d-flex px-5 signInForm flex-column justify-content-center align-items-center">
      <img
        className="mt-2"
        src={process.env.PUBLIC_URL + "/assets/images/loginOtp.png"}
        height="90px"
        width="100px"
        alt="logo"
      />
      <p className="text-center">One more Step</p>
      <p className="text-center">Enter new password to reset your password</p>
      <form className="w-100" onSubmit={formik.handleSubmit}>
        <div>
          <CustomTextfield
            value={formik.values.newPassword}
            formikHandler={formik.handleChange}
            placeholder="New password"
            id="newPassword"
            name="newPassword"
          />
          <span className="fs-small text-danger">
            {formik.values.newPassword.length > 0 && formik.errors.newPassword}
          </span>
        </div>
        <div>
          <CustomPasswordField
            styles="mt-2"
            className="mt-5"
            placeholder="Confirm new password"
            value={formik.values.confirmNewPassword}
            formikHandler={formik.handleChange}
            id="confirmNewPassword"
            name="confirmNewPassword"
          />
          <span className="fs-small text-danger">
            {formik.values.confirmNewPassword.length > 0 &&
              formik.errors.confirmNewPassword}
          </span>
        </div>
        <CustomButton
          styles="my-3 w-100"
          text="Reset password"
          isdisable={formik.isValid ? false : true}
        />
      </form>
    </div>
  );
};

export default PasswordForm;
