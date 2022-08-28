import React from "react";
import { useAuth } from "../../store";
import moment from "moment";
const UserChat = ({ data, chatId, setCurrentChatId }) => {
  const auth = useAuth();
  const currentUser = data.groupMembersVirtual.filter(
    (user) => user.userId !== auth.userData.userId
  )[0];

  return (
    <div
      className="userChatStyles px-3 pt-3"
      id={`${chatId}`}
      onClick={(e) =>
        setCurrentChatId({
          userIds: data.userIds,
          id: parseInt(e.currentTarget.id),
        })
      }
    >
      <div className="d-flex">
        <img
          src={
            data?.isGroup
              ? process.env.PUBLIC_URL + "/assets/images/profileBtn.png"
              : currentUser?.profileImage
              ? currentUser?.profileImage
              : process.env.PUBLIC_URL + "/assets/images/profileBtn.png"
          }
          className="rounded-circle"
          height="40px"
          width="40px"
          alt="chatProfile"
        />
        <div className="ms-2">
          <p className="p-0 m-0">
            {data?.isGroup
              ? data?.groupName
                ? data?.groupName
                : "no name"
              : currentUser?.userName
              ? currentUser?.userName
              : auth.userData.userName}
          </p>
          {data.lastMessageVirtual ? (
            <p className="fs-small fw-bolder">
              {data.lastMessageVirtual.content.length > 25
                ? data.lastMessageVirtual.content.slice(0, 25) + "..."
                : data.lastMessageVirtual.content}{" "}
              <span className="fs-small text-secondary">
                {". " + moment(data.updatedAt).fromNow()}
              </span>
            </p>
          ) : (
            <p className="fs-small fw-light">
              send a new message{" "}
              <span className="fs-small text-secondary">
                {". " + moment(data.updatedAt).fromNow()}
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserChat;
