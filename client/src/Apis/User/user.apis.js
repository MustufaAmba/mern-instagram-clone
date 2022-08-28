import axios from "axios";
import {  tokenHeader } from "../../store";
const getCurrentFollowRequest = async (userId) => {
  try {
        const token = tokenHeader()
    return await axios.get(
      `${process.env.REACT_APP_ENDPOINT}user/${userId}/followRequests`,
      {
        headers: token,
      }
    );

  } catch (error) {
    return error;
  }
};
const acceptFollowRequest = async (data) => {
  try {
        const token = tokenHeader()
    return  await axios.patch(
      `${process.env.REACT_APP_ENDPOINT}user/acceptRequest`,
      data,
      {
        headers: token,
      }
    );
 
  } catch (error) {
    return error;
  }
};
const rejectFollowRequest = async (data) => {
  try {
        const token = tokenHeader()
    return await axios.patch(
      `${process.env.REACT_APP_ENDPOINT}user/rejectRequest`,
      data,
      {
        headers: token,
      }
    );

  } catch (error) {
    return error;
  }
};
const getAllFollowings = async (userId) => {
  try {
        const token = tokenHeader()
    return  await axios.get(
      `${process.env.REACT_APP_ENDPOINT}user/${userId}/followings`,
      {
        headers: token,
      }
    );

  } catch (error) {
    return error;
  }
};

const getAllFollowers = async (userId) => {
  try {
        const token = tokenHeader()
    return  await axios.get(
      `${process.env.REACT_APP_ENDPOINT}user/${userId}/followers`,
      {
        headers: token,
      }
    );

  } catch (error) {
    return error;
  }
};

const followUser = async (data) => {
  try {
        const token = tokenHeader()
    return await axios.put(
      `${process.env.REACT_APP_ENDPOINT}user/followUser`,
      data,
      {
        headers: token,
      }
    );
  } catch (error) {
    return error;
  }
};

const getAllPostByFollowing = async (userId,pageNumber) => {
  try {
    const token = tokenHeader();
    return await axios.get(`${process.env.REACT_APP_ENDPOINT}user/${userId}/allPosts?pageSize=6&pageNumber=${pageNumber}`, {
      headers: token,
    });
  } catch (error) {
    return error;
  }
};
const updateUserDetails = async(userId,data)=>{
  try {
        const token = tokenHeader()
    return await axios.put(
      `${process.env.REACT_APP_ENDPOINT}user/${userId}/`,
      data,
      {
        headers: token,
      }
    );
  } catch (error) {
    return error;
  }
}
const getUserByUserName = async(userName)=>{
  try {
        const token = tokenHeader()
    return await axios.get(
      `${process.env.REACT_APP_ENDPOINT}user/userName/${userName}/`,
      {
        headers: token,
      }
    );
  } catch (error) {
    return error;
  }
}
const unFollowUser = async(data)=>{
  try {
        const token = tokenHeader()
    return await axios.put(
      `${process.env.REACT_APP_ENDPOINT}user/unfollowUser/`,data,
      {
        headers: token,
      }
    );
  } catch (error) {
    return error;
  }
}

export {
  getCurrentFollowRequest,
  rejectFollowRequest,
  acceptFollowRequest,
  getAllFollowings,
  getAllFollowers,
  followUser,
  getAllPostByFollowing,
  updateUserDetails,
  getUserByUserName,
  unFollowUser
};
