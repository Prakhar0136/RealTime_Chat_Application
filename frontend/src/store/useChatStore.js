import {create} from 'zustand';
import {axiosInstance} from '../lib/axios';
import {toast} from 'react-hot-toast';
import {useAuthStore} from './useAuthStore'


export const useChatStore = create((set,get) => ({
    allContacts:[],
    chats:[],
    messages:[],
    activeTab:"chats",
    selectedUser:null,
    isUsersLoading:false,
    isMessagesLoading:false,
    isSoundEnabled: JSON.parse(localStorage.getItem('isSoundEnabled')) || false,

    toggleSound: () => {
  const newValue = !get().isSoundEnabled;
  localStorage.setItem("isSoundEnabled", JSON.stringify(newValue));
  set({ isSoundEnabled: newValue });
},


    setActiveTab:(tab)=> set({activeTab:tab}),
    setSelectedUser:(user)=> set({selectedUser:user}),

    getAllContacts:async()=>{
        set({isUsersLoading:true});
        try{
            const res = await axiosInstance.get("/messages/contacts")
            set({allContacts:res.data})
        }
        catch(error){
            toast.error(error.response.data.message);
        }
        finally{
            set({isUsersLoading:false});
        }
    },

    getMyChatPartners:async()=>{
        set({isUsersLoading:true});
        try{
            const res = await axiosInstance.get("/messages/chats")
            set({chats:res.data})
        }
        catch(error){
            toast.error(error.response.data.message);
        }
        finally{
            set({isUsersLoading:false});
        }
    },

    getMessagesByUserId: async(userId)=>{
        set({isMessagesLoading:true})
        try{
            const res = await axiosInstance.get(`/messages/${userId}`)
            set({messages:res.data})

        }
        catch(error){
            toast.error(error.response?.data?.message || "something went wrong")
        }
        finally{
            set({isMessagesLoading:false})
        }
    },

    sendMessage: async (messageData) => {
  const { selectedUser } = get();
  const { authUser } = useAuthStore.getState();

  const tempId = `temp-${Date.now()}`;

  const optimisticMessage = {
    _id: tempId,
    senderId: authUser._id,
    receiverId: selectedUser._id,
    text: messageData.text,
    image: messageData.image,
    createdAt: new Date().toISOString(),
    isOptimistic: true,
  };

  // ✅ functional update (CRITICAL)
  set((state) => ({
    messages: [...state.messages, optimisticMessage],
  }));

  try {
    const res = await axiosInstance.post(
      `/messages/send/${selectedUser._id}`,
      messageData,
      { withCredentials: true }
    );

    // ✅ replace optimistic message with real one
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg._id === tempId ? res.data : msg
      ),
    }));
  } catch (error) {
    // rollback optimistic update
    set((state) => ({
      messages: state.messages.filter((msg) => msg._id !== tempId),
    }));

    toast.error(error.response?.data?.message || "Something went wrong");
  }
    },

    subscribeToMessages: () => {
  const { selectedUser } = get();
  if (!selectedUser) return;

  const socket = useAuthStore.getState().socket;
  const { authUser } = useAuthStore.getState();

  // remove existing listener before adding
  socket.off("newMessage");

  socket.on("newMessage", (newMessage) => {
    const isRelatedToCurrentChat =
      (newMessage.senderId === selectedUser._id &&
        newMessage.receiverId === authUser._id) ||
      (newMessage.senderId === authUser._id &&
        newMessage.receiverId === selectedUser._id);

    if (!isRelatedToCurrentChat) return;

    set((state) => ({
      messages: [...state.messages, newMessage],
    }));

    // 🔥 READ LIVE STATE (NOT closure)
    if (
      get().isSoundEnabled &&
      newMessage.senderId !== authUser._id
    ) {
      const sound = new Audio("/sounds/notification.mp3");
      sound.currentTime = 0;
      sound.play().catch(() => {});
    }
  });
},


    unsubscribeFromMessages:()=>{
      const socket = useAuthStore.getState().socket
      socket.off("newMessage")
    },
}))