import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from 'react-bootstrap/Spinner'
import { toast } from "react-toastify";
import {
  acceptFollowRequest,
  getCurrentFollowRequest,
  rejectFollowRequest,
} from "../../Apis/User/user.apis";
import { useAuth } from "../../store";
import "./request.styles.css";

const Request = ({ showCurrentRequest, setShowCurrentRequest, setRequestCount }) => {
  const notify = (message, type) => {
    toast[type](message, {
      position: toast.POSITION.TOP_CENTER,
    });
  };
  const navigate = useNavigate()
  const auth = useAuth();
  const [currentRequests, setCurrentRequests] = useState([]);
  const [showSpinner, setShowSPinner] = useState(false)
  const [requestData, setRequestData] = useState({
    targetId: null,
    requestType: "",
  });
  const getRequests = useCallback(() => {
    (async () => {
      try {
        setShowSPinner(true)
        const result = await getCurrentFollowRequest(auth.userData.userId);
        setShowSPinner(false)
        if (result.status === 200) {
          setCurrentRequests(result.data.data[0]);
          setRequestCount(result.data.data[0].currentFollowRequest.length)
        }
        else {
          navigate('/error', { state: { status: result.response.status, message: result.response.data.message } })
        }
      }
      catch (error) {
        notify(error.message, 'error')
      }
    })();
  }, [auth]);

  useEffect(() => {
    showCurrentRequest && getRequests();
  }, [showCurrentRequest, getRequests]);
  useEffect(() => {
    if (requestData?.requestId) {
      requestData.requestType === "accept"
        ? (async () => {
          try {
            const result = await acceptFollowRequest({
              userId: auth.userData.userId,
              requestId: requestData?.requestId,
            });
            if (result.status === 200) {
              setRequestData({
                targetId: null,
                requestType: "",
              });
              getRequests();
            }
            else {
              navigate('/error', { state: { status: result.response.status, message: result.response.data.message } })
            }
          }
          catch (error) {
            notify(error.message, 'error')
          }

        })()
        : (async () => {
          try {
            const result = await rejectFollowRequest({
              userId: auth.userData.userId,
              requestId: requestData?.requestId,
            });
            if (result.status === 200) {
              setRequestData({
                targetId: null,
                requestType: "",
              });
              getRequests();
            }
            else {
              navigate('/error', { state: { status: result.response.status, message: result.response.data.message } })
            }
          }
          catch (error) {
            notify(error.message, 'error')
          }
        })();
    }
  }, [requestData, auth, getRequests]);
  return (
    <div className="requestContainer">
      {showCurrentRequest ? (showSpinner ?
        <div className="d-flex justify-content-center">
          <Spinner className="" animation="border" variant="primary" />
        </div>
        :
        currentRequests?.currentFollowRequest?.length > 0 ? (
          <>
            {currentRequests?.currentFollowRequest.map((request) => (
              <div
                className="d-flex w-100 fs-cursor border-bottom pb-2"
                onClick={() => setShowCurrentRequest(true)}
                key={
                  request.requestId
                }
              >
                <img
                  src={
                    currentRequests?.virtualRequestUser.filter(data => data.userId === request.targetId)[0]?.profileImage
                      ? currentRequests?.virtualRequestUser.filter(data => data.userId === request.targetId)[0]?.profileImage
                      : process.env.PUBLIC_URL + "/assets/images/profileBtn.png"
                  }
                  className="rounded-circle"
                  height="50px"
                  width="50px"
                  alt="requestIcon"
                />
                <div className="d-flex justify-Content-between align-items-center  ms-2 flex-grow-1">
                  <div className="flex-grow-1">
                    <p className="m-0 fw-bolder p-0">{currentRequests?.virtualRequestUser.filter(data => data.userId === request.targetId)[0]?.fullName}</p>
                    <p className="fs-small text-secondary m-0 p-0">
                      {currentRequests?.virtualRequestUser.filter(data => data.userId === request.targetId)[0]?.userName}
                    </p>
                  </div>
                  <div className="d-flex align-items-center gap-3">
                    <button
                      className=" confirmBtnStyles rounded-2 "
                      data-request-type="accept"
                      id={
                        request.requestId
                      }
                      onClick={(e) =>
                        setRequestData({
                          requestId: parseInt(e.target.id),
                          requestType:
                            e.target.getAttribute("data-request-type"),
                        })
                      }
                    >
                      Confirm
                    </button>
                    <button
                      className="deleteBtnStyles rounded-2 "
                      data-request-type="reject"
                      id={
                        request.requestId
                      }
                      onClick={(e) =>
                        setRequestData({
                          requestId: parseInt(e.target.id),
                          requestType:
                            e.target.getAttribute("data-request-type"),
                        })
                      }
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : (
          <p className="text-center fs-5">No pending requests</p>
        )
      ) : (
        <div className="w-100">
          <div
            className="d-flex w-100 fs-cursor"
            onClick={() => setShowCurrentRequest(true)}
          >
            <img
              src={process.env.PUBLIC_URL + "/assets/images/profileBtn.png"}
              height="50px"
              width="50px"
              className="rounded-circle"
              alt="requestIcon"
            />
            <div className="d-flex justify-Content-between align-items-center  ms-2 flex-grow-1">
              <div className="flex-grow-1">
                <p className="m-0 fw-bolder p-0">Follow requests</p>
              </div>
              <div className="d-flex align-items-center gap-3">
                <div className="blueDot bg-primary bg-opacity-75"></div>
                {">"}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Request;
