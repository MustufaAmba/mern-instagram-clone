import React, { createContext, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
const StoreContext = createContext();

export default function StoreProvider({ children }) {
  const navigate = useNavigate();
  const [checkToken, setCheckToken] = useState(() =>
    localStorage.getItem("Token") ? localStorage.getItem("Token") : ""
  );

  const [userData, setUserData] = useState(() =>
    localStorage.getItem("userData")
      ? JSON.parse(localStorage.getItem("userData"))
      : {}
  );
  const [newPost,setNewPost] = useState([])
  const provideToken = (token) => {
    setCheckToken(token);
    navigate("/home");
  };
  const removeToken = () => {
    setCheckToken("");
    navigate("/");
  };
  const saveUserData = (data) => {
    setUserData(data);
  };
  const isLoggedIn = () => {
    if (checkToken) {
      return true;
    }
  };
  const handleErrorToken = (status)=>{
    if(status===400||status===401)
    {
      localStorage.removeItem('Token')
      setUserData({})
      setCheckToken("")
    }
  }
  const handleRefreshPosts = (data)=>{
    return setNewPost(data)
  }
  return (
    <StoreContext.Provider
      value={{ checkToken, provideToken, userData, saveUserData,setUserData, isLoggedIn,removeToken,handleErrorToken,handleRefreshPosts,newPost}}
    >
      {children}
    </StoreContext.Provider>
  );
}
export const tokenHeader = ()=>{
  return {
    'x-auth-token':localStorage.getItem('Token')?localStorage.getItem('Token'):""
  }
}
export const useAuth = () => {
  return useContext(StoreContext);
};
