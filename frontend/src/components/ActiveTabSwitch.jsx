import {useChatStore} from "../store/useChatStore"

function ActiveTabSwitch() {
  const { activeTab, setActiveTab } = useChatStore()

  return (
    <div className="tabs tabs-boxed bg-transparent p-2 m-2">
      <button
        onClick={() => setActiveTab("chats")}
        className={`tab flex-1 ${
          activeTab === "chats"
            ? "bg-[#7C9EFF]/20 text-[#7C9EFF]"
            : "text-[#8BA4FF]"
        }`}
      >
        Chats
      </button>

      <button
        onClick={() => setActiveTab("contacts")}
        className={`tab flex-1 ${
          activeTab === "contacts"
            ? "bg-[#7C9EFF]/20 text-[#7C9EFF]"
            : "text-[#8BA4FF]"
        }`}
      >
        Contacts
      </button>
    </div>
  )
}

export default ActiveTabSwitch
