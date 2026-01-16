import { useChatStore } from '../store/useChatStore'
import { useAuthStore } from '../store/useAuthStore'
import { useEffect, useRef, useState } from "react"
import { MoreVertical } from "lucide-react"
import ChatHeader from "./ChatHeader"
import NoChatHistoryPlaceholder from './NoChatHistoryPlaceholder'
import MessageInput from './MessageInput'
import MessagesLoadingSkeleton from './MessagesLoadingSkeleton'

function ChatContainer() {

  const {
    selectedUser,
    getMessagesByUserId,
    messages,
    isMessagesLoading,
    subscribeToMessages,
    unsubscribeFromMessages,
    deleteMessage
  } = useChatStore()

  const { authUser } = useAuthStore()
  const messageEndRef = useRef(null)

  // 🔴 DELETE FEATURE CHANGE — track open menu
  const [openMenuId, setOpenMenuId] = useState(null)

  // 🔴 DELETE FEATURE CHANGE — menu container ref (for outside click)
  const menuRef = useRef(null)

  useEffect(() => {
    getMessagesByUserId(selectedUser._id)
    subscribeToMessages()
    return () => unsubscribeFromMessages()
  }, [selectedUser, getMessagesByUserId, subscribeToMessages, unsubscribeFromMessages])

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" })
    }
  }, [messages])

  /* ======================================================
     🔴 DELETE FEATURE CHANGE — CLOSE MENU ON OUTSIDE CLICK
     ====================================================== */
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null)
      }
    }

    if (openMenuId !== null) {
      document.addEventListener("mousedown", handleOutsideClick)
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick)
    }
  }, [openMenuId])

  return (
    <>
      <ChatHeader />

      <div className="flex-1 px-6 overflow-y-auto py-8">
        {messages.length > 0 && !isMessagesLoading ? (
          <div className="mx-auto space-y-6 max-w-3xl">
            {messages.filter(msg => msg && msg.senderId).map(msg => (
              <div
                key={msg._id}
                className={`chat ${msg.senderId === authUser._id ? "chat-end" : "chat-start"}`}
              >
                <div
                  className={`chat-bubble relative group ${
                    msg.senderId === authUser._id
                      ? "bg-[#1F2933] text-[#F5F5F5]"
                      : "bg-[#141414] text-[#E5E5E5]"
                  }`}
                >

                  {/* 🔴 WHATSAPP-STYLE ⋮ MENU */}
                  {msg.senderId === authUser._id && !msg.isDeleted && (
                    <div className="absolute top-1 right-1" ref={menuRef}>
                      <button
                        onClick={() =>
                          setOpenMenuId(openMenuId === msg._id ? null : msg._id)
                        }
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-black/30"
                      >
                        <MoreVertical className="w-4 h-4 text-[#A1A1A1]" />
                      </button>

                      {openMenuId === msg._id && (
                        <div className="absolute right-0 mt-1 bg-[#141414] border border-[#262626] rounded-md shadow-lg z-50">
                          <button
                            onClick={() => {
                              deleteMessage(msg._id)
                              setOpenMenuId(null)
                            }}
                            className="block px-4 py-2 text-sm text-red-400 hover:bg-[#1F2933] w-full text-left"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 🔴 DELETED MESSAGE STATE */}
                  {msg.isDeleted ? (
                    <p className="italic text-[#737373] text-sm">
                      This message was deleted
                    </p>
                  ) : (
                    <>
                      {msg.image && (
                        <img
                          src={msg.image}
                          alt="shared"
                          className="rounded-lg h-48 object-cover"
                          onClick={() => window.open(msg.image, "_blank")}
                        />
                      )}
                      {msg.text && <p className="mt-2">{msg.text}</p>}
                    </>
                  )}

                  <p className="text-xs text-[#737373] mt-1">
                    {new Date(msg.createdAt).toLocaleTimeString(undefined, {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>

                </div>
              </div>
            ))}
            <div ref={messageEndRef} />
          </div>
        ) : isMessagesLoading ? (
          <MessagesLoadingSkeleton />
        ) : (
          <NoChatHistoryPlaceholder name={selectedUser.fullName} />
        )}
      </div>

      <MessageInput />
    </>
  )
}

export default ChatContainer
