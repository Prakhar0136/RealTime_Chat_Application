import { Server } from "socket.io"
import http from "http"
import express from "express"
import { ENV } from "./env.js"
import { socketAuthMiddleware } from "../middleware/socket.auth.middleware.js"
import Message from "../models/Message.js" // 🔴 DELETE FEATURE CHANGE

const app = express()
const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: [ENV.CLIENT_URL],
        credentials: true,
    }
})

io.use(socketAuthMiddleware)

export function getReceiverSocketId(userId) {
    return userSocketMap[userId]
}

const userSocketMap = {}

io.on("connection", (socket) => {
    console.log("A user connected", socket.user.fullName)

    const userId = socket.user._id.toString()
    userSocketMap[userId] = socket.id

    io.emit("getOnlineUsers", Object.keys(userSocketMap))

    /* ======================================================
       🔴 DELETE MESSAGE FEATURE — SOCKET HANDLER
       ====================================================== */
    socket.on("deleteMessage", async ({ messageId }) => {
        try {
            const message = await Message.findById(messageId)
            if (!message) return

            // 🔒 Ensure only sender can delete
            if (message.senderId.toString() !== socket.user._id.toString()) return

            // 🔴 Soft delete
            message.isDeleted = true
            message.text = null
            message.image = null
            message.deletedAt = new Date()
            await message.save()

            // 🔴 Emit to sender
            const senderSocketId = getReceiverSocketId(message.senderId.toString())
            if (senderSocketId) {
                io.to(senderSocketId).emit("messageDeleted", {
                    messageId
                })
            }

            // 🔴 Emit to receiver
            const receiverSocketId = getReceiverSocketId(message.receiverId.toString())
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("messageDeleted", {
                    messageId
                })
            }
        } catch (error) {
            console.log("socket delete message error", error)
        }
    })

    socket.on("disconnect", () => {
        console.log("a user disconnected", socket.user.fullName)
        delete userSocketMap[userId]
        io.emit("getOnlineUsers", Object.keys(userSocketMap))
    })
})

export { io, app, server }
