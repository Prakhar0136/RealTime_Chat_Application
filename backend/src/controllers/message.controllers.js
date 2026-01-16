import User from "../models/User.js";
import Message from "../models/Message.js";
import cloudinary from "../lib/cloudinary.js"
import { io, getReceiverSocketId } from "../lib/socket.js";

export const getAllContacts = async(req, res) => {
    try{
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({_id: {$ne: loggedInUserId}}).select("-password")

        res.status(200).json(filteredUsers);
    }
    catch(error){
        console.log("error in getting all contacts",error)
        res.status(500).json({message:"Internal server error"})
    }
}
    
export const getMessagesByUserId = async(req, res) => {
    try{
        const myId = req.user._id;
        const {id:userToChatId} =  req.params
        const messages = await Message.find({
            $or:[
                {senderId:myId,receiverId:userToChatId},
                {senderId:userToChatId,receiverId:myId}
            ]
        })
        res.status(200).json(messages);
    }
    catch(error){
        console.log("error in getting messages by user id",error.message)
    }
}
 
export const sendMessage = async(req, res) => {
    try{
        const{text,image} = req.body;
        const{id:receiverId} = req.params;
        const senderId = req.user._id;

        if (!text && !image) {
            return res.status(400).json({ message: "Text or image is required." }) ;
        }
        if (senderId.equals(receiverId)) {
            return res.status(400).json({ message: "Cannot send messages to yourself." });
        }
        const receiverExists = await User.exists({ _id: receiverId }) ;
        if (!receiverExists) {
            return res.status(404).json({ message: "Receiver not found." }) ;
        }
        
        let imageUrl;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image)
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image:imageUrl
        });
        await newMessage.save();

        const receiverSocketId = getReceiverSocketId(receiverId.toString())
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage",newMessage)
        }

        res.status(201).json(newMessage);
    }
    catch(error){
        console.log("error in sending message",error)
        res.status(500).json({message:"Internal server error"});
    }
}

export const getChatPartners = async(req, res) => {
    try{
        const loggedInUserId = req.user._id;
        const messages = await Message.find({
            $or: [{senderId: loggedInUserId}, {receiverId: loggedInUserId}]
        })

        const getChatPartnerIds = [...new Set(messages.map((msg) => 
            msg.senderId.toString() === loggedInUserId.toString()
                ? msg.receiverId.toString()
                : msg.senderId.toString())
        )]

        const chatPartners = await User.find({
            _id: { $in: getChatPartnerIds }
        }).select("-password");

        res.status(200).json(chatPartners);
    }
    catch(error){
        console.log("error in getting chat partners",error.message)
        res.status(500).json({message:"Internal server error"});
    }
}

/* ======================================================
   🔴 DELETE MESSAGE FEATURE — NEW CONTROLLER
   ====================================================== */

export const deleteMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const userId = req.user._id;

        const message = await Message.findById(messageId);
        if (!message) {
            return res.status(404).json({ message: "Message not found" });
        }

        // 🔒 Only sender can delete
        if (message.senderId.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Not authorized to delete this message" });
        }

        // 🔴 DELETE FEATURE CHANGE: soft delete
        message.isDeleted = true;
        message.text = null;
        message.image = null;
        message.deletedAt = new Date();

        await message.save();

        // 🔴 DELETE FEATURE CHANGE: realtime emit
        const receiverSocketId = getReceiverSocketId(message.receiverId.toString());
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("messageDeleted", {
                messageId: message._id
            });
        }

        const senderSocketId = getReceiverSocketId(message.senderId.toString());
        if (senderSocketId) {
            io.to(senderSocketId).emit("messageDeleted", {
                messageId: message._id
            });
        }

        res.status(200).json({ success: true });
    } catch (error) {
        console.log("error deleting message", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
