import React from 'react'
import {useNavigate}  from "react-router-dom"
import MultiPost from '../Home/MultiPost'
const ProfilePosts = ({ posts, isActive,currentUserName }) => {
    const navigate = useNavigate()
    return (
        <div className='border-top'>

            <div className="d-flex w-100 justify-content-center gx-2 gap-sm-4">
                <p onClick={()=>navigate(`/${currentUserName}`)} className={`me-3 pt-3 fs-cursor ${isActive === "Posts" ? "fw-bolder border-top border-dark" : "fw-light border border-0"}`}>Posts</p>
                <p onClick={()=>navigate(`/${currentUserName}/saved`)} className={`pt-3 fs-cursor  ${isActive === "saved" ? "fw-bolder border-top border-dark " : "fw-light border border-0 "}`}>Saved</p>
            </div>

            <div className='row justify-content-center'>
                {
                   posts&& posts?.length > 0 && posts.map(data =>
                        <div className="col-4 px-2 mb-2 mb-sm-4" key={data.postId}>
                            {data.content.images.length >= 1 &&
                        data.content.videos.length >= 1 && (
                          <MultiPost data={data.content} />
                        )}
                      {data.content.images.length > 1 &&
                        data.content.videos.length === 0 && (
                          <MultiPost data={data.content} />
                        )}
                      {data.content.videos.length > 1 &&
                        data.content.images.length === 0 && (
                          <MultiPost data={data.content} />
                        )}
                      {data.content.images.length === 1 &&
                      data.content.videos.length === 0 ? (
                        <img
                          src={
                            data.content.images[0]
                              ? data.content.images[0]
                              : process.env.PUBLIC_URL + "assets/images/meme.png"
                          }
                          className="border contentStyles"
                          width="100%"
                          alt="..."
                          style={{ maxHeight: "300px" }}
                        />
                      ) : (
                        data.content.images.length === 0 &&
                        data.content.videos.length === 1 && (
                          <video
                            autoPlay
                            muted
                            loop={true}
                            controls
                            width="100%"
                            className="contentStyles"
                            style={{ maxHeight: "300px" }}
                          >
                            <source
                              src={data.content.videos[0]}
                              type="video/mp4"
                            />
                          </video>
                        )
                      )}
                            {/* <img src={data.content.images[0]} className="img-fluid" alt="post" /> */}
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default ProfilePosts