import { useContext, useEffect } from "react";
import {AuthContext} from "../auth.context"
import{ login,register,logout,getMe} from "../services/auth.api"

export const useAuth =() =>{

    const context=useContext(AuthContext);
    
    const { user, setUser, loading, setLoading, isInitializing, setIsInitializing } = context;

    const cacheUser = (nextUser) => {
        if (nextUser) {
            localStorage.setItem("prepai_user", JSON.stringify(nextUser));
            return;
        }
        localStorage.removeItem("prepai_user");
    };

    const getErrorMessage = (error, fallbackMessage) => {
        return error?.response?.data?.message || fallbackMessage;
    };

    // Initialize user on mount
    useEffect(() => {
        const initUser = async () => {
            try {
                const data = await getMe();
                setUser(data.user);
                cacheUser(data.user);
            } catch (error) {
                setUser(null);
                cacheUser(null);
            } finally {
                setIsInitializing(false);
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
              cacheUser(data.user);
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
                            cacheUser(data.user);
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
             cacheUser(null);
       } catch (error) {
        
       }finally{
        setLoading(false)
       }
    }
    
    return { user, loading, isInitializing, handleRegister, handleLogin, handleLogout }

    

    
}


