import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getComments } from "../../Apis/Post/post.apis";
import MultiPost from "../../Components/Home/MultiPost";
import PostFooter from "../postFooter/PostFooter";
import "./comment.styles.css";
import CommentContainer from "./CommentContainer";
const Comment = ({ postState, setPostState, data, postList, setPostList }) => {
  const notify = (message, type) => {
    toast[type](message, {
      position: toast.POSITION.TOP_CENTER,
    });
  };
  const [allComments, setAllComments] = useState([]);
  const [reloadingComments, setReloadingComments] = useState(false);
  const [replyToUser, setReplyToUser] = useState({
    userName: "",
    userId: null,
    commentId: null,
  });

  const navigate = useNavigate();
  const handleShowCommentModal = () => {
    let obj = postState.find(
      (item) => parseInt(Object.keys(item)[0]) === data.postId
    )[`${data.postId}`];
    obj.showCommentModal = false;

    setPostState((state) => (state = [...state]));
  };
  let showModal = postState.find(
    (item) => parseInt(Object.keys(item)[0]) === data.postId
  )[`${data.postId}`];

  useEffect(() => {
    (showModal.showCommentModal || reloadingComments) &&
      (async () => {
        try {
          const result = await getComments(data.postId);
          if (result.status === 200) {
            setAllComments(result.data.data);
            setReloadingComments(false);
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
  }, [showModal.showCommentModal, reloadingComments]);
  return (
    <div>
      <Modal
        show={showModal.showCommentModal}
        onHide={() => handleShowCommentModal()}
        size="xl"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Body>
          <div
            className="d-flex flex-column flex-sm-row w-100 align-items-center postContainerStyles"
            style={{ position: "relative" }}
          >
            <div className="responsiveStyles ratio ratio-1x1 ">
              {data.content.images.length >= 1 &&
                data.content.videos.length >= 1 && (
                  <MultiPost data={data.content} variant="comment" />
                )}
              {data.content.images.length > 1 &&
                data.content.videos.length === 0 && (
                  <MultiPost data={data.content} variant="comment" />
                )}
              {data.content.videos.length > 1 &&
                data.content.images.length === 0 && (
                  <MultiPost data={data.content} variant="comment" />
                )}
              {data.content.images.length === 1 &&
              data.content.videos.length === 0 ? (
                <img
                  src={
                    data.content.images[0]
                      ? data.content.images[0]
                      : process.env.PUBLIC_URL + "assets/images/meme.png"
                  }
                  width="100%"
                  alt="..."
                  className="contentStyles"
                />
              ) : (
                data.content.images.length === 0 &&
                data.content.videos.length === 1 && (
                  <video
                    autoPlay
                    loop={true}
                    controls
                    width="50%"
                    style={{ maxHeight: "75vh" }}
                  >
                    <source src={data.content.videos[0]} type="video/mp4" />
                  </video>
                )
              )}
            </div>
            <div className="w-50 responsiveStylesComments">
              <div className="h-75 d-none d-sm-block">
                <div className="p-2 commentSectionStyles ">
                  {allComments.length > 0 ? (
                    allComments.map((data) => (
                      <CommentContainer
                        setReplyToUser={setReplyToUser}
                        key={data.commentId}
                        data={data}
                      />
                    ))
                  ) : (
                    <h5>no comments</h5>
                  )}
                </div>
              </div>

              <div className="h-25">
                <PostFooter
                  data={data}
                  showBottomComments={false}
                  setAllComments={setAllComments}
                  postState={postState}
                  setPostState={setPostState}
                  variant="comment"
                  replyToUser={replyToUser}
                  setReplyToUser={setReplyToUser}
                  postList={postList}
                  setPostList={setPostList}
                  setReloadingComments={setReloadingComments}
                />
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Comment;
