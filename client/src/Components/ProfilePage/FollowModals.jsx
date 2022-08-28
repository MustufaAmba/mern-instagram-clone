import React from 'react'
import Modal from "react-bootstrap/Modal";
import { useNavigate } from 'react-router-dom';
const FollowModals = ({showFollowModal,followList,setShowFollowModal,setFollowList}) => {
  const navigate = useNavigate()
    return (
        <div>
                <Modal
        show={showFollowModal}
        onHide={() => {setShowFollowModal(false);setFollowList([])}}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton className="p-2">
          <div className=" d-flex justify-content-center w-100 fs-small fw-bolder">
            Followings
          </div>
        </Modal.Header>
        <Modal.Body className="followModalStyles">
          {followList.length ? (
            followList.map((data) => (
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
                    onClick={()=>{navigate(`/${data.userName}`);setShowFollowModal(false)}}
                  >
                    visit
                  </button>
                </div>
              </div>
            ))
          ) : (
            <h5>no followings</h5>
          )}
        </Modal.Body>
      </Modal>
      
        </div>
    )
}

export default FollowModals
