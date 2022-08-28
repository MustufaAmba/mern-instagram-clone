import React from "react";
import { BiArrowBack } from "react-icons/bi";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";
const PostHeader = ({
  navigatePostFront,
  navigatePostBack,
  modalNavigation,
  showSpinner,
}) => {
  return (
    <>
      <Modal.Header>
        <div className="w-100 d-flex justify-content-between">
          <BiArrowBack
            className="h3 fs-cursor"
            onClick={() => navigatePostBack()}
          />
          {showSpinner ? (
            <Spinner animation="border" variant="primary" />
          ) : (
            <p
              className="text-primary text-opacity-75 fs-cursor fw-bolder"
              onClick={() => navigatePostFront()}
            >
              {modalNavigation.shareArea ? "Share" : "Next"}
            </p>
          )}
        </div>
      </Modal.Header>
    </>
  );
};

export default PostHeader;
