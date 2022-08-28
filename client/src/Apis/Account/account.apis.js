import axios from "axios";

const loginUser = async (data) => {
  try {
    return await axios.post(`${process.env.REACT_APP_ENDPOINT}account/login`, data);
  } catch (error) {
    return error;
  }
};

const generateOtp = async (data) => {
  try {
    return await axios.post(`${process.env.REACT_APP_ENDPOINT}account/generateOtp`, data);
  } catch (error) {
    return error;
  }
};

const verifyOtp = async (data) => {
  try {
    return await axios.post(`${process.env.REACT_APP_ENDPOINT}account/verifyOtp`, data);
  } catch (error) {
    return error;
  }
};

const checkUserName = async (userName) => {
  let cancel;
  try {
    return await axios({
      method:'GET',
      url: `${process.env.REACT_APP_ENDPOINT}account/checkUsername/${userName}`,
     cancelToken: new axios.CancelToken(c=>cancel=c)
    }
     );
  } catch (error) {
    if(axios.isCancel(cancel))
    {
      return
    }
    return error;
  }
};
const addAccount = async (data) => {
  try {
    return await axios.post(`${process.env.REACT_APP_ENDPOINT}account/`, data);
  } catch (error) {
    return error;
  }
};
const findAccount = async (userName) => {
  try {
    return await axios.get(`${process.env.REACT_APP_ENDPOINT}account/findAccount/${userName}`);
  } catch (error) {
    return error;
  }
};
const verifyPasswordOtp = async (data) => {
  try {
    return await axios.post(`${process.env.REACT_APP_ENDPOINT}account/verify`,data);
  } catch (error) {
    return error;
  }
};
const changePassword = async (data) => {
  try {
    return await axios.patch(`${process.env.REACT_APP_ENDPOINT}account/password`,data);
  } catch (error) {
    return error;
  }
};
const searchUser = async (data) => {
  try {
    return await axios.get(
      `${process.env.REACT_APP_ENDPOINT}account/findUsers?search=${data}`
    );

  } catch (error) {
    return error;
  }
};
const getAccountDetails = async(data)=>{
  try {
return await axios.get(
  `${process.env.REACT_APP_ENDPOINT}account/?search=${data}`,
);
} catch (error) {
return error;
}
}
export { loginUser, generateOtp, verifyOtp, checkUserName, addAccount ,findAccount,verifyPasswordOtp,changePassword,searchUser,getAccountDetails};
