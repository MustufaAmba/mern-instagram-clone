import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import Post from "../../Components/Post/Post";
import Button from "react-bootstrap/Button";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
import "./header.styles.css";
import Request from "../../Components/Request/Request";
import { searchUser } from "../../Apis/Account/account.apis";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../store";
import { toast } from "react-toastify";
import { MdOutlineAddBox } from "react-icons/md";
import { AiFillHome, AiOutlineHome, AiOutlineHeart } from "react-icons/ai";
import { RiMessengerLine, RiMessengerFill } from "react-icons/ri";
import Badge from "react-bootstrap/Badge";
import { useLocation } from "react-router-dom";
import { getCurrentFollowRequest } from "../../Apis/User/user.apis";
import SwitchAccount from "../../Components/SwitchAccount/SwitchAccount";
const Header = () => {
  const location = useLocation();
  const [modalShow, setModalShow] = useState(false);
  const [showprofileModal, setShowProfileModal] = useState(false);
  const [showCurrentRequest, setShowCurrentRequest] = useState(false);
  const [openSearchPopover, setOpenSearchPopover] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [activeIcon, setActiveIcon] = useState(() => location.pathname);
  const [openSwitchModal, setOpenSwitchModal] = useState(false);
  const navigate = useNavigate();
  const auth = useAuth();
  const notify = (message, type) => {
    toast[type](message, {
      position: toast.POSITION.TOP_CENTER,
    });
  };
  const [requestCount, setRequestCount] = useState(0);
  useEffect(() => {
    (async () => {
      try {
        const result = await getCurrentFollowRequest(auth.userData.userId);
        if (result.status === 200) {
          setRequestCount(result.data.data[0].currentFollowRequest.length);
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
  }, [auth]);
  useEffect(() => {
    if (searchText.length > 0) {
      (async () => {
        try {
          const result = await searchUser(searchText);
          if (result.status === 200) {
            setSearchResults(result.data.data);
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
    } else {
      setOpenSearchPopover(false);
      setSearchResults([]);
    }
  }, [searchText]);
  return (
    <div>
      <nav className="navbar container-fluid bg-white fixed-top border border-bottom-dark px-0 p-sm-2">
        <div className="container-lg d-block pt-2  p-0 p-sm-2">
          <div className="d-flex justify-content-between align-items-center">
            <div className="">
              <NavLink to="/home">
                <img
                  className="ps-2 ps-sm-0"
                  src={process.env.PUBLIC_URL + "/assets/images/Logo.png"}
                  alt="Instagram-logo"
                />
              </NavLink>
            </div>
            <div className=" d-none d-md-block" style={{ width: "300px" }}>
              <OverlayTrigger
                trigger="click"
                placement="bottom"
                rootClose="true"
                show={openSearchPopover}
                overlay={
                  <Popover id="popover-basic" className="requestPopoverStyles">
                    <Popover.Header as="h3">Recent</Popover.Header>
                    <Popover.Body>
                      <div className="searchStyles">
                        {searchResults.length > 0
                          ? searchResults.map((data) => (
                              <div
                                className="d-flex w-100 fs-cursor"
                                key={data.userId}
                                id={data.userName}
                                onClick={(e) =>
                                  navigate(`/${e.currentTarget.id}`)
                                }
                              >
                                <img
                                  src={
                                    data.profileImage
                                      ? data.profileImage
                                      : process.env.PUBLIC_URL +
                                        "/assets/images/profileBtn.png"
                                  }
                                  className="rounded-circle"
                                  height="50px"
                                  width="50px"
                                  alt="requestIcon"
                                />
                                <div className="d-flex justify-Content-between align-items-center  ms-2 flex-grow-1">
                                  <div className="flex-grow-1">
                                    <p className="m-0 fw-bolder p-0">
                                      {data.userName}
                                    </p>
                                    <p className="fs-small text-secondary m-0 p-0">
                                      {data.fullName}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))
                          : "no result found"}
                      </div>
                    </Popover.Body>
                  </Popover>
                }
              >
                <input
                  className="form-control bg-light "
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                  value={searchText}
                  onChange={(e) => {
                    setSearchText(e.target.value);
                    setOpenSearchPopover(true);
                  }}
                  onFocus={() => setOpenSearchPopover(true)}
                  onBlur={() => setOpenSearchPopover(false)}
                />
              </OverlayTrigger>
            </div>
            {auth.isLoggedIn() ? (
              <div className="">
                <div className="">
                  <NavLink className="me-3 me-sm-4 text-dark" to={"/home"}>
                    {activeIcon === "/home" ? (
                      <AiFillHome
                        size={30}
                        onClick={() => setActiveIcon("/home")}
                      />
                    ) : (
                      <AiOutlineHome
                        size={30}
                        onClick={() => setActiveIcon("/home")}
                      />
                    )}
                  </NavLink>
                  <NavLink className="me-3 me-sm-4 text-dark" to={"/chat"}>
                    {activeIcon === "/chat" ? (
                      <RiMessengerFill
                        size={30}
                        onClick={() => setActiveIcon("/chat")}
                      />
                    ) : (
                      <RiMessengerLine
                        size={30}
                        onClick={() => setActiveIcon("/chat")}
                      />
                    )}
                  </NavLink>
                  <MdOutlineAddBox
                    size={30}
                    className="me-3 me-sm-4"
                    onClick={() => setModalShow(true)}
                  />
                  <OverlayTrigger
                    trigger="click"
                    key={"bottom-end"}
                    placement={"bottom-end"}
                    rootClose="true"
                    onToggle={() => setShowCurrentRequest(false)}
                    overlay={
                      <Popover
                        id={`popover-positioned-${"bottom-end"}`}
                        className="requestPopoverStyles"
                      >
                        <Popover.Body>
                          <Request
                            showCurrentRequest={showCurrentRequest}
                            setShowCurrentRequest={setShowCurrentRequest}
                            setRequestCount={setRequestCount}
                          />
                        </Popover.Body>
                      </Popover>
                    }
                  >
                    <Button
                      variant="light"
                      className={`requestBtnStyles ${
                        requestCount ? "" : "me-3"
                      }`}
                    >
                      <AiOutlineHeart size={30}></AiOutlineHeart>
                      {requestCount ? (
                        <Badge
                          bg="danger"
                          className="requestBadge rounded-circle"
                        >
                          {requestCount}
                        </Badge>
                      ) : (
                        ""
                      )}
                    </Button>
                  </OverlayTrigger>
                  <OverlayTrigger
                    trigger="click"
                    key={"bottom"}
                    placement={"bottom"}
                    rootClose="true"
                    // show={!showprofileModal}
                    // onToggle={(e) => setShowProfileModal(e)}
                    overlay={
                      <Popover id={`popover-positioned-bottom`}>
                        <Popover.Body
                          className="p-0"
                          style={{ minWidth: "276px" }}
                        >
                          <div className="d-flex flex-column">
                            <NavLink
                              className="text-decoration-none profileLinkStyles"
                              to={`/${auth.userData.userName}`}
                            >
                              <div className="profileLinkStyles d-flex gap-2 align-items-center p-2">
                                <img
                                  src={
                                    process.env.PUBLIC_URL +
                                    "/assets/images/profileBtnDark.png"
                                  }
                                  className="rounded-circle"
                                  height="20px"
                                  width="20px"
                                  alt="header-icon"
                                />
                                <p className="p-0 m-0">Profile</p>
                              </div>
                            </NavLink>
                            <NavLink
                              className="text-decoration-none profileLinkStyles "
                              to={`/${auth.userData.userName}/saved`}
                            >
                              <div className="profileLinkStyles d-flex gap-2 align-items-center p-2">
                                <img
                                  src={
                                    process.env.PUBLIC_URL +
                                    "/assets/images/saveBtn.png"
                                  }
                                  height="20px"
                                  width="20px"
                                  alt="header-icon"
                                />
                                <p className="p-0 m-0">Saved</p>
                              </div>
                            </NavLink>
                            <NavLink
                              className="text-decoration-none profileLinkStyles"
                              to="/account/edit"
                            >
                              <div className="profileLinkStyles d-flex gap-2 align-items-center p-2">
                                <img
                                  src={
                                    process.env.PUBLIC_URL +
                                    "/assets/images/settingBtn.png"
                                  }
                                  height="20px"
                                  width="20px"
                                  alt="header-icon"
                                />
                                <p className="p-0 m-0">Settings</p>
                              </div>
                            </NavLink>
                            <div
                              className="profileLinkStyles d-flex gap-2 align-items-center p-2 "
                              // onClick={() => {
                              //   setOpenSwitchModal(true);
                              // }}
                            >
                              <img
                                src={
                                  process.env.PUBLIC_URL +
                                  "/assets/images/switchBtn.png"
                                }
                                height="20px"
                                width="20px"
                                alt="header-icon"
                              />
                              <p className="p-0 m-0">Switch Account</p>
                            </div>
                            <hr className="m-0" />

                            <p
                              className="p-2 m-0 profileLinkStyles"
                              onClick={() => {
                                localStorage.removeItem("Token");
                                localStorage.removeItem("userData");
                                auth.removeToken();
                              }}
                            >
                              Logout
                            </p>
                          </div>
                        </Popover.Body>
                      </Popover>
                    }
                  >
                    <Button className="requestBtnStyles mx-2">
                      {" "}
                      <img
                        src={
                          auth.userData.profileImage
                            ? auth.userData.profileImage
                            : process.env.PUBLIC_URL +
                              "/assets/images/profileBtn.png"
                        }
                        height="25px"
                        className="rounded-circle"
                        width="25px"
                        alt="header-icons"
                      />
                    </Button>
                  </OverlayTrigger>
                </div>
              </div>
            ) : (
              <div className="d-flex gap-3">
                <button
                  className="btn btn-primary"
                  onClick={() => navigate("/")}
                >
                  Login
                </button>
                <button
                  className="btn btn-light"
                  onClick={() => navigate("/signup")}
                >
                  Signup
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
      <SwitchAccount
        openSwitchModal={openSwitchModal}
        setOpenSwitchModal={setOpenSwitchModal}
      />
      <Post modalShow={modalShow} setModalShow={setModalShow} />
    </div>
  );
};

export default Header;
