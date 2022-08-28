import React, { useEffect, useState } from "react";
import { fetchChatMessages, fetchChats } from "../../Apis/Chat/chat.apis";
import Header from "../../CommonComponents/header/Header";
import "./chat.styles.css";
import ChatHeader from "./ChatHeader";
import { useAuth } from "../../store";
import UserChat from "./UserChat";
import ChatBodyHeader from "./ChatBodyHeader";
import ChatBody from "./ChatBody";
import { io } from "socket.io-client";
import ChatOptions from "./ChatOptions";
import {useNavigate} from "react-router-dom"
import { toast } from "react-toastify";
const Chat = () => {
  const [allChats, setAllChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState({
    id: null,
    userIds: [],
  });
  const [chatBodyData, setChatBodyData] = useState([]);
  const [toggleChatBody, setToggleChatBody] = useState(null);
  const [showChatOptions, setShowChatOptions] = useState(false);
  const auth = useAuth();
  const navigate =useNavigate()
  const userId = auth.userData.userId;
  const socket = io(process.env.REACT_APP_SOCKET_ENDPOINT);
  const notify = (message, type) => {
    toast[type](message, {
      position: toast.POSITION.TOP_CENTER,
    });
  };
  const handleBackButton = () => {
    setCurrentChatId({
      id: null,
      userIds: [],
    });
    setToggleChatBody(false);
  };
  useEffect(() => {
    socket.emit("setup user", userId);
    socket.on("connection");
    (async () => {
      try{
        const result = await fetchChats(userId);
        if (result.status === 200) {
          setAllChats(result.data.data);
        }
        else{
          auth.handleErrorToken(result?.response?.status)
          navigate('/error',{state:{status:result.response.status,message:result.response.data.message}})
        }
      }
      catch(error)
      {
        notify(error.message,'error')
      }
     
    })();
    window.addEventListener("resize", () => {
      if (window.innerWidth <= 576) {
        setToggleChatBody(true);
      } else {
        handleBackButton();
      }
    });
  }, []);
  useEffect(() => {
    if (currentChatId.id) {
      (async () => {
        try{
          const result = await fetchChatMessages(currentChatId.id);
          if (result.status === 200) {
            setChatBodyData(result.data.data);
          }
          else{
            navigate('/error',{state:{status:result.response.status,message:result.response.data.message}})
          }
        }
        catch(error)
        {
          notify(error.message,'error')
        }
      })();
      socket.emit("join chat", currentChatId);
      window.innerWidth <= 576 && setToggleChatBody(true);
      setShowChatOptions(false);
    }
  }, [currentChatId]);
useEffect(()=>{
},[allChats])
  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      setChatBodyData((state) => (state = [...state, {...newMessageReceived}]));
    });
  });
  return (
    <div className="chatStyles">
      <Header />
      <div className="container-fluid p-0 p-sm-2 mt-5 pt-sm-4">
        <div className="container-lg mt-0 mt-sm-3 p-0 p-sm-2 ">
          <div className="d-flex justify-content-sm-center align-items-center">
            <div
              className={`chatMessages bg-white p-0  ${
                toggleChatBody && currentChatId.id ? "d-none" : "d-block"
              }`}
            >
              <ChatHeader setAllChats={setAllChats} />
              {allChats  ? (
                allChats.map((data) => (
                  <UserChat
                    data={data}
                    key={data.chatId}
                    chatId={data.chatId}
                    setCurrentChatId={setCurrentChatId}
                  />
                ))
              ) : (
             
                  <p className="fs-small text-center mt-3 ">No chats exists please create a new chat</p>
              )}
            </div>
            <div
              className={`bg-primary bg-white chatBodyStyles p-0  d-sm-block ${
                toggleChatBody && currentChatId.id ? "d-block" : "d-none"
              }`}
            >
              {currentChatId.id ? (
                <>
                  
                    <ChatBodyHeader
                      handleBackButton={handleBackButton}
                      showChatOptions={showChatOptions}
                      setShowChatOptions={setShowChatOptions}
                      currentChatId = {currentChatId.id}
                      allChats={allChats}
                    />
                  
                  {showChatOptions ? (
                    <ChatOptions chatId={currentChatId.id} setAllChats={setAllChats} allChats={allChats}/>
                  ) : (
                    <ChatBody
                      currentChatId={currentChatId}
                      socket={socket}
                      chatBodyData={chatBodyData}
                      setChatBodyData={setChatBodyData}
                    />
                  )}
                </>
              ) : (
                <div className="w-100 d-flex flex-column align-items-center justify-content-center" style={{height:"85vh"}}>
                  <img src={process.env.PUBLIC_URL+"/assets/images/chatBodyIcon.png"} height="100px" width="120px" className="rounded-circle" alt="chatBody"/>
                  <p className="m-0 ps-2 fs-5">Your Messages</p>
                  <p className="text-secondary">Send private messages to a friend or group.</p>
                  </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
