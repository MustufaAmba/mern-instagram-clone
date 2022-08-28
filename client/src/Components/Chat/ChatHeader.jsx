import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { IoIosArrowDown } from "react-icons/io";
import { createNewChat } from "../../Apis/Chat/chat.apis";
import { getAllFollowings } from "../../Apis/User/user.apis";
import { useAuth } from "../../store";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import SwitchAccount from "../SwitchAccount/SwitchAccount";
const ChatHeader = ({ setAllChats }) => {
  const [openSwitchModal, setOpenSwitchModal] = useState(false);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [followingData, setFollowingData] = useState([]);
  const [userIds, setUserIds] = useState({});
  const [filteredFollowing, setFilteredFollowing] = useState([]);
  const [searchUser, setSearchUser] = useState("");
  const [toggleNextBtn, setToggleNextBtn] = useState(true);
  const auth = useAuth();
  const userId = auth.userData.userId;
  const navigate = useNavigate();
  const notify = (message, type) => {
    toast[type](message, {
      position: toast.POSITION.TOP_CENTER,
    });
  };
  useEffect(() => {
    showNewChatModal &&
      (async () => {
        try {
          const result = await getAllFollowings(userId);
          if (result.status === 200) {
            setFollowingData(result.data.data);
            setFilteredFollowing(result.data.data);
          } else {
            navigate("/error", {
              state: {
                error: result.response.status,
                message: result.response.message,
              },
            });
          }
        } catch (error) {
          notify(error.message, "error");
        }
      })();
  }, [showNewChatModal]);
  useEffect(() => {
    searchUser.length > 0 &&
      setFilteredFollowing(
        (state) =>
          (state = [
            {
              ...state,
              virtualFollowing: followingData[0]?.virtualFollowing.filter(
                (data) => data.userName.includes(searchUser)
              ),
            },
          ])
      );
  }, [searchUser]);
  useEffect(() => {
    for (let x in userIds) {
      if (userIds[x].status) {
        setToggleNextBtn(false);
        return;
      }
      setToggleNextBtn(true);
    }
  }, [userIds]);
  const handleChange = (e) => {
    e.stopPropagation();
    const target = e.target;
    const value = target.type === "checkbox" && target.checked;
    const name = target.name;
    if (target.id) {
      const data = {
        status: value,
        userName: target.getAttribute("data-username"),
      };
      setUserIds(
        (state) =>
          (state = {
            ...state,
            [name]: data,
          })
      );
    }
  };
  const handleCreateNewChat = async () => {
    try {
      const temp = [userId];
      Object.keys(userIds).forEach((data) => {
        userIds[data].status && temp.push(parseInt(data));
      });
      const result = await createNewChat({
        userId,
        userIds: temp,
        isGroup: temp.length > 2 ? true : false,
      });
      if (result.status === 200) {
        notify(result.data.message, "success");
        if (result.data.data.length > 0) {
          setAllChats(
            (state) => (state = [{ ...result.data.data[0] }, ...state])
          );
        }
        setUserIds({});
        setFollowingData([]);
        setSearchUser("");
        setToggleNextBtn(true);
        setFilteredFollowing([]);
        setShowNewChatModal(false);
      } else {
        navigate("/error", {
          state: {
            error: result.response.status,
            message: result.response.message,
          },
        });
      }
    } catch (error) {
      notify(error.message, "error");
    }
  };
  return (
    <div className="w-100 d-flex align-items-center border border-bottom-dark py-4 px-4">
      <div className="flex-grow-1 text-center fs-cursor fw-bolder">
        <span
          onClick={() => {
            setOpenSwitchModal(true);
          }}
        >
          {auth.userData.userName}
          <IoIosArrowDown size={20} />
        </span>
      </div>
      <div>
        <img
          className="fs-cursor"
          src={process.env.PUBLIC_URL + "/assets/images/NewMessages.png"}
          height="25px"
          width="25px"
          alt="newMessage"
          onClick={() => setShowNewChatModal(true)}
        />
      </div>
      <Modal
        show={showNewChatModal}
        onHide={() => {
          setShowNewChatModal(false);
          setUserIds({});
        }}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header className="p-0 px-3">
          <div className="d-flex justify-content-between align-items-center w-100">
            <p
              className="p-0 m-0 fs-1 fs-cursor"
              onClick={() => setShowNewChatModal(false)}
            >
              &times;
            </p>
            <p className="p-0 m-0 ">New Message</p>
            <button
              className={` btn  text-primary fw-bolder fs-cursor removeBtnStyles`}
              onClick={handleCreateNewChat}
              disabled={toggleNextBtn}
            >
              Next
            </button>
          </div>
        </Modal.Header>
        <Modal.Body>
          <div>
            <div className="d-flex w-100 align-items-center flex-wrap">
              <p className="p-0 m-0">To:</p>
              <div className="ps-2 ">
                <div className="w-100 mb-2 d-flex gap-3 flex-wrap">
                  {Object.keys(userIds).map(
                    (data) =>
                      userIds[data].status && (
                        <div
                          className="d-flex text-primary text-opacity-75 rounded-2 px-2 fs-cursor align-items-center"
                          style={{
                            background: "#e0f1ff",
                            width: "fit-content",
                          }}
                          key={data}
                        >
                          {userIds[data].userName}
                          <span
                            className="fs-3 ms-3"
                            onClick={() =>
                              setUserIds({
                                ...userIds,
                                [data]: { ...userIds[data], status: false },
                              })
                            }
                          >
                            &times;
                          </span>
                        </div>
                      )
                  )}
                </div>
                <input
                  className="newMessageStyles w-100"
                  placeholder="Search..."
                  value={searchUser}
                  onChange={(e) => setSearchUser(e.target.value)}
                />
              </div>
            </div>
            <hr />
            <p className="p-0 m-0 fw-bolder">Suggested</p>
            <div className="checkboxContainer">
              {filteredFollowing.length > 0
                ? filteredFollowing[0].virtualFollowing.length > 0
                  ? filteredFollowing[0].virtualFollowing.map((user) => (
                      <div
                        className="form-check d-flex w-100 align-items-center p-0"
                        key={user.userId}
                      >
                        <label
                          className="form-check-label w-100"
                          htmlFor={user.userId + 90}
                          // onClick={(e) => handleChange(e)}
                        >
                          <div className="d-flex align-items-center justify-content-between mt-3">
                            <div className="d-flex align-items-center mb-3">
                              <img
                                className="rounded-circle me-2"
                                src={
                                  user.profileImage
                                    ? user.profileImage
                                    : process.env.PUBLIC_URL +
                                      "/assets/images/profileBtn.png"
                                }
                                height="55px"
                                width="55px"
                                alt="profile-img"
                              />
                              <div className="ms-2">
                                <p className="h6 mb-0">{user.userName}</p>
                                <p className="mb-0 text-muted">
                                  {user?.fullName}
                                </p>
                              </div>
                            </div>
                          </div>
                        </label>
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name={user.userId}
                          checked={
                            userIds[`${user.userId}`]
                              ? userIds[`${user.userId}`].status
                              : false
                          }
                          value={
                            userIds[`${user.userId}`]
                              ? userIds[`${user.userId}`].status
                              : false
                          }
                          onChange={(e) => handleChange(e)}
                          data-username={user.userName}
                          id={user.userId + 90}
                        />
                      </div>
                    ))
                  : "no result found"
                : "Make fiends to start chat"}
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <SwitchAccount
        setOpenSwitchModal={setOpenSwitchModal}
        openSwitchModal={openSwitchModal}
      />
    </div>
  );
};

export default ChatHeader;
