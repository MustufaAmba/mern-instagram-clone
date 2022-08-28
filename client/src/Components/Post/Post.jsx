import React, { useState, useEffect } from "react";
import "./post.styles.css";
import Modal from "react-bootstrap/Modal";
import { storage } from "../../firebaseConfig.js";
import {
  ref,
  getDownloadURL,
  uploadBytes,
  deleteObject,
} from "firebase/storage";
import { useAuth } from "../../store";
import PostHeader from "./PostHeader";
import { addPost } from "../../Apis/Post/post.apis";
import CustomEmojiPicker from "../../CommonComponents/customEmojiPicker/CustomEmojiPicker";
import { toast } from "react-toastify";

import MultiplePost from "./MultiplePost";
import { useNavigate } from "react-router";
const Post = ({ modalShow, setModalShow }) => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [postContent, setPostContent] = useState({ file: [], url: [] });
  const [caption, setCaption] = useState("");
  const [discardModalShow, setDiscardModalShow] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [multiplePost, setMultiplePost] = useState(false);
  const [contentType, setContentType] = useState({
    type: "",
    sizeError: false,
  });
  const [postData, setPostData] = useState({
    useId: null,
    content: {
      videos: [],
      images: [],
    },
    caption: "",
  });
  const [modalNavigation, setModalNavigation] = useState({
    discardAlert: false,
    shareArea: false,
  });
  let promiseArray = [];
  const navigatePostFront = () => {
    if (!modalNavigation.shareArea) {
      return setModalNavigation({ discardAlert: false, shareArea: true });
    }
    for (let i of postContent.file) {
      promiseArray.push(uploadImage(i));
    }
    Promise.all(promiseArray)
      .then((data) => {
        let imgArray = [];
        let videoArray = [];
        data.forEach((fileData) => {
          if (fileData.type.includes("image")) {
            imgArray.push(fileData.downloadURL);
          } else {
            videoArray.push(fileData.downloadURL);
          }
        });
        setPostData({
          userId: auth.userData.userId,
          content: {
            images: imgArray,
            videos: videoArray,
          },
          caption,
        });
      })
      .catch((error) =>
        navigate("/error", { state: { status: 500, message: error.message } })
      );
  };
  const navigatePostBack = () => {
    if (modalNavigation.discardAlert) {
      setDiscardModalShow(true);
    } else if (!modalNavigation.shareArea) {
      setModalNavigation({ ...modalNavigation, discardAlert: true });
    } else if (modalNavigation.shareArea) {
      setModalNavigation({ discardAlert: true, shareArea: false });
    }
  };
  const notify = (message, type) => {
    toast[type](message, {
      position: toast.POSITION.TOP_CENTER,
    });
  };
  const uploadImage = (file) => {
    return new Promise((resolve, reject) => {
      setShowSpinner(true);
      const metadata = {
        contentType: file.type,
      };
      const storageRef = ref(storage, `${auth.userData.userName}/${file.name}`);
      const uploadTask = uploadBytes(storageRef, file, metadata);
      uploadTask
        .then((snapshot) => {
          getDownloadURL(storageRef).then((downloadURL) => {
            resolve({ downloadURL, type: file.type });
          });
        })
        .catch((error) => reject(error));
    });
  };
  useEffect(() => {
    postData.userId &&
      (async () => {
        try {
          const result = await addPost(postData);
          if (result.status === 200) {
            auth.handleRefreshPosts(result.data.data);
            setShowSpinner(false);
            notify(result.data.message, "success");
            setPostData({
              useId: null,
              content: {
                videos: [],
                images: [],
              },
              caption: "",
            });
            setModalNavigation({
              discardAlert: false,
              shareArea: false,
            });
            setModalShow(false);
            setPostContent({ url: [], file: [] });
            setCaption("");
          } else {
            setShowSpinner(false);
            postData.content.images.forEach((imageUrl) => {
              let deleteRef = ref(storage, imageUrl);
              deleteObject(deleteRef)
                .then(() => {})
                .catch((error) => {
                  notify(error.message, "error");
                });
            });
            postData.content.videos.forEach((videoUrl) => {
              let deleteRef = ref(storage, videoUrl);
              deleteObject(deleteRef)
                .then(() => {})
                .catch((error) => {
                  notify(error.message, "error");
                });
            });
            setModalNavigation({
              discardAlert: false,
              shareArea: false,
            });
            setModalShow(false);
            setPostContent({ url: [], file: [] });
            setCaption("");
            navigate("/error", {
              state: {
                status: result.status,
                message: result.message,
              },
            });
          }
        } catch (error) {
          notify(error.message, "error");
        }
      })();
    // eslint-disable-next-line
  }, [postData]);
  const getFile = (e) => {
    const files = e.target.files;
    let fileArray = [];
    let urlArray = [];
    for (let i = 0; i < files.length; i++) {
      if (files[i].type.includes("image")) {
        setContentType({
          type: "image",
          sizeError: files[i].size >= 8000000 ? true : false,
        });
        if (files[i].size > 8000000) {
          return;
        }
      } else if (files[i].type.includes("video")) {
        setContentType({
          type: "video",
          sizeError: files[i].size >= 50000000 ? true : false,
        });
        if (files[i].size > 50000000) {
          return;
        }
      }
      fileArray.push(files[i]);
      urlArray.push({
        type: files[i].type,
        url: URL.createObjectURL(e.target.files[i]),
      });
    }
    setPostContent({
      file: fileArray,
      url: urlArray,
    });
    if (files.length > 1) {
      setMultiplePost(true);
    }
  };
  const handleImogiSelect = (e) => {
    setCaption((state) => (state = state + e.native));
  };
  const checkDiscardAlert = () => {
    if (!modalNavigation.discardAlert && postContent.url.length === 0) {
      return setModalShow(false);
    } else {
      setDiscardModalShow(true);
    }
  };
  return (
    <div>
      <Modal
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={discardModalShow}
        onHide={() => setDiscardModalShow(false)}
      >
        <Modal.Body>
          <div className="d-flex flex-column justify-content-center align-items-center w-100 pt-3  ">
            <p className="m-0 p-0 fw-bolder">Discard post?</p>
            <p className="m-0 p-0 fs-small text-center mt-2">
              If you leave, your edits won't be saved.
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="d-flex flex-column justify-content-center align-items-center w-100 ">
            <p
              className="m-0 p-0 text-danger fs-cursor"
              onClick={() => {
                setDiscardModalShow(false);
                setModalShow(false);
                setPostContent({ url: "", file: {} });
                setMultiplePost(false);
              }}
            >
              Discard
            </p>
          </div>
        </Modal.Footer>
        <Modal.Footer>
          <div className="d-flex flex-column justify-content-center align-items-center w-100">
            <p
              className="m-0 p-0 fs-cursor"
              onClick={() => setDiscardModalShow(false)}
            >
              Cancel
            </p>
          </div>
        </Modal.Footer>
      </Modal>
      <Modal
        show={modalShow}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        onHide={checkDiscardAlert}
      >
        {postContent.url.length > 0 ? (
          <PostHeader
            navigatePostBack={navigatePostBack}
            navigatePostFront={navigatePostFront}
            modalNavigation={modalNavigation}
            uploadImage={uploadImage}
            showSpinner={showSpinner}
          />
        ) : (
          <Modal.Header className="d-flex justify-content-center fw-bolder">
            Create new Post
          </Modal.Header>
        )}
        <Modal.Body>
          {postContent.url.length > 0 ? (
            <div className="d-flex f-sm-block align-items-center">
              {modalNavigation.shareArea ? (
                <div className="d-flex flex-column flex-sm-row">
                  {multiplePost ? (
                    <MultiplePost
                      postContent={postContent}
                      className="flex-fill"
                    />
                  ) : contentType.type === "image" ? (
                    !contentType.sizeError ? (
                      <img
                        src={postContent.url[0].url}
                        width="70%"
                        style={{ maxHeight: "560px" }}
                        alt="post"
                      />
                    ) : (
                      <p className="text-danger mx-auto">
                        Size is more than 8mb
                      </p>
                    )
                  ) : (
                    contentType.type === "video" &&
                    (contentType.sizeError ? (
                      <p className="text-danger mx-auto">
                        Size is more than 50mb
                      </p>
                    ) : (
                      <video
                        autoPlay
                        loop={true}
                        width="70%"
                        style={{ maxHeight: "560px" }}
                      >
                        <source src={postContent.url[0].url} type="video/mp4" />
                      </video>
                    ))
                  )}
                  <div className="mt-2 mt-sm-0 mx-0 mx-sm-3 d-flex flex-column float-end">
                    <div className=" d-flex align-items-center">
                      <img
                        src={
                          auth.userData.profileImage
                            ? auth.userData.profileImage
                            : process.env.PUBLIC_URL +
                              "/assets/images/profileBtn.png"
                        }
                        height="22px"
                        width="22px"
                        className="rounded-circle"
                        alt="profileImage"
                      />
                      <p className="ms-2 p-0 m-0 fw-bolder">
                        {auth.userData.userName}
                      </p>
                    </div>
                    <textarea
                      className="captionStyles mt-2 w-100"
                      rows="3"
                      placeholder="Write a caption..."
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                    ></textarea>
                    <div className="d-flex justify-content-between align-items-center mt-2">
                      <CustomEmojiPicker
                        handleImogiSelect={handleImogiSelect}
                        openDirection="bottom"
                      />
                      <p>{`${caption.length}/2200`}</p>
                    </div>
                  </div>
                </div>
              ) : multiplePost ? (
                <MultiplePost postContent={postContent} />
              ) : contentType.type === "image" ? (
                !contentType.sizeError ? (
                  <img
                    src={postContent.url[0].url}
                    width="100%"
                    style={{ maxHeight: "560px" }}
                    alt="post"
                  />
                ) : (
                  <p className="text-danger mx-auto">Size is more than 8mb</p>
                )
              ) : (
                contentType.type === "video" &&
                (!contentType.sizeError ? (
                  <video
                    autoPlay
                    loop={true}
                    width="100%"
                    muted
                    style={{ maxHeight: "560px" }}
                  >
                    <source src={postContent.url[0].url} type="video/mp4" />
                  </video>
                ) : (
                  <p className="text-danger mx-auto">Size is more than 50mb</p>
                ))
              )}
            </div>
          ) : (
            <div className="d-flex flex-column align-items-center img-upload-div">
              <img
                src={process.env.PUBLIC_URL + "/assets/images/postBg.png"}
                height="77px"
                width="97px"
                alt="post-modal-img"
              />
              <p className="fw-light fs-4 my-3">Select photos and videos</p>
              <input
                type="file"
                id="files"
                className="d-none"
                accept="audio/*,video/*,image/*"
                onChange={(e) => getFile(e)}
                multiple
              />
              <label htmlFor="files" className="btn btn-primary">
                Select from computer
              </label>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Post;
