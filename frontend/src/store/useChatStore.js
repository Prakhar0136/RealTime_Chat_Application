import {create} from 'zustand';
import {axiosInstance} from '../utils/axiosInstance';
import {toast} from 'react-hot-toast';


export const useChatStore = create((set,get) => ({
    allContacts:[],
    chats:[],
    messages:[],
    activeTabs:"chats",
    selectedUser:null,
    isUsersLoading:false,
    isMessagesLoading:false,
    isSoundEnabled:localStorage.getItem('isSoundEnabled') === 'true' || false,

    toggleSound:()=>{
        localStorage.setItem('isSoundEnabled', !get().isSoundEnabled);
        set({isSoundEnabled: !get().isSoundEnabled})
    },

    setActiveTab:(tab)=> set({activeTabs:tab}),
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

}))