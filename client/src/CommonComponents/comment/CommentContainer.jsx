import moment from "moment";
import React, { useState } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";

import { getReplyComments } from "../../Apis/Post/post.apis";

const CommentContainer = ({ data, setReplyToUser }) => {
  const [toggleReplyComments, setToggleReplyComments] = useState(false);
  const [replyComments, setReplyComments] = useState([]);
  const notify = (message, type) => {
    toast[type](message, {
      position: toast.POSITION.TOP_CENTER,
    });
  };
  useEffect(() => {
    toggleReplyComments &&
      (async () => {
        try{
          const result = await getReplyComments(data.commentId);
          if (result.status === 200) {
            setReplyComments(result.data.data);
          }
        }
        catch(error)
        {
          notify(error.message,'error')
        }
      })();
  }, [toggleReplyComments]);
  const handleReplyToComment = (e) => {
    setReplyToUser({
      userName: data.virtualCommentUser.userName,
      userId: data.virtualCommentUser.userId,
      commentId: parseInt(e.target.id),
    });
  };
  const handleToggleReplyComments = () => {
    setToggleReplyComments((state) => (state = !state))
  }
  return (
    <div className="mb-2">
      <div className="d-flex w-100">
        <div className="d-flex w-100 align-items-start">
          <img
            src={
              data?.virtualCommentUser?.profileImage
                ? data?.virtualCommentUser?.profileImage
                : process.env.PUBLIC_URL + "/assets/images/profileBtn.png"
            }
            className="rounded-circle"
            height="30px"
            width="30px"
            alt="commentUser"
          />

          <div className="flex-grow-1 ms-2" style={{ marginTop: "5px" }}>
            <p className="fs-small">
              <span className="fw-bolder me-2">
                {data.virtualCommentUser.userName}
              </span>
              {data.content}
            </p>
            <div className="d-flex text-secondary">
              <p className="fs-small ">{moment(data.updatedAt).fromNow()}</p>
              <p
                className="fs-small fs-cursor ms-2"
                id={data.commentId}
                onClick={(e) => handleReplyToComment(e)}
              >
                Reply
              </p>
            </div>
            {data.commentReplies.length > 0 && (
              <div
                className="text-secondary fs-cursor fs-small d-flex align-items-center"
                onClick={() => handleToggleReplyComments()
                }
              >
                <p
                  className="d-inline-block  mb-0"
                  style={{ width: "30px", height: "2px", background: "gray" }}
                ></p>
                {toggleReplyComments ? "Hide Replies" : "View Replies"}{" "}
                {data.commentReplies.length}
              </div>
            )}
            {toggleReplyComments && (
              <div className="">
                {replyComments?.virtualCommentReplies?.length > 0 &&
                  replyComments.virtualCommentReplies.map((reply) => (
                    <CommentContainer
                      key={reply.commentId}
                      data={reply}
                      setReplyToUser={setReplyToUser}
                    />
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentContainer;
