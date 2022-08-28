import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import {
  getUserByUserName,
  updateUserDetails,
} from "../../Apis/User/user.apis";
import { useAuth } from "../../store";
import Modal from "react-bootstrap/Modal";
import { storage } from "../../firebaseConfig.js";
import {
  AiOutlineArrowLeft,
} from "react-icons/ai";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import Spinner from 'react-bootstrap/Spinner';
import { toast } from "react-toastify";
import { useFormik } from "formik"
import { editSchema } from "./settings.validations";
import { checkUserName } from "../../Apis/Account/account.apis";
import { useNavigate } from "react-router-dom";
const Edit = () => {
  const auth = useAuth();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [updateUser, setUpdateUser] = useState(false);
  const [showGenderModal, setShowGenderModal] = useState(false)
  const [showSpinner, setShowSpinner] = useState(false)
  const notify = (message, type) => {
    toast[type](message, {
      position: toast.POSITION.TOP_CENTER,
    });
  };
  const navigate = useNavigate()
  const [windowSize, setToggleSettings] = useOutletContext();
  const formik = useFormik({
    initialValue: {
      fullName: "",
      userName: "",
      website: "",
      bio: "",
      email: "",
      mobileNumber: "",
      Gender: "",
      profileImage: ""
    },
    validationSchema: editSchema,
    onSubmit: (values) => {
      (async () => {
        try {
          setShowSpinner(true)
          const result = await updateUserDetails(auth.userData.userId, values);
          if (result.status === 200) {
            setShowSpinner(false)
            notify("user details updated", "success");
          }
        }
        catch (error) {
          notify(error.message, "error")
          setShowSpinner(false)
        }

      })();
    }
  })
  useEffect(() => {
    (async () => {
      try {
        const result = await getUserByUserName(auth.userData?.userName);
        if (result.status === 200) {
          delete result.data.data[0].id;
          formik.setValues({ ...result.data.data[0] })
        }
        else{
          auth.handleErrorToken(result?.response?.status)
          navigate("/error", {
            state: {
              status: result.response.status,
              message: result.response.data.message,
            },
          });
        }
      }
      catch (error) {
        notify(error.message, "error")
      }
    })();
  }, []);
  useEffect(() => {
    formik.values?.userName.length > 0 &&
      (async () => {
        try {
          const result = await checkUserName(
            formik.values?.userName
          );
          if (result?.response?.status === 406) {
            return formik.values.userName !== auth.userData.userName && formik.setFieldError('userName', 'userName exists please select a different userName')
          }
        }
        catch (error) {
          notify(error.message, 'error')
        }
      })();
  }, [formik.values?.userName]);
  useEffect(() => {
    updateUser &&
      (async () => {
        try {
          const result = await updateUserDetails(auth.userData.userId,);
          if (result.status === 200) {
            auth.setUserData(
              (state) =>
              (state = {
                ...state,
                profileImage: result.data.data.profileImage,
              })
            );
            const userData = JSON.parse(localStorage.getItem("userData"));
            localStorage.setItem(
              "userData",
              JSON.stringify({
                ...userData,
                profileImage: result.data.data.profileImage,
              })
            );
            notify("profile photo updated", 'success');
          }
          setUpdateUser(false);
        }
        catch (error) {
          notify(error.message, 'error')
          setUpdateUser(false);
        }
      })();
  }, [updateUser]);
  const uploadImage = (e) => {
    const file = e.target.files[0];
    const metadata = {
      contentType: file.type,
    };
    const storageRef = ref(storage, `${auth.userData.userName}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file, metadata);
    uploadTask.on(
      "state_changed",
      (snapshot) => { },
      (error) => {
        notify(error.message,'error')
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          formik.setFieldValue('profileImage', downloadURL)
          setUpdateUser(true);
          setShowProfileModal(false);
        });
      }
    );
  };

  const removeProfile = () => {
    const deleteRef = ref(storage, formik.values.profileImage)
    deleteObject(deleteRef)
      .then(() => {
        setUpdateUser(true);
        formik.setFieldValue('profileImage', "")
        // setFormData((state) => (state = { ...state, profileImage: "" }))
      })
      .catch((error) => {
        notify(error.message,'error')
      });

  }
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
              formik.values?.profileImage
                ? formik.values?.profileImage
                : process.env.PUBLIC_URL + "/assets/images/profileBtn.png"
            }
            height={`${windowSize<=576?"30px":"40px"}`}
            width={`${windowSize<=576?"30px":"40px"}`}
            alt="profileImage"
          />
        </div>
        <div className="col-6">
          <div>
            <p className="p-0 m-0 fs-5 ">
              {auth.userData.userName}
            </p>
            <p
              className="fw-bolder text-primary text-opacity-75 fs-cursor p-0 mb-3"
              onClick={() => setShowProfileModal(true)}
            >
              change profile photo
            </p>
          </div>
        </div>
      </div>
      <form onSubmit={formik.handleSubmit}>
        <div className="row">
          <div className={`col-3 text-end fw-bolder ${windowSize<=576?"fs-small":""}`}>Name</div>
          <div className="col-8 col-sm-6">
            <input
              type="text"
              className="w-100 mb-3 rounded-2 py-1"
              style={{ border: "1px solid lightgray" }}
              name="fullName"
              value={formik.values?.fullName ? formik.values?.fullName : ""}
              onChange={formik.handleChange}
              placeholder="Name"
            />
          </div>
        </div>
        <div className="row">
          <div className={`col-3 text-end fw-bolder ${windowSize<=576?"fs-small":""}`}>Username</div>
          <div className="col-8 col-sm-6 mb-3">
            <input
              type="text"
              className="w-100 rounded-2 py-1"
              style={{ border: "1px solid lightgray" }}
              name="userName"
              value={formik.values?.userName ? formik.values?.userName : ""}
              onChange={formik.handleChange}
              placeholder="userName"
            />
            <span className="fs-small text-danger">{formik.errors?.userName ? formik.errors?.userName : ""}</span>
          </div>

        </div>
        <div className="row">
          <div className={`col-3 text-end fw-bolder ${windowSize<=576?"fs-small":""}`}>Website</div>
          <div className="col-6">
            <input
              type="text"
              className="w-100 mb-3 rounded-2 py-1"
              style={{ border: "1px solid lightgray" }}
              name="website"
              value={formik.values?.website ? formik.values?.website : null}
              onChange={formik.handleChange}
              placeholder="Website"
            />
          </div>
        </div>
        <div className="row">
          <div className={`col-3 text-end fw-bolder ${windowSize<=576?"fs-small":""}`}>Bio</div>
          <div className="col-6">
            <textarea
              className="w-100 mb-3 rounded-2 py-1"
              style={{ border: "1px solid lightgray" }}
              row="2"
              name="bio"
              value={formik.values?.bio ? formik.values?.bio : ""}
              onChange={formik.handleChange}
              placeholder="Bio"
            />
          </div>
        </div>
        <div className="row">
          <div className={`col-3 text-end fw-bolder ${windowSize<=576?"fs-small":""}`}>Email Address</div>
          <div className="col-8 col-sm-6 mb-3">
            <input
              type="text"
              className="w-100 rounded-2 py-1"
              style={{ border: "1px solid lightgray" }}
              value={formik.values?.email ? formik.values?.email : ""}
              name="email"
              onChange={formik.handleChange}
              placeholder="Email"
            />
            <span className="fs-small text-danger">{formik.errors.email ? formik.errors.email : ""}</span>
          </div>
        </div>
        <div className="row">
          <div className={`col-3 text-end fw-bolder ${windowSize<=576?"fs-small":""}`}>Phone Number</div>
          <div className="col-8 col-sm-6 mb-3">
            <input
              type="text"
              className="w-100  rounded-2 py-1"
              style={{ border: "1px solid lightgray" }}
              value={formik.values?.mobileNumber ? formik.values?.mobileNumber : ""}
              name="mobileNumber"
              onChange={formik.handleChange}
              placeholder="Phone Number"
            />
            <span className="fs-small text-danger">{formik.errors.mobileNumber ? formik.errors.mobileNumber : ""}</span>
          </div>
        </div>
        <div className="row">
          <div className={`col-3 text-end fw-bolder ${windowSize<=576?"fs-small":""}`}>Gender</div>
          <div className="col-6">
            <input
              type="text"
              className="w-100 mb-3 rounded-2 py-1"
              style={{ border: "1px solid lightgray" }}
              value={formik.values?.gender ? formik.values?.gender : "Prefer not to say"}
              onChange={() => { }}
              onClick={() => setShowGenderModal(true)}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-8 col-sm-6 offset-3">
            <button type="submit" className="btn btn-primary mb-5" disabled={formik.isValid ? false : true}>
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
              Submit
            </button>
          </div>
        </div>
      </form>
      <Modal
        show={showProfileModal}
        onHide={() => setShowProfileModal(false)}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header className="d-flex justify-content-center w-100">
          <p className="fw-bolder p-0 m-0 my-3">Change profile photo</p>
        </Modal.Header>
        <Modal.Body className="p-0">
          <input
            type="file"
            id="profilePhoto"
            className="d-none"
            onChange={(e) => uploadImage(e)}
          />
          <label
            htmlFor="profilePhoto"
            className="w-100 border-top border-bottom py-3 text-primary text-opacity-75 fs-cursor text-center"
          >
            Upload Photo
          </label>
          <div
            className="w-100 border-top border-bottom py-3 text-danger fs-cursor text-center"
            onClick={() => removeProfile()}
          >
            Remove current photo
          </div>
          <div
            className="w-100 border-top py-3 fs-cursor text-center"
            onClick={() => setShowProfileModal(false)}
          >
            Cancel
          </div>
        </Modal.Body>
      </Modal>
      <Modal
        show={showGenderModal}
        onHide={() => setShowGenderModal(false)}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header className="d-flex justify-content-center w-100">
          <p className="fw-bolder m-0">Gender</p>
        </Modal.Header>
        <Modal.Body>
          <div className="form-check">
            <input className="form-check-input" type="radio" name="gender" id="Male" value="Male" checked={formik.values?.gender === "Male"} onChange={formik.handleChange} />
            <label className="form-check-label" htmlFor="Male">
              Male
            </label>
          </div>
          <div className="form-check">
            <input className="form-check-input" type="radio" name="gender" id="Female" value="Female" checked={formik.values?.gender === "Female"} onChange={formik.handleChange} />
            <label className="form-check-label" htmlFor="Female">
              Female
            </label>
          </div>
          <div className="form-check">
            <input className="form-check-input" type="radio" name="gender" id="Other" value="Other" checked={formik.values?.gender === "Other"} onChange={formik.handleChange} />
            <label className="form-check-label" htmlFor="Other">
              Other
            </label>
          </div>
          <div className="form-check">
            <input className="form-check-input" type="radio" name="gender" id="null" value="Prefer not to say" checked={formik.values?.gender === null} onChange={() => formik.setFieldValue('gender', null)} />
            <label className="form-check-label" htmlFor="null">
              Prefer not to say
            </label>
          </div>
          <button className="btn btn-primary w-100 mt-3" onClick={() => setShowGenderModal(false)}>Done</button>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Edit;
