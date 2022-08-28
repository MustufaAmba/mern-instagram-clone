import axios from "axios";
import { tokenHeader } from "../../store";

const fetchChats = async (userId) => {
  try {
   const token= tokenHeader()
    return  await axios.get(`${process.env.REACT_APP_ENDPOINT}chat/${userId}`, {
      headers: token,
    });

  } catch (error) {
    return error;
  }
};
const fetchChatMessages = async (chatId) => {
  try {
    const token= tokenHeader()
    return  await axios.get(
      `${process.env.REACT_APP_ENDPOINT}chat/${chatId}/message`,
      { headers: token }
    );
  } catch (error) {
    return error;
  }
};
const sendMessage = async (chatId, data) => {
  try {
    const token= tokenHeader()
    return await axios.post(
      `${process.env.REACT_APP_ENDPOINT}chat/${chatId}/message`,
      data,
      { headers: token }
    );
  } catch (error) {
    return error;
  }
};
const createNewChat = async (data) => {
  try {
    const token= tokenHeader()
    return await axios.post(`${process.env.REACT_APP_ENDPOINT}chat/`, data, {
      headers: token,
    });
  } catch (error) {
    return error;
  }
};
const fetchChatById = async (chatId) => {
  try {
    const token= tokenHeader()
    return await axios.get(`${process.env.REACT_APP_ENDPOINT}chat/chat/${chatId}`, {
      headers: token,
    });
  } catch (error) {
    return error;
  }
};
const editChat = async (chatId,data) => {
  try {
    const token= tokenHeader()
    return await axios.put(`${process.env.REACT_APP_ENDPOINT}chat/${chatId}/edit`, data,{
      headers: token,
    });
  } catch (error) {
    return error;
  }
};
const deleteChat = async (chatId,data) => {
  try {
    const token= tokenHeader()
    return await axios.delete(`${process.env.REACT_APP_ENDPOINT}chat/${chatId}/`,{
      headers: token,
      data
    });
  } catch (error) {
    return error;
  }
};
export { fetchChats, fetchChatMessages, sendMessage, createNewChat,fetchChatById,editChat,deleteChat };
