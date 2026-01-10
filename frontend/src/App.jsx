import { Routes, Route } from "react-router"
import ChatPage from "./pages/ChatPage"
import LoginPage from "./pages/LoginPage"
import SignUpPage from "./pages/SignUpPage"
import { useAuthStore } from "./store/useAuthStore"
import { useEffect } from "react"
import { Navigate } from "react-router"
import PageLoader from "./components/PageLoader"
import { Toaster } from "react-hot-toast"


export default function App() {

  const {checkAuth,isCheckingAuth,authUser} = useAuthStore()

  useEffect(()=>{
    checkAuth()
  },[checkAuth])
  

  if(isCheckingAuth) return <PageLoader />

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0b0d12]">

      {/* NEO-NOIR GRID — ONE LINE ONLY */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,180,0,0.14)_1px,transparent_1px),linear-gradient(to_bottom,rgba(80,160,255,0.14)_1px,transparent_1px)] bg-[size:30px_30px]" />

      {/* SOFT GLOWS (14-inch tuned) */}
      <div className="absolute top-[-120px] left-[-120px] w-[420px] h-[420px] bg-amber-500/25 blur-[150px]" />
      <div className="absolute bottom-[-120px] right-[-120px] w-[420px] h-[420px] bg-blue-500/25 blur-[150px]" />

      {/* CONTENT */}
      <div className="relative z-10">
        <Routes>
          <Route path="/" element={authUser ? <ChatPage /> : <Navigate to={"/login"}/>} />
          <Route path="/login" element={!authUser ?<LoginPage /> : <Navigate to={"/"}/>} />
          <Route path="/signup" element={!authUser ?<SignUpPage />: <Navigate to={"/"}/>} />
        </Routes>

        <Toaster/>
      </div>

    </div>
  )
}
