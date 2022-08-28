import axios from "axios";
import { tokenHeader } from "../../store";
const addPost = async (data) => {
  try {
   const token = tokenHeader()

   return await axios.post(`${process.env.REACT_APP_ENDPOINT}post`, data, {
      headers: token,
    });
  } catch (error) {
    return error;
  }
};
const getComments = async(postId)=>{
  try {
    const token = tokenHeader()
    return await axios.get(`${process.env.REACT_APP_ENDPOINT}post/comment/${postId}`, {
       headers: token,
     });
   } catch (error) {
     return error;
   }
}
const getReplyComments = async(commentId)=>{
  try {
    const token = tokenHeader()
    return await axios.get(`${process.env.REACT_APP_ENDPOINT}post/comment/replyComment/${commentId}`, {
       headers: token,
     });
   } catch (error) {
     return error;
   }
}
const addComment = async(data)=>{
  try {
    const token = tokenHeader()
    return await axios.post(`${process.env.REACT_APP_ENDPOINT}post/comment/`,data, {
       headers: token,
     });
   } catch (error) {
     return error;
   }
}
const addReplyComment = async(data,commentId)=>{
  try {
    const token = tokenHeader()
    return await axios.post(`${process.env.REACT_APP_ENDPOINT}post/comment/replyComment/${commentId}`,data, {
       headers: token,
     });
   } catch (error) {
     return error;
   }
}
const addPostLike = async(postId,data)=>{
  try {
    const token = tokenHeader()
    return await axios.post(`${process.env.REACT_APP_ENDPOINT}post/${postId}/like/`,data, {
       headers: token,
     });
   } catch (error) {
     return error;
   }
}
const deletePostLike = async(postId,data)=>{
  try {
    const token = tokenHeader()
    return await axios.delete(`${process.env.REACT_APP_ENDPOINT}post/${postId}/like/`, {
       headers: token,
       data:data
     });
   } catch (error) {
     return error;
   }
}
const getPostLikes = async(postId,data)=>{
  try {
    const token = tokenHeader()
    return await axios.get(`${process.env.REACT_APP_ENDPOINT}post/${postId}/like/`, {
       headers: token
     });
   } catch (error) {
     return error;
   }
}
export { addPost,getComments,getReplyComments,addComment,addReplyComment,addPostLike,deletePostLike,getPostLikes };
