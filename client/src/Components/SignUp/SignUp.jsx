import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import CustomButton from "../../CommonComponents/customButton/CustomButton";
import CustomPasswordField from "../../CommonComponents/customPasswordField/CustomPasswordField";
import CustomTextfield from "../../CommonComponents/customTextField/CustomTextfield";
import Footer from "../../CommonComponents/footer/Footer";
import Modal from "react-bootstrap/Modal";
import "./signUp.styles.css";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  generateDayArray,
  generateYearArray,
  monthArray,
} from "../../mockData";
import signUpSchema from "./signUp.validations";
import {
  addAccount,
  checkUserName,
  generateOtp,
} from "../../Apis/Account/account.apis";
import { useAuth } from "../../store";
import Spinner from "react-bootstrap/Spinner";
const SignUp = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  useEffect(() => {
    if (auth.isLoggedIn()) {
      navigate("/home");
    }
  }, [auth, navigate]);
  const [useUserName, setUseUserName] = useState({
    value: true,
    style: "",
  });
  const [errors, setErrors] = useState("");
  const [age, setAge] = useState(0);
  const [modalShow, setModalShow] = useState(false);
  const [dob, setDob] = useState({
    month: "",
    day: "",
    year: "",
  });
  const formik = useFormik({
    initialValues: {
      mobileNumber: "",
      fullName: "",
      userName: "",
      password: "",
      dob: "",
      otp: "",
    },
    initialErrors: {
      mobileNumber: "mobile number is required",
      fullName: "full name is required",
      userName: "userName is required",
      password: process.env.REACT_APP_PASSWORD_ERROR,
    },
    validationSchema: signUpSchema,
    onSubmit: () => {
      setToggleDobForm(true);
    },
  });
  const [toggleDobForm, setToggleDobForm] = useState(false);
  const [toggleOtpForm, setToggleOtpForm] = useState(false);
  const [showSpinner,setShowSpinner] = useState({
    confirm:false,
    otp:false
  })
  useEffect(() => {
    formik.values.userName.length > 0 &&
      (async () => {
        try {
          const result = await checkUserName(
            formik.values.userName
          );
          if (result?.status === 200) {
            return setUseUserName({ value: true, style: `` });
          }
          formik.values.userName.length !== 0 &&
            setUseUserName({ value: false, style: `is-invalid form-control` });
        }
        catch (error) {
          notify(error.message, 'error')
        }
      })();
  }, [formik.values.userName]);
  const sendOtp = (e) => {
    e.preventDefault();
    (async () => {
      try {
        setShowSpinner(state=>state={...state,otp:true})
        formik.setFieldValue("dob", `${dob.year}-${dob.month}-${dob.day}`);
        await generateOtp({
          ...formik.values,
          loginId: formik.values.mobileNumber,
        });
        setShowSpinner(state=>state={...state,otp:false})
        setToggleOtpForm(true);
      }
      catch (error) {
        notify(error.message, 'error')
      }
    })();
  };
  const notify = (message, type) => {
    toast[type](message, {
      position: toast.POSITION.TOP_CENTER,
    });
  };
  const verifyAndSignUp = (e) => {
    e.preventDefault();
    (async () => {
      try {
        setShowSpinner(state=>state={...state,confirm:true})
        const result = await addAccount(formik.values);
        setShowSpinner(state=>state={...state,confirm:false})
        if (result.status !== 200) {
          return setErrors(result?.response?.data?.message
            ?result?.response?.data?.message
            :"Invalid Otp");
        }
        notify(result.data.message, "success");
        navigate("/")
      }
      catch (error) {
        notify(error.message, 'error')
      }
    })();
  };
  const resendOtp = () => {
    (async () => {
      try {
       const result= await generateOtp({
          ...formik.values,
          loginId: formik.values.mobileNumber,
        });
        if(result.status===200)
        {
          notify("Otp resend successfully","success")
          setErrors("");
          formik.setFieldValue("otp", "");
        }
      }
      catch (error) {
        notify(error.message, 'error')
      }
    })();
  };
  return (
    <div>
      <div className="container p-0 p-sm-2">
        <div className="row mt-sm-4 p-0 p-sm-2">
          <div className="col-12 offset-sm-4 col-sm-6 col-md-5 col-lg-4 d-flex flex-column p-0">
            {toggleOtpForm ? (
              <div className="d-flex px-5 signInForm flex-column justify-content-center align-items-center">
                <img
                  className="mt-2"
                  src={process.env.PUBLIC_URL + "/assets/images/otp.png"}
                  height="90px"
                  width="100px"
                  alt="logo"
                />
                <p className="fw-bolder p-0">Just one more step </p>
                <p className="p-0">
                  Enter the 6-digit code we sent to:{" "}
                  {formik.values.mobileNumber}
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
                    handler={(e) => verifyAndSignUp(e)}
                  > {showSpinner.confirm ?  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />:"Confirm"} </CustomButton>
                </div>
                <div className="d-flex align-items-center justify-content-between gap-2 my-4">
                  <p className="text-primary text-opacity-75 fw-bolder fs-small fs-cursor p-0 m-0">
                    Change Number
                  </p>
                  <p className="p-0 m-0">I</p>
                  <p
                    className="text-primary text-opacity-75 fw-bolder fs-small fs-cursor p-0 m-0"
                    onClick={() => resendOtp()}
                  >
                    Request New Code
                  </p>
                </div>
                <p className="fs-small text-danger     text-center">{errors}</p>
              </div>
            ) : toggleDobForm ? (
              <div className="d-flex px-5 signInForm flex-column justify-content-center align-items-center">
                <img
                  className="mt-5"
                  src={process.env.PUBLIC_URL + "/assets/images/birthDay.png"}
                  height="100px"
                  width="150px"
                  alt="logo"
                />
                <p className="text-dark fw-bolder mt-2">
                  Add your date of birth
                </p>
                <p className="fs-small">
                  This won't be part of your public profile
                </p>
                <p
                  className="fs-small text-primary text-opacity-75"
                  onClick={() => setModalShow(true)}
                >
                  Why do I need to provide date of birth?
                </p>

                <div className="d-flex ">
                  <select
                    className="form-select"
                    value={dob.month}
                    onChange={(e) =>
                      setDob({ ...dob, month: `${e.target.value}` })
                    }
                  >
                    {monthArray.map((data, index) => (
                      <option key={index} value={("0" + index).slice(-2)}>
                        {data}
                      </option>
                    ))}
                  </select>
                  <select
                    className="form-select mx-2"
                    value={dob.day}
                    onChange={(e) =>
                      setDob({ ...dob, day: `${e.target.value}` })
                    }
                  >
                    {generateDayArray().map((data, index) => (
                      <option key={index} value={data}>
                        {data}
                      </option>
                    ))}
                  </select>
                  <select
                    className="form-select"
                    value={dob.year}
                    onChange={(e) => {
                      setDob({ ...dob, year: `${e.target.value}` });
                      setAge(new Date().getFullYear() - e.target.value);
                    }}
                  >
                    {generateYearArray().map((data, index) => (
                      <option key={index} value={data}>
                        {data}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="fs-small text-center mt-2">
                  You need to enter the date you were born on
                </p>
                <p className="fs-small text-center">
                  Use your own date of birth, even if this account is for a
                  business, pet or something else
                </p>
                <CustomButton
                  styles="w-100 mt-2 mb-3"
                  isdisable={dob.month && dob.day && age > 5 ? false : true}
                  handler={(e) => sendOtp(e)}
                >{showSpinner.otp ?  <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />:"Next"} </CustomButton>
                <p
                  className="text-primary fw-bold fs-cursor"
                  onClick={() => setToggleDobForm(false)}
                  text="Go Back"
                >
                  Go Back
                </p>
              </div>
            ) : (
              <div className="d-flex px-5 signInForm flex-column justify-content-center align-items-center">
                <img
                  className="mt-5"
                  src={process.env.PUBLIC_URL + "/assets/images/Logo.png"}
                  height="50px"
                  width="150px"
                  alt="logo"
                />
                <p className="text-center mt-2 fw-bold text-secondary">
                  Sign up to see photos and videos from your friends
                </p>
                <CustomButton
                  styles="my-2 w-100 "
                  text="Log in with Facebook"
                />
                <div className="d-flex align-items-center my-2 w-100">
                  <div className="line"></div>
                  <p className="text-secondary fw-bold m-0 px-4">OR</p>
                  <div className="line"></div>
                </div>
                <form className="w-100 mt-2" onSubmit={formik.handleSubmit}>
                  <div>
                    <CustomTextfield
                      placeholder="Mobile Number"
                      value={formik.values.mobileNumber}
                      formikHandler={formik.handleChange}
                      id="mobileNumber"
                      name="mobileNumber"
                    />
                  </div>
                  <span className="text-danger fs-small">
                    {formik.values.mobileNumber.length > 0 &&
                      formik.errors.mobileNumber}
                  </span>
                  <div>
                    <CustomTextfield
                      styles="my-2"
                      placeholder="Full Name"
                      value={formik.values.fullName}
                      formikHandler={formik.handleChange}
                      id="fullName"
                      name="fullName"
                    />
                    <span className="text-danger fs-small">
                      {formik.values.fullName.length > 0 &&
                        formik.errors.fullName}
                    </span>
                  </div>
                  <div>
                    <CustomTextfield
                      styles={!useUserName.value && useUserName.style}
                      placeholder="userName"
                      value={formik.values.userName}
                      formikHandler={formik.handleChange}
                      id="userName"
                      name="userName"
                    />
                    <span className="text-danger fs-small">
                      {formik.values.userName.length > 0 &&
                        formik.errors.userName}
                    </span>
                  </div>
                  <div>
                    <CustomPasswordField
                      styles="mt-2 is-invalid"
                      className="mt-5"
                      placeholder="Password"
                      value={formik.values.password}
                      formikHandler={formik.handleChange}
                      id="password"
                      name="password"
                    />
                    <span className="text-danger fs-small">
                      {formik.values.password.length > 0 &&
                        formik.errors.password}
                    </span>
                  </div>

                  <p className="p-0 text-center policyText mt-2">
                    People who use our service may have uploaded your contact
                    information to Instagram. Learn more
                  </p>

                  <p className="p-0 text-center policyText">
                    By signing up, you agree to our Terms, Data Policy and
                    Cookie Policy.
                  </p>
                  <CustomButton
                    styles="mt-2 w-100 mb-5"
                    text="Sign Up"
                    isdisable={
                      formik.isValid && useUserName.value ? false : true
                    }
                  />
                </form>
              </div>
            )}
            <div className="d-flex py-4 my-2 signUpSection justify-content-center">
              <p className="m-0">Have an account?</p>
              <NavLink to="/" className="text-decoration-none ps-2">
                {" "}
                Log In
              </NavLink>
            </div>
            <div className="text-center my-3">Get the app</div>
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
                  src={process.env.PUBLIC_URL + "/assets/images/playStore.png"}
                  height="40px"
                  width="130px"
                  alt="playStore"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
      <Modal
        show={modalShow}
        onHide={() => setModalShow(false)}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton className="p-2">
          <div className="d-flex justify-content-center w-100">
            <p className="fw-bold">Birthdays</p>
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex w-100 flex-column align-items-center px-4">
            <img
              src={process.env.PUBLIC_URL + "/assets/images/birthDay.png"}
              height="100px"
              width="150px"
              alt="logo"
            />
            <p className="fw-bolder mt-3">Birthdays on Instagram</p>
            <p className="text-center fs-small">
              Providing your date of birth improves the features and ads that
              you see and helps us keep the Instagram community safe. You can
              find your date of birth in your personal information account
              settings.
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center">
          <p className="text-primary">Learn More</p>
        </Modal.Footer>
      </Modal>
      <Footer />
    </div>
  );
};

export default SignUp;
