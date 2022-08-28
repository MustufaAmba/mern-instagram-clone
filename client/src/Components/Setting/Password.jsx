import React, { useState } from 'react'
import { useAuth } from '../../store'
import Spinner from 'react-bootstrap/Spinner';
import { useFormik } from 'formik';
import { passwordSchema } from "../SignIn/signIn.validations"
import { updateUserDetails } from '../../Apis/User/user.apis';
import { toast } from "react-toastify";
import { useOutletContext } from "react-router-dom";
import {
    AiOutlineArrowLeft,
  } from "react-icons/ai";
const Password = () => {
    const [windowSize, setToggleSettings] = useOutletContext();
    const notify = (message, type) => {
        toast[type](message, {
            position: toast.POSITION.TOP_CENTER,
        });
    };
    const formik = useFormik({
        initialValues: {
            password: "",
            newPassword: "",
            confirmNewPassword: ""
        },
        validationSchema: passwordSchema,
        onSubmit: (values) => {
            (async () => {
                try {
                    setShowSpinner(true)
                    const result = await updateUserDetails(auth.userData.userId, { password: values.password, newPassword: values.newPassword })
                    if (result?.status=== 200) {
                        notify(result.data.message, 'success');
                    }
                    else {
                        notify("Your old password is entered incorrectly please enter it again.", 'warning');
                    }
                    formik.setValues({
                        password: '',
                        newPassword: "",
                        confirmNewPassword: ''
                    })
                    setShowSpinner(false)
                }
                catch (error) {
                    notify(error.message, 'error');
                    setShowSpinner(false)
                }
            })()
        }
    })

    const [showSpinner, setShowSpinner] = useState(false)
    const auth = useAuth();
    return (
        <div className="mt-5">
            <div className="row">
            <div className="col-3 text-end fw-bolder d-flex justify-content-end align-items-top">
          { windowSize<=576&&
        <AiOutlineArrowLeft size={30} className="fs-cursor me-2" onClick={()=>setToggleSettings("")}/>
          }

          <img
            className="rounded-circle"
            src={
              auth?.userData?.profileImage?
              auth?.userData?.profileImage
                : process.env.PUBLIC_URL + "/assets/images/profileBtn.png"
            }
            height={`${windowSize<=576?"30px":"40px"}`}
            width={`${windowSize<=576?"30px":"40px"}`}
            alt="profileImage"
          />
        </div>
                <div className="col-8 col-sm-6">
                    <div>
                        <p className="p-0 m-0 fs-5">
                            {auth.userData.userName}
                        </p>
                    </div>
                </div>
            </div>
            <form onSubmit={formik.handleSubmit}>
                <div className="row mt-3">
                    <div className={`col-3 text-end fw-bolder ${windowSize<=576?"fs-small":""}`}>Old password</div>
                    <div className="col-8 col-sm-6">
                        <input
                            type="password"
                            name="password"
                            className="w-100 mb-3 rounded-2 py-2"
                            style={{ border: "1px solid lightgray", background: "#fafafa" }}
                            value={formik.values?.password ? formik.values?.password : ""}
                            onChange={formik.handleChange
                            }
                        />
                          <span className='fs-small text-danger'>{formik.values.password.length > 0 && formik.errors?.password ? formik.errors?.password : ""}</span>
                    </div>
                </div>
                <div className="row">
                    <div className={`col-3 text-end fw-bolder ${windowSize<=576?"fs-small":""}`}>New password</div>
                    <div className="col-8 col-sm-6">
                        <input
                            type="password"
                            name="newPassword"
                            className="w-100 mb-3 rounded-2 py-2"
                            style={{ border: "1px solid lightgray", background: "#fafafa" }}
                            value={formik.values?.newPassword ? formik.values?.newPassword : ""}
                            onChange={formik.handleChange
                            }
                        />
                        <span className='fs-small text-danger'>{formik.values.newPassword.length > 0 && formik.errors?.newPassword ? formik.errors?.newPassword : ""}</span>
                    </div>
                </div>
                <div className="row">
                    <div className={`col-3 text-end fw-bolder ${windowSize<=576?"fs-small":""}`}>Confirm new password</div>
                    <div className="col-8 col-sm-6">
                        <input
                            type="password"
                            name="confirmNewPassword"
                            className="w-100 mb-3 rounded-2 py-2"
                            style={{ border: "1px solid lightgray", background: "#fafafa" }}
                            value={formik.values?.confirmNewPassword ? formik.values?.confirmNewPassword : ""}
                            onChange={formik.handleChange}
                        />
                        <span className='fs-small text-danger'>{formik.values.confirmNewPassword.length > 0 && formik.errors?.confirmNewPassword ? formik.errors?.confirmNewPassword : ""}</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-8 col-sm-6 offset-3">
                        <button className="btn btn-primary mb-5 " type="submit" disabled={formik.values.newPassword&&formik.isValid ? false : true}>
                            {
                                showSpinner &&
                                <Spinner
                                    as="span"
                                    className="me-2"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                />
                            }
                            Change Password
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default Password
