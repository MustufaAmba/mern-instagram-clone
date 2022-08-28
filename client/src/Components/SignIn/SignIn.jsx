import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import { NavLink, useNavigate } from "react-router-dom";
import {
  generateOtp,
  loginUser,
  verifyOtp,
} from "../../Apis/Account/account.apis";
import CustomButton from "../../CommonComponents/customButton/CustomButton";
import CustomPasswordField from "../../CommonComponents/customPasswordField/CustomPasswordField";
import CustomTextfield from "../../CommonComponents/customTextField/CustomTextfield";
import { loginSchema } from "./signIn.validations.js";
import "./signIn.styles.css";
import { useAuth } from "../../store";
import ForgotPassword from "./ForgotPassword";
import { toast } from "react-toastify";
import Spinner from "react-bootstrap/Spinner";
const SignIn = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  useEffect(() => {
    if (auth.isLoggedIn()) {
      navigate("/home");
    }
  }, [auth, navigate]);
  const [toggleOtpForm, setToggleOtpForm] = useState(false);
  const [togglePasswordForm, setTogglePasswordForm] = useState(false);
  const [togglePasswordOtpForm, setTogglePasswordOtpForm] = useState(false)
  const [showSpinner,setShowSpinner] = useState({
    otp:false,
    confirm:false,
  })
  const [errors, setErrors] = useState("");
  const notify = (message, type) => {
    toast[type](message, {
      position: toast.POSITION.TOP_CENTER,
    });
  };
  const formik = useFormik({
    initialValues: {
      loginId: "",
      password: "",
      otp: "",
      userName: "",
      forgotPassOtp: ""
    },
    initialErrors: {
      loginId: "loginId is required",
      password: process.env.REACT_APP_PASSWORD_ERROR,
    },
    validationSchema: loginSchema,
    onSubmit: (values) => {
      (async () => {
        try {
          setShowSpinner(state=>state={...state,otp:true})
          const result = await loginUser({ loginId: values.loginId, password: values.password });
          setShowSpinner(state=>state={...state,otp:false})
          if (result.status !== 200) { 
            return setErrors("Username or Password is invalid");
          }
          setErrors("");
          setToggleOtpForm(true);
          (async () => {
            await generateOtp({ loginId: values.loginId, password: values.password });
          })();
        }
        catch (error) {
          notify(error.message,'error')
        }
      })();
    },
  });
  const resendOtp = (data) => {
    (async () => {
      try{
        await generateOtp(data);
        notify("New otp send successfully","success")
        setErrors("");
        formik.setFieldValue("otp", "");
      }
      catch (error) {
        notify(error.message,'error')
      }
    })();
  };
  const verifyAndLogIn = (data) => {
    (async () => {
      setShowSpinner(state=>state={...state,confirm:true})
      const result = await verifyOtp(data);
      setShowSpinner(state=>state={...state,confirm:false})
      if (result.status === 200) {
        localStorage.setItem("Token", result.headers["x-auth-token"]);
        auth.provideToken(result.headers["x-auth-token"]);
        localStorage.setItem("userData", JSON.stringify(result.data.data));
        auth.saveUserData(result.data.data);
        return;
      }
      setErrors(result?.response?.data?.message?
        result?.response?.data?.message:"Invalid otp" );
    })();
  };
  const { loginId: loginError, password: passwordError } = formik.errors;
  return (
    <div>
      <div className="container p-0 p-sm-2">
        <div className="row mt-sm-5 p-0 p-sm-2">
          <div className="col-lg-6 me-5 d-none d-lg-block">
            <img
              className="offset-6"
              src={
                process.env.PUBLIC_URL + "/assets/images/signIn_background.png"
              }
              height="100%"
              width="50%"
              alt="logo"
            />
          </div>
          <div className="col-12 col-sm-9 col-lg-4  d-flex flex-column">
            <div className="offset-sm-3 offset-lg-0">
              {togglePasswordForm ? (
                <ForgotPassword formik={formik} setTogglePasswordForm={setTogglePasswordForm} togglePasswordOtpForm={togglePasswordOtpForm} setTogglePasswordOtpForm={setTogglePasswordOtpForm} />
              ) : toggleOtpForm ? (
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
                    Enter the 6-digit code we sent to: {formik.values.loginId}
                  </p>
                  <div className="w-75">
                    <CustomTextfield
                      styles="mt-2"
                      className="mt-5"
                      placeholder="######"
                      value={formik.values.otp}
                      formikHandler={formik.handleChange}
                      id="otp"
                      name="otp"
                    />
                    <CustomButton
                      styles="w-100 mt-4"
                      isdisable={formik.values.otp.length >= 6 ? false : true}
                      handler={() => verifyAndLogIn({ loginId: formik.values.loginId, password: formik.values.password, otp: formik.values.otp })}
                    >{showSpinner.confirm ?  <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />:"Confirm"} </CustomButton>
                  </div>
                  <p className="fs-small text-center mt-3 mb-5">
                    Didn't get a security code? We can
                    <span
                      className="text-primary text-opacity-75 fs-cursor ps-2 "
                      onClick={() => resendOtp({ loginId: formik.values.loginId, password: formik.values.password })}
                    >
                      resend it
                    </span>
                  </p>
                  <p className="fs-small text-danger mt-2 text-center">
                    {errors}
                  </p>
                </div>
              ) : (
                <div className=" d-flex px-5 signInForm flex-column justify-content-center align-items-center">
                  <img
                    className="my-5"
                    src={process.env.PUBLIC_URL + "/assets/images/Logo.png"}
                    height="50px"
                    width="150px"
                    alt="logo"
                  />
                  <form className="w-100" onSubmit={formik.handleSubmit}>
                    <CustomTextfield
                      value={formik.values.loginId}
                      formikHandler={formik.handleChange}
                      placeholder="username"
                      id="loginId"
                      name="loginId"
                    />
                    <CustomPasswordField
                      styles="mt-2"
                      className="mt-5"
                      placeholder="Password"
                      value={formik.values.password}
                      formikHandler={formik.handleChange}
                      id="password"
                      name="password"
                    />
                    <CustomButton
                      styles="mt-3 w-100"
                      isdisable={loginError || passwordError ? true : false}
                    >{showSpinner.otp ?  <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />:"Log In"} </CustomButton>
                  </form>
                  <div className="d-flex align-items-center mt-3 w-100 justify-content-center">
                    <div className="line "></div>
                    <p className="text-secondary fw-bold m-0 px-4">OR</p>

                    <div className="line "></div>
                  </div>
                  <p className="mt-4 text-primary text-decoration-none fs-cursor p-0">
                    Login with Facebook
                  </p>
                  <p className="fs-small text-danger mt-2 text-center fs-cursor p-0">
                    {errors}
                  </p>
                  <p
                    className=" mb-4 text-primary  text-decoration-none fs-cursor text-center"
                    onClick={() => setTogglePasswordForm(true)}
                  >
                    Forgotten your password?
                  </p>
                </div>
              )}

              <div className="d-flex py-4 my-2 signUpSection justify-content-center">
                <p className="m-0">Don't have an account?</p>
                <NavLink to="/signUp" className="text-decoration-none ps-2">
                  {" "}
                  Sign up
                </NavLink>
              </div>
              <div className="text-center fs-6">Get the app</div>
              <div className="d-flex mt-3 justify-content-center gap-2">
                <a
                  href="https://apps.apple.com/us/app/instagram/id389801252"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    src={process.env.PUBLIC_URL + "/assets/images/appStore.png"}
                    height="40px"
                    width="130px"
                    alt="appStore"
                  />
                </a>

                <a
                  href="https://play.google.com/store/apps/details?id=com.instagram.android&hl=en_IN&gl=US"
                  target="_blank"
                  rel="noreferrer"
                >
                  {" "}
                  <img
                    src={
                      process.env.PUBLIC_URL + "/assets/images/playStore.png"
                    }
                    height="40px"
                    width="130px"
                    alt="playStore"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
