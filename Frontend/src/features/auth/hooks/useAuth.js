import { useContext, useEffect } from "react";
import {AuthContext} from "../auth.context"
import{ login,register,logout,getMe} from "../services/auth.api"

export const useAuth =() =>{

    const context=useContext(AuthContext);
    
    const {user,setUser,loading,setLoading}= context;

    const getErrorMessage = (error, fallbackMessage) => {
        return error?.response?.data?.message || fallbackMessage;
    };

    // Initialize user on mount
    useEffect(() => {
        const initUser = async () => {
            try {
                const data = await getMe();
                setUser(data.user);
            } catch (error) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        initUser();
    }, []);

    const handleLogin=async ({email,password})=>{
       try {
            setLoading(true);
            const data=await login({email,password});
            if (!data?.user) {
                 return { success: false, error: "Unable to login" };
            }
            setUser(data.user);
              return { success: true, error: "" };
       } catch (error) {
              return { success: false, error: getErrorMessage(error, "Invalid email or password") };
       }finally{
        setLoading(false);
       }
    }

    const handleRegister=async ({username,email,password})=>{

        try {
              setLoading(true);
              const data=await register({username,email,password});
              if (!data?.user) {
                return { success: false, error: "Unable to register" };
              }
              setUser(data.user)
              return { success: true, error: "" };
        } catch (error) {
              return { success: false, error: getErrorMessage(error, "Registration failed") };
        }finally{
              setLoading(false)
        }
    }

    const handleLogout=async ()=>{
       try {
             setLoading(true);
             const data=await logout();
             setUser(null)
       } catch (error) {
        
       }finally{
        setLoading(false)
       }
    }
    
    return {user,loading,handleRegister,handleLogin,handleLogout}

    

    
}


