import express from 'express'
import {
  getAllContacts,
  getMessagesByUserId,
  sendMessage,
  getChatPartners,

  // 🔴 DELETE FEATURE CHANGE
  deleteMessage
} from '../controllers/message.controllers.js'

import { protectRoute } from '../middleware/auth.middleware.js'
import { arcjetProtection } from '../middleware/arcjet.middleware.js'

const router = express.Router()

router.use(arcjetProtection, protectRoute)

router.get("/contacts", getAllContacts)
router.get("/chats", getChatPartners)
router.get("/:id", getMessagesByUserId)
router.post("/send/:id", sendMessage)

/* ======================================================
   🔴 DELETE MESSAGE FEATURE — ROUTE
   ====================================================== */
router.delete("/delete/:messageId", deleteMessage)

export default router
