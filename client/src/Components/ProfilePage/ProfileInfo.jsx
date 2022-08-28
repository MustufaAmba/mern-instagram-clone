import React, { useState, useEffect } from "react";
import { useAuth } from "../../store";
import {
  followUser,
  getAllFollowers,
  getAllFollowings,
  unFollowUser,
} from "../../Apis/User/user.apis";
import FollowModals from "./FollowModals";
import ProfilePosts from "./ProfilePosts";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const ProfileInfo = ({ profileData }) => {
  const notify = (message, type) => {
    toast[type](message, {
      position: toast.POSITION.TOP_CENTER,
    });
  };
  const auth = useAuth();
  const navigate = useNavigate();
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [showFollowerModal, setShowFollowerModal] = useState(false);
  const [followingList, setFollowingList] = useState([]);
  const [followerList, setFollowerList] = useState([]);
  const userId = auth.userData.userId;
  const [changePosition, setChangePosition] = useState("top");
  const { pathname } = useLocation();
  const [requestStatus, setRequestStatus] = useState("");
  useEffect(() => {
    window.addEventListener("resize", () => {
      window.innerWidth <= 576
        ? setChangePosition("bottom")
        : setChangePosition("top");
    });
    const checkPendingRequest = profileData?.currentFollowRequest.filter(
      (request) =>
        request.targetId === userId && request.status === "inProgress"
    );
    if (checkPendingRequest.length > 0) {
      setRequestStatus("requested");
    } else {
      setRequestStatus(
        profileData?.followers.includes(userId) ? "unfollow" : "follow"
      );
    }
  }, [profileData]);
  useEffect(() => {
    showFollowingModal &&
      (async () => {
        try {
          const result = await getAllFollowings(
            profileData?.userId === userId ? userId : profileData?.userId
          );
          if (result.status === 200) {
            setFollowingList(result.data.data[0].virtualFollowing);
          } else {
            navigate("/error", {
              state: {
                status: result.response.status,
                message: result.response.data.message,
              },
            });
          }
        } catch (error) {
          notify(error.message, "error");
        }
      })();
  }, [userId, showFollowingModal]);
  useEffect(() => {
    showFollowerModal &&
      (async () => {
        try {
          const result = await getAllFollowers(
            profileData?.userId === userId ? userId : profileData?.userId
          );
          if (result.status === 200) {
            setFollowerList(result.data.data[0].virtualFollower);
          } else {
            navigate("/error", {
              state: {
                status: result.response.status,
                message: result.response.data.message,
              },
            });
          }
        } catch (error) {
          notify(error.message, "error");
        }
      })();
  }, [userId, showFollowerModal]);
  const handleFollowClick = (e) => {
    (async () => {
      try {
        const result =
          requestStatus === "follow"
            ? await followUser({
                userId,
                targetId: parseInt(e.target.id),
              })
            : await unFollowUser({
                userId,
                targetId: parseInt(e.target.id),
              });
        if (result.status === 200) {
          notify(result.data.message, "success");
          setRequestStatus(result.data.status);
        } else {
          navigate("/error", {
            state: {
              status: result.response.status,
              message: result.response.data.message,
            },
          });
        }
      } catch (error) {
        notify(error.message, "error");
      }
    })();
  };
  return (
    <div>
      <div className="container-fluid mt-5 pt-4">
        <div className="container-lg d-block ">
          <div className="d-flex d-flex justify-content-start justify-content-starts align-items-start">
            <div className="mt-4">
              <img
                src={
                  profileData?.profileImage
                    ? profileData.profileImage
                    : process.env.PUBLIC_URL + "/assets/images/profileBtn.png"
                }
                height="150px"
                width="150px"
                className="rounded-circle profileImageStyles"
                alt="profileImage"
              />
            </div>
            <div style={{ width: "fit-content" }}>
              <div className="ps-0 ps-sm-4 ms-sm-4 ps-lg-5 ms-0 ms-lg-5 ">
                <div className="d-flex flex-column flex-sm-row align-items-center gap-3 gap-sm-5  mt-3 ms-4 ms-sm-0">
                  <p className="fs-2 p-0 m-0">{profileData?.userName}</p>
                  {profileData?.userId === userId ? (
                    <button
                      className="btn btn-outline-dark"
                      onClick={() => navigate("/account/edit")}
                    >
                      Edit profile
                    </button>
                  ) : requestStatus === "requested" ? (
                    <button
                      className="btn btn-outline-dark"
                      onClick={() => navigate("/account/edit")}
                    >
                      requested
                    </button>
                  ) : requestStatus === "unfollow" ? (
                    <button
                      className="btn btn-primary px-4"
                      id={profileData?.userId}
                      onClick={(e) => handleFollowClick(e)}
                    >
                      Unfollow
                    </button>
                  ) : (
                    <button
                      className="btn btn-primary px-4"
                      id={profileData?.userId}
                      onClick={(e) => handleFollowClick(e)}
                    >
                      Follow
                    </button>
                  )}
                </div>
                {changePosition === "top" && (
                  <>
                    <div className="d-flex align-items-center gap-5 mt-4">
                      <p className="fw-bolder  p-0 m-0 ">
                        {profileData?.posts.length}{" "}
                        <span className="fw-light">Posts</span>
                      </p>

                      <p
                        className="fw-bolder p-0 m-0 fs-cursor"
                        onClick={() => setShowFollowerModal(true)}
                      >
                        {profileData?.followers.length}{" "}
                        <span className="fw-light">Followers</span>
                      </p>
                      <p
                        className="fw-bolder  p-0 m-0 fs-cursor"
                        onClick={() => setShowFollowingModal(true)}
                      >
                        {profileData?.following.length}{" "}
                        <span className="fw-light">Following</span>
                      </p>
                    </div>
                    <p className="fs-4 mt-3">{profileData?.fullName}</p>
                    <p className="mt-2 " style={{ maxWidth: "600px" }}>
                      {profileData?.bio
                        ? profileData.bio
                        : ""}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="row mt-4">
            <div>
              {changePosition === "bottom" && (
                <>
                  <p className="fs-4 mt-3">{profileData?.fullName}</p>
                  <p className="mt-2 " style={{ maxWidth: "600px" }}>
                    {profileData?.bio
                      ? profileData.bio
                      : ""}
                  </p>
                  <div className="d-flex justify-content-center align-items-center gap-5 mt-4 ">
                    <p className="fw-bolder  p-0 m-0 ">
                      {profileData?.posts.length}{" "}
                      <span className="fw-light">Posts</span>
                    </p>

                    <p
                      className="fw-bolder p-0 m-0 fs-cursor"
                      onClick={() => setShowFollowerModal(true)}
                    >
                      {profileData?.followers.length}{" "}
                      <span className="fw-light">Followers</span>
                    </p>
                    <p
                      className="fw-bolder  p-0 m-0 fs-cursor"
                      onClick={() => setShowFollowingModal(true)}
                    >
                      {profileData?.following.length}{" "}
                      <span className="fw-light">Following</span>
                    </p>
                  </div>
                </>
              )}
              {profileData.isPrivate &&
              !profileData.followers.includes(userId) &&
              profileData.userId !== userId ? (
                <div className="container-fluid mt-2">
                  <div className="hiddenPostStyles text-center py-5 container-lg">
                    <p>This account is private</p>
                    <p className="p-0 m-0 ">
                      Follow to see their photos and videos.
                    </p>
                  </div>
                </div>
              ) : (
                <ProfilePosts
                  posts={
                    pathname.includes("saved")
                      ? profileData?.virtualSavedPosts
                      : profileData?.virtualPosts
                  }
                  isActive={pathname.includes("saved") ? "saved" : "Posts"}
                  currentUserName={profileData?.userName}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <FollowModals
        showFollowModal={showFollowingModal}
        setShowFollowModal={setShowFollowingModal}
        followList={followingList}
        setFollowList={setFollowingList}
      />
      <FollowModals
        showFollowModal={showFollowerModal}
        setShowFollowModal={setShowFollowerModal}
        followList={followerList}
        setFollowList={setFollowerList}
      />
    </div>
  );
};

export default ProfileInfo;
