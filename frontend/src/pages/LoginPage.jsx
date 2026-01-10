import { useAuthStore } from "../store/useAuthStore";

const LoginPage = () => {
    const {authUser,isLoading,login} = useAuthStore();
  return (
    <div>
      login
    </div>
  )
}

export default LoginPage
