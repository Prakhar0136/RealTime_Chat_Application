import { useAuthStore } from "../store/useAuthStore";
import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import { MessageCircleIcon, LoaderIcon } from "lucide-react";
import { useState } from "react"; 
import { LockIcon, MailIcon } from "lucide-react";
import { Link } from "react-router";



function LoginPage(){
    const [formData, setFormData] = useState({
      email:"",
      password:""
    })
    const{login, isLoggingIn} = useAuthStore();

    const handleSubmit = (e) => {
    e.preventDefault();
    login(formData);
  }
 return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl md:h-[550px] h-auto">
        <BorderAnimatedContainer>
          <div className="w-full h-full flex flex-col md:flex-row">
            
            {/* --- LEFT SIDE: FORM --- */}
            <div className="w-full md:w-1/2 p-8 flex items-center justify-center md:border-r border-blue-800/30">
              <div className="w-full max-w-md">
                
                <div className="text-center mb-6">
                  <MessageCircleIcon className="w-12 h-12 mx-auto text-amber-400 mb-2" />
                  <h2 className="text-2xl font-bold text-blue-50 mb-1">Welcome Back</h2>
                  <p className="text-blue-300/70">Login to access your account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
            
                  <div>
                    <label className="auth-input-label text-blue-200 block mb-1.5 text-sm font-medium">Email</label>
                    <div className="relative">
                      <MailIcon className="auth-input-icon text-blue-400/80 absolute left-3 top-1/2 -translate-y-1/2 size-5" />
                      <input 
                        type="email" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="input w-full pl-10 pr-4 py-2 rounded-lg bg-blue-950/30 border border-blue-800 text-blue-100 placeholder-blue-600/50 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 focus:outline-none transition-all"
                        placeholder="prakharp12345@gmail.com" 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="auth-input-label text-blue-200 block mb-1.5 text-sm font-medium">Password</label>
                    <div className="relative">
                      <LockIcon className="auth-input-icon text-blue-400/80 absolute left-3 top-1/2 -translate-y-1/2 size-5" />
                      <input 
                        type="password" 
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        className="input w-full pl-10 pr-4 py-2 rounded-lg bg-blue-950/30 border border-blue-800 text-blue-100 placeholder-blue-600/50 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 focus:outline-none transition-all"
                        placeholder="••••••••" 
                      />
                    </div>
                  </div>

                  <button 
                    className="w-full bg-amber-500 hover:bg-amber-600 text-blue-950 font-bold rounded-lg py-2.5 transition-colors mt-2" 
                    type="submit" 
                    disabled={isLoggingIn}
                  >
                    {isLoggingIn ? <LoaderIcon className="w-5 h-5 mx-auto animate-spin"/> : "Sign In"}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <Link className="text-sm text-blue-400 hover:text-amber-400 transition-colors" to="/signup">
                    Don't have an account? Sign Up
                  </Link>
                </div>
              </div>
            </div>

            {/* --- RIGHT SIDE: IMAGE & INFO --- */}
            {/* Now matches the Left side theme (Blue/Amber) */}
            <div className="hidden md:w-1/2 md:flex items-center justify-center p-8 bg-gradient-to-bl from-blue-900/20 to-transparent">
              <div className="w-full max-w-sm">
                <img
                  src="/login.png"
                  alt="People using mobile devices"
                  className="w-full h-auto object-contain opacity-90 hover:scale-[1.02] transition-transform duration-500"
                />
                
                <div className="mt-8 text-center">
                  {/* Matching Amber Heading */}
                  <h3 className="text-xl font-bold text-amber-400 mb-4">Connect anytime and anywhere</h3>

                  <div className="flex justify-center gap-3">
                    {/* Updated Badges to match Amber/Blue theme */}
                    <span className="px-3 py-1 rounded-full bg-blue-900/40 text-blue-200 text-xs font-medium border border-blue-700/50">
                      Free
                    </span>
                    <span className="px-3 py-1 rounded-full bg-blue-900/40 text-blue-200 text-xs font-medium border border-blue-700/50">
                      Easy Setup
                    </span>
                    <span className="px-3 py-1 rounded-full bg-blue-900/40 text-blue-200 text-xs font-medium border border-blue-700/50">
                      Private
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </BorderAnimatedContainer>
      </div>
    </div>
  )
}

export default LoginPage
