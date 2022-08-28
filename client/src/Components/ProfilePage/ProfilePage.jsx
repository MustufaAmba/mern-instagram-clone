import React, { useState, useEffect } from "react";
import Header from "../../CommonComponents/header/Header";
import ProfileInfo from "./ProfileInfo";
import "./profile.styles.css";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import Footer from "../../CommonComponents/footer/Footer"
import { toast } from "react-toastify";
import { getAccountDetails } from "../../Apis/Account/account.apis";
const ProfilePage = () => {
  const params = useParams();
  const navigate= useNavigate()
  const [profileData, setProfileData] = useState([]);
  const notify = (message, type) => {
    toast[type](message, {
      position: toast.POSITION.TOP_CENTER,
    });
  };
  useEffect(() => {
    (async () => {
      try{
        const result = await getAccountDetails(params.userData);
        if (result.status === 200) {
          setProfileData(result.data.data);
        }
        else{
          navigate('/error',{state:{status:result.response.status,message:result.response.data.message}})
        }
      }
      catch(error)
      {
        notify(error.message,'error')
      }
    })();
  }, [params]);
  return (
    <div>
      <Header />
      {profileData.length > 0 ? (
        <ProfileInfo profileData={profileData[0]} />
      ) : (
        <div className="d-flex w-100 justify-content-center">
          <Spinner animation="border" variant="danger" />
        </div>
      )}
      <Footer/>
    </div>
  );
};

export default ProfilePage;
