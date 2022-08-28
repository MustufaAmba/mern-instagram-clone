import React, { useState } from "react";
import Spinner from "react-bootstrap/Spinner";
import { toast } from "react-toastify";
import { findAccount, verifyPasswordOtp } from "../../Apis/Account/account.apis";
import CustomButton from "../../CommonComponents/customButton/CustomButton";
import CustomTextfield from "../../CommonComponents/customTextField/CustomTextfield";
import PasswordForm from "./PasswordForm";

const ForgotPassword = ({
  togglePasswordOtpForm,
  setTogglePasswordForm,
  setTogglePasswordOtpForm,
  formik,
}) => {
  const [errors, setErrors] = useState("");
  const [passwordForm, setPasswordForm] = useState(false)
  const [showSpinner,setShowSpinner] = useState({
    otp:false,
    confirm:false
  })
  const [accountData, setAccountData] = useState({
    mobileNumber: "",
    accountId: ""
  })
  const notify = (message, type) => {
    toast[type](message, {
      position: toast.POSITION.TOP_CENTER,
    });
  };
  const findAccountAndSendOtp = () => {
    (async () => {
      try {
        setShowSpinner(state=>state={...state,otp:true})
        const result = await findAccount(formik.values.userName);
        setShowSpinner(state=>state={...state,otp:false})
        if (result.status === 200) {
          setAccountData({
            mobileNumber: result.data.data[0].mobileNumber,
            accountId: result.data.data[0]._id
          })
          setTogglePasswordOtpForm(true)
        } else {
          setErrors("no username found please enter correct username");
        }
      }
      catch (error) {
        notify(error.message, 'error')
      }
    })();
  };
  const resendOtp = () => {
    (async () => {
      try {
        const result = await findAccount(formik.values.userName);
        if (result.status === 200) {
          notify("otp resend successfully","success")
          formik.setFieldValue("forgotPassOtp", "")
        } else {
          setErrors(result.response.data.message);
        }
      }
      catch (error) {
        notify(error.message, 'error')
      }
    })();
  }
  const verifyOtp = () => {
    (async () => {
      try {
        setShowSpinner(state=>state={...state,confirm:true})
        const result = await verifyPasswordOtp({ mobileNumber: accountData.mobileNumber, otp: formik.values.forgotPassOtp });
        setShowSpinner(state=>state={...state,confirm:false})
        if (result.status === 200) {
          setPasswordForm(true)
          setErrors('')
        } else {
          setErrors(result.response.data.message);
        }
      }
      catch (error) {
        notify(error.message, 'error')
      }
    })();
  }
  return (
    <div>
      {passwordForm ? <PasswordForm accountData={accountData}   setTogglePasswordForm={setTogglePasswordForm}
  setTogglePasswordOtpForm={setTogglePasswordOtpForm}/> : !togglePasswordOtpForm ? (
        <div className=" d-flex px-5 signInForm flex-column justify-content-center align-items-center">
          <img
            className="mt-2"
            src={process.env.PUBLIC_URL + "/assets/images/loginOtp.png"}
            height="90px"
            width="100px"
            alt="logo"
          />
          <p className="fw-bolder p-0">password Section </p>
          <p className="p-0 text-center">
            Enter userName we will send otp to confirm
          </p>
          <div className="w-75">
            <CustomTextfield
              styles="mt-2"
              className="mt-5"
              placeholder="username"
              value={formik.values.userName}
              formikHandler={formik.handleChange}
              id="userName"
              name="userName"
            />
            <CustomButton
              styles="w-100 mt-4"
              handler={() => findAccountAndSendOtp()}
              isdisable={formik.values.userName.length>0?false:true}
            >{showSpinner.otp?  <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />:"Confirm"}</CustomButton>
          </div>
          <p className=" mt-5 text-center">
            Back to{" "}
            <span
              className="text-primary text-opacity-75 fs-cursor"
              onClick={() => setTogglePasswordForm(false)}
            >
              Login In
            </span>
          </p>
          <p className="fs-small text-danger mt-2 text-center">{errors}</p>
        </div>
      ) : (
        <div className=" d-flex px-5 signInForm flex-column justify-content-center align-items-center">
          <img
            className="mt-2"
            src={process.env.PUBLIC_URL + "/assets/images/loginOtp.png"}
            height="90px"
            width="100px"
            alt="logo"
          />
          <p className="fw-bolder p-0">Just one more step </p>
          <p className="p-0 text-center">
            Enter the 6-digit code we sent to mobile number registered with this username: {formik.values.loginId}
          </p>
          <div className="w-75">
            <CustomTextfield
              styles="mt-2"
              className="mt-5"
              placeholder="######"
              value={formik.values.forgotPassOtp}
              formikHandler={formik.handleChange}
              id="forgotPassOtp"
              name="forgotPassOtp"
            />
            <CustomButton
              styles="w-100 mt-4"
              isdisable={formik.values.forgotPassOtp.length >= 6 ? false : true}
              handler={() => verifyOtp()}
            >{showSpinner.confirm?  <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />:"Confirm"}</CustomButton>
          </div>
          <p className="fs-small text-center mt-3 mb-5">
            Didn't get a security code? We can
            <span
              className="text-primary text-opacity-75 fs-cursor ps-2 "
              onClick={() => resendOtp()}
            >
              resend it
            </span>
          </p>
          <p className="fs-small text-danger mt-2 text-center">
            {errors}
          </p>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
