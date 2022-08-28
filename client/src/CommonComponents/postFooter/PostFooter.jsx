import React, { useEffect, useState } from "react";
import moment from "moment";
import "./postFooter.styles.css";
import Modal from 'react-bootstrap/Modal';
import CustomEmojiPicker from "../customEmojiPicker/CustomEmojiPicker";
import { useAuth } from "../../store";
import {
  addComment,
  addPostLike,
  addReplyComment,
  deletePostLike,
  getPostLikes,
} from "../../Apis/Post/post.apis";
import { useNavigate } from "react-router-dom";
import { AiOutlineHeart } from "react-icons/ai";
import { FcLike } from "react-icons/fc";
import { BsChat } from "react-icons/bs";
import { toast } from "react-toastify";
const PostFooter = ({
  data,
  setPostState,
  showBottomComments,
  postState,
  setAllComments,
  variant,
  replyToUser,
  setReplyToUser,
  setPostList,
  postList,
  setReloadingComments
}) => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [likePost, setLikePost] = useState(false);
  const [postLikeList,setPostLikeList] = useState([])
  const getCurrentData = (fieldName) => {
    let obj = postState?.find(
      (item) => parseInt(Object.keys(item)[0]) === data.postId
    )[`${data.postId}`];
    return obj[`${fieldName}`];
  };
  const notify = (message, type) => {
    toast[type](message, {
      position: toast.POSITION.TOP_CENTER,
    });
  };
  useEffect(() => {
    setLikePost(getCurrentData("currentPostLike"))
  }, [postState])

  const [localComment, setLocalComment] = useState(() =>
    getCurrentData("currentComment")
  );

  useEffect(() => {
    if (variant === "comment") {
      if (replyToUser.userId) {
        setLocalComment(`@${replyToUser.userName} `);
      }
    }
  }, [replyToUser]);

  const handleShowCommentModal = () => {
    let obj = postState?.find(
      (item) => parseInt(Object.keys(item)[0]) === data.postId
    )[`${data.postId}`];
    obj.showCommentModal = true;
    setPostState((state) => (state = [...state]));
  };
  const handleShowLikeModal = () => {
    let obj = postState?.find(
      (item) => parseInt(Object.keys(item)[0]) === data.postId
    )[`${data.postId}`];
    obj.showLikeModal = !obj.showLikeModal;
    setPostState((state) => (state = [...state]));
    if(obj.showLikeModal)
    {
      (async()=>{
        try{
          const result= await getPostLikes(data.postId)
          setPostLikeList(result.data.data.virtualLikes)
        }
        catch (error) {
          notify(error.message, 'error')
        }
      })()
    }
  };
  const handleCommentOnChange = () => {
    let obj = postState?.find(
      (item) => parseInt(Object.keys(item)[0]) === data.postId
    )[`${data.postId}`];
    obj.currentComment = localComment;
    setPostState((state) => (state = [...state]));
  };
  const handlePostLikeChange = async() => {
    try {
      if (likePost) {
          const result = await deletePostLike(data.postId, {
            userId: auth.userData.userId,
          });
          if (result.status === 200) {
            let obj = postState?.find(
              (item) => parseInt(Object.keys(item)[0]) === data.postId
            )[`${data.postId}`];
            obj.currentPostLike = !obj.currentPostLike;
            setPostState((state) => (state = [...state]));
            setLikePost((state) => (state = !state));
            let temp = postList.find(
              (postItem) => postItem.postId === data.postId
            );
            temp.likes = result.data.data.likes;
            setPostList((state) => (state = [...state]));
          }
      } else {
          const result = await addPostLike(data.postId, {
            userId: auth.userData.userId,
          });
          if (result.status === 200) {
            let obj = postState?.find(
              (item) => parseInt(Object.keys(item)[0]) === data.postId
            )[`${data.postId}`];
            obj.currentPostLike = !obj.currentPostLike;
            setPostState((state) => (state = [...state]));
            setLikePost((state) => (state = !state));
            let temp = postList.find(
              (postItem) => postItem.postId === data.postId
            );
            temp.likes = result.data.data.likes;
            setPostList((state) => (state = [...state]));
          }
      }
    }
    catch (error) {
      notify(error.message, 'error')
    }
  };
  useEffect(() => {
    handleCommentOnChange();
    if (localComment.length === 0 && variant === "comment") {
      setReplyToUser({
        userName: "",
        userId: null,
        commentId: null,
      });
    }
  }, [localComment]);
  const handleAddComment = (e) => {
    e.preventDefault();
    if (variant === "comment") {
      if (replyToUser.userId) {
        let temp = "";
        localComment.split(" ").forEach((str, index) => {
          if (index !== 0) temp = temp + " " + str;
        });
        let obj = {
          userId: auth.userData.userId,
          postId: data.postId,
          content: temp.trim(),
        };
        (async () => {
          try {
            const result = await addReplyComment(obj, replyToUser.commentId);
            if (result.status === 200) {
              setLocalComment("");
              setReloadingComments(true)
            } else {
              navigate("/error", {
                state: {
                  status: result.response.status,
                  message: result.response.data.message,
                },
              });
            }
          }
          catch (error) {
            notify(error.message, 'error')
          }
        })();
        return;
      }
    }
    let obj = {
      userId: auth.userData.userId,
      postId: data.postId,
      content: localComment,
    };
    (async () => {
      const result = await addComment(obj);
      if (result.status === 200) {
        variant === "comment" &&
          setAllComments(
            (state) => (state = [{ ...result.data.data[0] }, ...state])
          );
        setLocalComment("");
      }
    })();
  };
  const handleImogiSelect = (e) => {
    setLocalComment((state) => (state = state + e.native));
  };
  let showModal = postState.find(
    (item) => parseInt(Object.keys(item)[0]) === data.postId
  )[`${data.postId}`];
  return (
    <div>
      <div className={`${!showBottomComments ? "customStyles" : ""}`}>
        <div className="d-flex justify-content-between mt-3 px-2">
          <div className="d-flex gap-3 pb-2">
            {likePost ? (
              <FcLike
                className="fs-cursor"
                size={25}
                onClick={() => handlePostLikeChange()}
              />
            ) : (
              <AiOutlineHeart
                className="fs-cursor"
                size={25}
                onClick={() => handlePostLikeChange()}
              />
            )}
            <BsChat
              size={22}
              className="fs-cursor"
              onClick={handleShowCommentModal}
            />
          </div>
          {/* <BsBookmark size={20} /> */}
        </div>
        <p className="fs-small fw-bolder ps-2 m-0 fs-cursor"  onClick={handleShowLikeModal}>
          {data.likes.length} Likes
        </p>

        {showBottomComments && (
          <>
            {data?.caption && (
              <p className="fw-bolder d-inline px-2">
                {data?.virtualUser?.userName}
                <span className="fs-small fw-light ps-2">
                  {data?.caption}
                </span>
              </p>
            )}
            <p
              className="text-muted  fs-small mb-2 px-2 fs-cursor"
              onClick={handleShowCommentModal}
            >
              {/* view all {data.post.comments.length} comments */}
              view all comments
            </p>
          </>
        )}
        <p className="text-muted fs-small px-2">
          {moment(data.createdAt).fromNow()}
        </p>
        <div className="d-flex gap-2 align-items-center border border-top p-2">
          <CustomEmojiPicker
            openDirection="top"
            handleImogiSelect={handleImogiSelect}
          />
          <form onSubmit={(e) => handleAddComment(e)} style={{ width: "100%" }}>
            <input
              className="commentInputStyles"
              type="text"
              placeholder="Add a comment..."
              value={localComment}
              onChange={(e) => setLocalComment(e.target.value)}
            />
          </form>
          <button
            className="btn  text-primary fw-bolder mb-0 fs-cursor removeBtnStyles"
            onClick={handleAddComment}
            disabled={localComment.length > 0 ? false : true}
          >
            Post
          </button>
        </div>
      </div>
        <Modal
     show={showModal.showLikeModal}
     onHide={()=>handleShowLikeModal()}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
 <div className="d-flex justify-content-center w-100 fw-bolder">
Likes
  </div>
      </Modal.Header>
      <Modal.Body>
      {postLikeList.length ? (
            postLikeList.map((data) => (
              <div className="d-flex w-100 fs-cursor mb-2" key={data.userId}>
                <img
                  src={
                    data.profileImage
                      ? data.profileImage
                      : process.env.PUBLIC_URL + "/assets/images/profileBtn.png"
                  }
                  className="rounded-circle"
                  height="40px"
                  width="40px"
                  alt="requestIcon"
                />
                <div className="d-flex justify-Content-between align-items-center ms-2 flex-grow-1">
                  <div className="flex-grow-1">
                    <p className="m-0 fw-bolder p-0 fs-small">
                      {data.userName}
                    </p>
                    <p className="fs-small text-secondary m-0 p-0 fs-small">
                      {data.fullName}
                    </p>
                  </div>

                  <button
                    className=" btn btn-primary followBtnStyles rounded-2"
                    data-request-type="accept"
                    onClick={()=>navigate(`/${data.userName}`)}
                  >
                    visit
                  </button>
                </div>
              </div>
            ))
          ) : (
            <h5>no likes</h5>
          )}
      </Modal.Body>
    </Modal>
    </div>
  );
};

export default PostFooter;
