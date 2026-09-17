import { useContext, useEffect } from "react";
import {AuthContext} from "../auth.context"
import{ login,register,logout,getMe,demoLogin} from "../services/auth.api"

export const useAuth =() =>{

    const context=useContext(AuthContext);
    
    const { user, setUser, loading, setLoading, isInitializing, setIsInitializing } = context;

    const cacheUser = (nextUser, token) => {
        if (nextUser) {
            localStorage.setItem("prepai_user", JSON.stringify(nextUser));
            if (token) {
                localStorage.setItem("prepai_token", token);
            }
            return;
        }
        localStorage.removeItem("prepai_user");
        localStorage.removeItem("prepai_token");
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
            cacheUser(data.user, data.token);
            return { success: true, error: "" };
       } catch (error) {
            return { success: false, error: getErrorMessage(error, "Invalid email or password") };
       }finally{
        setLoading(false);
       }
    }

    const handleDemoLogin = async () => {
        try {
            setLoading(true);
            const data = await demoLogin();
            if (!data?.user) {
                return { success: false, error: "Unable to sign in as demo user" };
            }
            setUser(data.user);
            cacheUser(data.user, data.token);
            return { success: true, error: "" };
        } catch (error) {
            return { success: false, error: getErrorMessage(error, "Demo login failed") };
        } finally {
            setLoading(false);
        }
    };

    const handleRegister=async ({username,email,password})=>{

        try {
              setLoading(true);
              const data=await register({username,email,password});
              if (!data?.user) {
                return { success: false, error: "Unable to register" };
              }
              setUser(data.user)
              cacheUser(data.user, data.token);
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
             await logout();
             setUser(null)
             cacheUser(null);
       } catch (error) {
             setUser(null);
             cacheUser(null);
       }finally{
        setLoading(false)
       }
    }
    
    return {
        user,
        loading,
        isInitializing,
        handleRegister,
        handleLogin,
        handleDemoLogin,
        handleLogout,
        register: handleRegister,
        login: handleLogin,
        demoLogin: handleDemoLogin,
        logout: handleLogout
    }

    

    
}


