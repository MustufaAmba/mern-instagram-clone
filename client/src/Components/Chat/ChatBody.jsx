import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { sendMessage } from "../../Apis/Chat/chat.apis";
import CustomEmojiPicker from "../../CommonComponents/customEmojiPicker/CustomEmojiPicker";
import { useAuth } from "../../store";
const ChatBody = ({  currentChatId, socket,chatBodyData,setChatBodyData }) => {
  const [newMessage, setNewMessage] = useState("");
  const [messageData, setMessageData] = useState({
    senderId: null,
    content: "",
  });
  const auth = useAuth();
  const navigate = useNavigate()
  const handleImogiSelect = (e) => {
    setNewMessage((state) => (state = state + e.native));
  };
  var objDiv;
useEffect(()=>{
   objDiv = document.getElementsByClassName("chatArea")[0];
  objDiv.scroll({ top: objDiv.scrollHeight, behavior: "smooth"})
},[chatBodyData])
const notify = (message, type) => {
  toast[type](message, {
    position: toast.POSITION.TOP_CENTER,
  });
};
  useEffect(() => {
    messageData.senderId &&
      (async () => {
        try{
          const result = await sendMessage(currentChatId.id, messageData);
          if (result?.status === 200) {
            socket.emit("new message", { ...currentChatId, ...result.data.data[0]});
            setChatBodyData([...chatBodyData,{...result.data.data[0]}])
            setMessageData({
              senderId: null,
              content: "",
            });
            setNewMessage("");
          }
          else{
            navigate('/error',{state:{error:result.response.status,message:result.response.message}})
          }
        }
        catch(error)
        {
          notify(error.message,'error')
        }
  
      })();
  }, [messageData, currentChatId]);
 return (
    <div>
      <div className="w-100">
        <div className="chatArea pt-4 px-2">
          {chatBodyData ?
            chatBodyData.map((message,index) => (
              <div key={index} className="w-100">
                {message.senderId !== auth.userData.userId ? (
                  <div key={index}>
                    <div
                      className={`senderMessageStyles p-2 px-3 mt-2 ${
                        message.content.length > 20 && "w-50"
                      }`}
                    >
                      {message.content}
                    </div>
                    <img
                      src={
                       message?.senderIdVirtual[0]?.profileImage?
                          message?.senderIdVirtual[0]?.profileImage
                          : process.env.PUBLIC_URL +
                            "/assets/images/profileBtn.png"
                      }
                      className="rounded-circle"
                      height="22px"
                      width="22px"
                      alt="senderIcon"
                    />
                  </div>
                ) : (
                  <div
                    key={index}
                    className={`messageStyles p-2 px-3 ms-auto ${
                      message.content.length > 20 && "w-50"
                    }`}
                  >
                    {message.content}
                  </div>
                )}
              </div>
            )):"no messages please send a message"}
        </div>
        <div>
          <div className="mx-2 chatInputDivStyles p-2 d-flex align-items-center justify-content-between mb-2">
            <div className="d-flex align-items-center">
              <CustomEmojiPicker
                handleImogiSelect={handleImogiSelect}
                openDirection="top"
              />
              <form onSubmit={(e)=>{e.preventDefault();
              setMessageData({
                    senderId: auth.userData.userId,
                    content: newMessage
                  });}}>
              <input
                type="text"
                className="chatInputStyles ms-2"
                placeholder="Message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              </form>
         
            </div>
            {newMessage.length > 0 && (
              <p
                className="p-0 m-0 text-primary fs-cursor"
                onClick={() =>
                  setMessageData({
                    senderId: auth.userData.userId,
                    content: newMessage
                  })
                }
              >
                Send
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBody;
