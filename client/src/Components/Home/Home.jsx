import React, { useEffect, useState, useRef, useCallback } from "react";
import { getAllPostByFollowing } from "../../Apis/User/user.apis";
import Header from "../../CommonComponents/header/Header";
import { useAuth } from "../../store";
import "./home.styles.css";
import MultiPost from "./MultiPost";
import Comment from "../../CommonComponents/comment/Comment";
import PostFooter from "../../CommonComponents/postFooter/PostFooter";
import { useNavigate } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import { addPostLike } from "../../Apis/Post/post.apis";
import { toast } from "react-toastify";
const Home = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const observer = useRef();
  const likeRef = useRef([]);
  const [postList, setPostList] = useState([]);
  const [postState, setPostState] = useState([]);
  const [showSpinner, setShowSpinner] = useState(true);
  const [bottomSpinner, setBottomSpinner] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const notify = (message, type) => {
    toast[type](message, {
      position: toast.POSITION.TOP_CENTER,
    });
  };
  const lastPostRef = useCallback((node) => {
    if (observer.current) {
      observer.current.disconnect();
    }
    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPageNumber((state) => (state = state + 1));
          setBottomSpinner(true);
        }
      },
      { threshold: 1.0 }
    );
    if (node) {
      observer.current.observe(node);
    }
  }, []);
  useEffect(() => {
    (async () => {
      try {
        const result = await getAllPostByFollowing(
          auth.userData.userId,
          pageNumber
        );
        if (result?.data?.data.length === 0) {
          setShowSpinner(false);
        }
        if (result.status === 200) {
          setPostList(
            [
              ...new Set(
                [...postList, ...result.data.data].map((o) => JSON.stringify(o))
              ),
            ].map((s) => JSON.parse(s))
          );
          let postStateArray = [];
          [
            ...new Set(
              [...postList, ...result.data.data].map((o) => JSON.stringify(o))
            ),
          ]
            .map((s) => JSON.parse(s))
            .forEach((posts) => {
              let obj = {
                [posts.postId]: {
                  showCommentModal: false,
                  currentComment: "",
                  currentPostLike: posts.likes.includes(auth.userData.userId)
                    ? true
                    : false,
                  showLikeModal: false,
                },
              };
              postStateArray.push(obj);
              setShowSpinner(false);
              setBottomSpinner(false);
            });
          setPostState(postStateArray);
        } else {
          auth.handleErrorToken(result?.response?.status);
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
  }, [pageNumber]);
  useEffect(() => {
    if (auth.newPost?.length > 0) {
      setPostList(
        [
          ...new Set(
            [{ ...auth.newPost[0] }, ...postList].map((o) => JSON.stringify(o))
          ),
        ].map((s) => JSON.parse(s))
      );
      let postStateArray = [];
      [
        ...new Set(
          [{ ...auth.newPost[0] }, ...postList].map((o) => JSON.stringify(o))
        ),
      ]
        .map((s) => JSON.parse(s))
        .forEach((posts) => {
          let obj = {
            [posts.postId]: {
              showCommentModal: false,
              currentComment: "",
              currentPostLike: posts.likes.includes(auth.userData.userId)
                ? true
                : false,
              showLikeModal: false,
            },
          };
          postStateArray.push(obj);
        });
      setPostState(postStateArray);
    }
  }, [auth.newPost]);
  const handleDoubleClick = async (e) => {
    let currentId = parseInt(e.currentTarget.id);
    const targetPost = likeRef.current[e.currentTarget.id];
    targetPost.style.animation = "like-heart-animation 1000ms ease-in-out";
    let obj = postState?.find(
      (item) => parseInt(Object.keys(item)[0]) === currentId
    )[`${currentId}`];
    if (!obj.currentPostLike) {
      try {
        const result = await addPostLike(currentId, {
          userId: auth.userData.userId,
        });
        obj.currentPostLike = !obj.currentPostLike;
        setPostState((state) => (state = [...state]));
        let likeArr = postList.find(
          (postItem) => postItem.postId === currentId
        );
        likeArr.likes = result.data.data.likes;
        setPostList((state) => (state = [...state]));
      } catch (error) {
        notify(error.message, "error");
      }
    }
    window.setTimeout(() => {
      targetPost.style.animation = "";
    }, 1000);
  };
  return (
    <div className="homeStyles">
      <Header />
      <div className="container-fluid p-0 p-sm-2">
        <div className="container-lg mt-5 p-0 pt-sm-4">
          <div className=" mt-4">
            {postList.length > 0 ? (
              postList.map((data, index) => {
                if (postList.length === index + 1) {
                  return (
                    <div key={data.postId}>
                      {" "}
                      <div
                        ref={lastPostRef}
                        className="card bg-white mb-2 mb-sm-5 mx-auto"
                        style={{ width: "30rem" }}
                      >
                        <Comment
                          postState={postState}
                          setPostState={setPostState}
                          data={data}
                          setPostList={setPostList}
                          postList={postList}
                        />
                        <div className="card-header bg-white d-flex justify-content-between align-items-center">
                          <div
                            className="fs-cursor"
                            onClick={() =>
                              navigate(`/${data?.virtualUser?.userName}`)
                            }
                          >
                            <img
                              className="rounded-circle me-2"
                              src={
                                data?.virtualUser?.profileImage
                                  ? data?.virtualUser?.profileImage
                                  : process.env.PUBLIC_URL +
                                    "assets/images/profileBtn.png"
                              }
                              height="40px"
                              width="40px"
                              alt="meme1"
                            />
                            <p className="h6 d-inline">
                              {data?.virtualUser?.userName
                                ? data?.virtualUser.userName
                                : ""}
                            </p>
                          </div>
                        </div>
                        <>
                          {data.content.images.length >= 1 &&
                            data.content.videos.length >= 1 && (
                              <MultiPost
                                data={data.content}
                                id={data.postId}
                                onDoubleClick={(e) => handleDoubleClick(e)}
                              />
                            )}
                          {data.content.images.length > 1 &&
                            data.content.videos.length === 0 && (
                              <MultiPost
                                data={data.content}
                                id={data.postId}
                                onDoubleClick={(e) => handleDoubleClick(e)}
                              />
                            )}
                          {data.content.videos.length > 1 &&
                            data.content.images.length === 0 && (
                              <MultiPost
                                data={data.content}
                                id={data.postId}
                                onDoubleClick={(e) => handleDoubleClick(e)}
                              />
                            )}
                          {data.content.images.length === 1 &&
                          data.content.videos.length === 0 ? (
                            <img
                              src={
                                data.content.images[0]
                                  ? data.content.images[0]
                                  : process.env.PUBLIC_URL +
                                    "assets/images/meme.png"
                              }
                              className="card-img-top contentStyles "
                              width="100%"
                              id={data.postId}
                              onDoubleClick={(e) => handleDoubleClick(e)}
                              alt="..."
                              style={{ maxHeight: "587px" }}
                            />
                          ) : (
                            data.content.images.length === 0 &&
                            data.content.videos.length === 1 && (
                              <video
                                autoPlay
                                loop={true}
                                controls
                                width="100%"
                                className="contentStyles "
                                style={{ maxHeight: "560px" }}
                                id={data.postId}
                                onDoubleClick={(e) => handleDoubleClick(e)}
                              >
                                <source
                                  src={data.content.videos[0]}
                                  type="video/mp4"
                                />
                              </video>
                            )
                          )}
                          <div
                            ref={(el) => (likeRef.current[data.postId] = el)}
                            className="instagram-heart"
                            id={`instagram-heart-${data.postId}`}
                          ></div>
                          <PostFooter
                            data={data}
                            setPostState={setPostState}
                            showBottomComments={true}
                            postState={postState}
                            variant="home"
                            postList={postList}
                            setPostList={setPostList}
                          />
                        </>
                      </div>
                      {bottomSpinner && (
                        <div className="d-flex w-100 justify-content-center">
                          <Spinner animation="border" variant="primary" />
                        </div>
                      )}
                    </div>
                  );
                } else {
                  return (
                    <div
                      className="card bg-white mb-2 mb-sm-5  mx-auto"
                      style={{ width: "30rem" }}
                      key={data.postId}
                    >
                      <Comment
                        postState={postState}
                        setPostState={setPostState}
                        data={data}
                        setPostList={setPostList}
                        postList={postList}
                      />
                      <div className="card-header bg-white d-flex justify-content-between align-items-center rounded-3">
                        <div
                          className="fs-cursor"
                          onClick={() =>
                            navigate(`/${data?.virtualUser?.userName}`)
                          }
                        >
                          <img
                            className="rounded-circle me-2 "
                            src={
                              data?.virtualUser?.profileImage
                                ? data?.virtualUser?.profileImage
                                : process.env.PUBLIC_URL +
                                  "assets/images/profileBtn.png"
                            }
                            height="40px"
                            width="40px"
                            alt="meme1"
                          />
                          <p className="h6 d-inline">
                            {data?.virtualUser?.userName
                              ? data?.virtualUser?.userName
                              : ""}
                          </p>
                        </div>
                      </div>
                      <>
                        {data.content.images.length >= 1 &&
                          data.content.videos.length >= 1 && (
                            <MultiPost
                              data={data.content}
                              handleDoubleClick={handleDoubleClick}
                              id={data.postId}
                            />
                          )}
                        {data.content.images.length > 1 &&
                          data.content.videos.length === 0 && (
                            <MultiPost
                              data={data.content}
                              id={data.postId}
                              handleDoubleClick={handleDoubleClick}
                            />
                          )}
                        {data.content.videos.length > 1 &&
                          data.content.images.length === 0 && (
                            <MultiPost
                              data={data.content}
                              id={data.postId}
                              handleDoubleClick={handleDoubleClick}
                            />
                          )}
                        {data.content.images.length === 1 &&
                        data.content.videos.length === 0 ? (
                          <img
                            src={
                              data.content.images[0]
                                ? data.content.images[0]
                                : process.env.PUBLIC_URL +
                                  "assets/images/meme.png"
                            }
                            id={data.postId}
                            onDoubleClick={(e) => handleDoubleClick(e)}
                            className="card-img-top contentStyles"
                            style={{ position: "relative", maxHeight: "587px" }}
                            width="100%"
                            alt="..."
                          />
                        ) : (
                          data.content.images.length === 0 &&
                          data.content.videos.length === 1 && (
                            <video
                              className=""
                              autoPlay
                              loop={true}
                              mute
                              controls
                              className="contentStyles"
                              controlsList="nofullscreen"
                              width="100%"
                              style={{ maxHeight: "560px" }}
                              id={data.postId}
                              onDoubleClick={(e) => handleDoubleClick(e)}
                            >
                              <source
                                src={data.content.videos[0]}
                                type="video/mp4"
                              />
                            </video>
                          )
                        )}
                        <div
                          ref={(el) => (likeRef.current[data.postId] = el)}
                          className="instagram-heart"
                          id={`instagram-heart-${data.postId}`}
                        ></div>
                        <PostFooter
                          data={data}
                          setPostState={setPostState}
                          showBottomComments={true}
                          postState={postState}
                          variant="home"
                          postList={postList}
                          setPostList={setPostList}
                        />
                      </>
                    </div>
                  );
                }
              })
            ) : showSpinner ? (
              <div className="d-flex w-100 justify-content-center">
                <Spinner animation="border" variant="primary" />
              </div>
            ) : (
              <p className="text-center">
                No post found start making friends to see latest posts
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
