import useKeyboardSound from "../hooks/useKeyboardSound"
import { useRef, useState } from "react"
import { useChatStore } from "../store/useChatStore"
import { ImageIcon, XIcon ,SendIcon} from "lucide-react"
import { toast } from "react-hot-toast"

function MessageInput() {
  const { playRandomKeyStrokeSound } = useKeyboardSound()
  const [text, setText] = useState("")
  const [imagePreview, setImagePreview] = useState(null)
  const fileInputRef = useRef(null)
  const { sendMessage, isSoundEnabled } = useChatStore()

  const handleSendMessage = (e) => {
    e.preventDefault()

    if (!text.trim() && !imagePreview) return

    if (isSoundEnabled) playRandomKeyStrokeSound()

    sendMessage({
      text: text.trim(),
      image: imagePreview
    })

    setText("")
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file")
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => setImagePreview(reader.result)
    reader.readAsDataURL(file)
  }

  const removeImage = () => {
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  return (
    <div className="p-4 border-t border-[#262626]">
      {imagePreview && (
        <div className="max-w-3xl mx-auto mb-3 flex items-center">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-[#262626]"
            />
            <button
              onClick={removeImage}
              type="button"
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#141414] flex items-center justify-center text-[#A1A1A1] hover:bg-[#1F2933]"
            >
              <XIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSendMessage}
        className="max-w-3xl mx-auto flex space-x-4"
      >
        <input
          type="text"
          value={text}
          onChange={(e) => {
            setText(e.target.value)
            isSoundEnabled && playRandomKeyStrokeSound()
          }}
          className="flex-1 bg-[#161616] border border-[#262626] rounded-lg py-2 px-4 text-[#F5F5F5] placeholder-[#737373]"
          placeholder="Type your message..."
        />

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className={`bg-[#141414] text-[#737373] hover:text-[#F5F5F5] rounded-lg px-4 transition-colors ${
            imagePreview ? "text-[#7C9EFF]" : ""
          }`}
        >
          <ImageIcon className="w-5 h-5" />
        </button>

        <button
          type="submit"
          disabled={!text.trim() && !imagePreview}
          className="bg-[#7C9EFF] text-black rounded-lg px-4 py-2 font-medium hover:bg-[#5B7CFA] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <SendIcon className="w-5 h-5" />
        </button>
      </form>
    </div>
  )
}

export default MessageInput
