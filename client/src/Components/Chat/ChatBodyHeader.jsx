import React, { useEffect } from "react";
import { useState } from "react";
import {
  AiOutlineArrowLeft,
  AiOutlineInfoCircle,
  AiFillInfoCircle,
} from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { fetchChatById } from "../../Apis/Chat/chat.apis";
import { useAuth } from "../../store";
const ChatBodyHeader = ({
  handleBackButton,
  currentChatId,
  setShowChatOptions,
  showChatOptions,
  allChats
}) => {

  const [chatData, setChatData] = useState({});
  const navigate = useNavigate()
  const notify = (message, type) => {
    toast[type](message, {
      position: toast.POSITION.TOP_CENTER,
    });
  };
  useEffect(() => {
    (async () => {
      try {
        const result = await fetchChatById(currentChatId);
        if (result.status === 200) {
          setChatData(result.data.data);
        }
        else {
          navigate('/error', { state: { error: result.response.status, message: result.response.message } })
        }
      }
      catch (error) {
        notify(error.message, 'error')

      }
    })();
  }, [currentChatId, allChats]);
  const auth = useAuth();
  const profileImage =
    Object.keys(chatData).length > 0
      ? chatData?.isGroup
        ? ""
        : chatData?.groupMembersVirtual.filter(
          (data) => data.userId !== auth.userData.userId
        )[0]?.profileImage
      : "";

  const userName =
    Object.keys(chatData).length > 0
      ? chatData?.isGroup
        ? chatData?.groupName
          ? chatData?.groupName
          : "no name"
        : chatData?.groupMembersVirtual.filter(
          (data) => data.userId !== auth.userData.userId
        )[0]?.userName
      : "";
  return (
    <div className="w-100 d-flex justify-content-between align-items-center border border-bottom-dark py-4">
      <div className="d-flex align-items-center gap-3">
        <AiOutlineArrowLeft
          className="fs-cursor ms-2"
          size={30}
          onClick={handleBackButton}
        />
        <div className="d-flex align-items-center gap-2">
          <img
            src={
              profileImage
                ? profileImage
                : process.env.PUBLIC_URL + "/assets/images/profileBtn.png"
            }
            className="rounded-circle"
            height="40px"
            width="40px"
            alt="profileImage"
          />
          <p className="p-0 m-0 fw-bolder">{userName}</p>
        </div>
      </div>
      {showChatOptions ? (
        <AiFillInfoCircle
          size={30}
          className="me-3"
          onClick={() => setShowChatOptions(false)}
        />
      ) : (
        <AiOutlineInfoCircle
          size={30}
          className="me-3"
          onClick={() => setShowChatOptions(true)}
        />
      )}
    </div>
  );
};

export default ChatBodyHeader;
