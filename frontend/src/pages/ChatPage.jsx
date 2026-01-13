
import BorderAnimatedContainer from '../components/BorderAnimatedContainer'
import {useChatStore} from '../store/useChatStore'
import ActiveTabSwitch from '../components/ActiveTabSwitch'
import ChatsList from '../components/ChatsList'
import ContactList from '../components/ContactList'
import ChatContainer from '../components/ChatContainer'
import NoConversationPlaceholder from '../components/NoConversationPlaceholder'
import ProfileHeader from '../components/ProfileHeader'


const ChatPage = () => {
  const{activeTab,selectedUser} = useChatStore()

  return (
    <div className="min-h-screen flex items-center justify-center">
    <div className = "relative w-full max-w-4xl h-[600px] ">
     <BorderAnimatedContainer>
      {/*left side*/} 

      <div className = "w-80 bg-pink-800/50 backdrop-blur-md flex flex-col">
        <ProfileHeader/>
        <ActiveTabSwitch/>

        <div className = "flex-1 overflow-y-auto p-4 space-y-2">
          {activeTab==="chats" ? <ChatsList/> : <ContactList/>}
        </div>
      </div>

      {/*right side*/}

      <div className = "flex flex-1 flex-col bg-slate-800/50 backdrop-blur-md">
        {selectedUser?<ChatContainer/> : <NoConversationPlaceholder/>}
      </div>

     </BorderAnimatedContainer>

    </div>
    </div>
  )
}

export default ChatPage
