import React, { useState, useEffect } from 'react'
import { deleteChat, editChat, fetchChatById } from '../../Apis/Chat/chat.apis'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import { useAuth } from '../../store';
const ChatOptions = ({ chatId, setAllChats, allChats }) => {
    const [userData, setUserData] = useState([])
    const [groupName, setGroupName] = useState("")
    const [showBtn, setShowBtn] = useState(false)
    const navigate = useNavigate()
    const auth = useAuth()
    const notify = (message, type) => {
        toast[type](message, {
          position: toast.POSITION.TOP_CENTER,
        });
      };
    useEffect(() => {
        (async () => {
            try {
                const result = await fetchChatById(chatId)
                if (result.status === 200) {
                    setUserData(result.data.data)
                    setGroupName(result.data.data?.groupName ? result.data.data?.groupName : "")
                }
                else {
                    navigate('/error', { state: { error: result.response.status, message: result.response.message } })
                }
            }
            catch (error) {
                notify(error.message, 'error')
            }
        })()
    }, [])
    const handleGroupNameSave = () => {
        (async () => {
            let data = { userIds: userData.userIds, groupName }
            const result = await editChat(chatId, data)
            if (result.status === 200) {
                setShowBtn(false)
                let chatId = result.data.data.chatId
                let obj = allChats.find(data => data.chatId === chatId)
                obj.groupName = groupName
                setAllChats(state => state = [...state])
                notify(result.data.message,'success')
            }
            else {
                navigate('/error', { state: { error: result.response.status, message: result.response.message } })
            }
        })()
    }
    const handleDeleteChat = async() => {
        try {
                const result = await deleteChat(userData.chatId, { userId: auth.userData.userId })
                const newChats = allChats.filter(chat => chat.chatId !== result.data.data.chatId)
                setAllChats(newChats)
        }
        catch (error) {
            notify(error.message, 'error')
        }
    }
    return (
        <div>
            {
                userData?.isGroup && <div className="w-100 align-items-center d-flex ">

                    <p className="m-0 p-0">Group Name:</p>
                    <input className="chatInputStyles" type="text" value={groupName} onChange={e => { setGroupName(e.target.value); setShowBtn(true) }} />
                    {showBtn && <button className="text-primary fs-cursor removeBtnStyles" onClick={handleGroupNameSave}>Done</button>}
                </div>
            }
            <p className='fw-bolder m-0 ps-3 py-2 '>Members</p>
            <div>
                {
                    userData?.groupMembersVirtual ? userData.groupMembersVirtual.map(users =>
                        <div
                            className="d-flex w-100 fs-cursor mb-4  pb-2"
                            key={users.userId}
                            onClick={() => navigate(`/${users.userName}`)}
                        >
                            <img
                                className='ms-3 rounded-circle'
                                src={
                                    users.profileImage
                                        ? users.profileImage
                                        : process.env.PUBLIC_URL + "/assets/images/profileBtn.png"
                                }
                                height="50px"
                                width="50px"
                                alt="requestIcon"
                            />
                            <div className="d-flex justify-Content-between align-items-center  ms-2 flex-grow-1">
                                <div className="flex-grow-1">
                                    <p className="m-0 fw-bolder p-0">{users.fullName}</p>
                                    <p className="fs-small text-secondary m-0 p-0">
                                        {users.userName}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : "no members"
                }
            </div>
            <p className='text-danger ms-3 fs-cursor' onClick={() => handleDeleteChat()}>{userData.isGroup ? "Leave chat" : "Delete chat"}</p>
        </div>
    )
}

export default ChatOptions