import { useContext } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout, demoLogin } from "../services/auth.api";

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

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

    const handleLogin = async ({ email, password }) => {
        try {
            setLoading(true);
            const data = await login({ email, password });
            if (!data?.user) {
                return { success: false, error: "Unable to login" };
            }
            setUser(data.user);
            cacheUser(data.user, data.token);
            return { success: true, error: "" };
        } catch (error) {
            return { success: false, error: getErrorMessage(error, "Invalid email or password") };
        } finally {
            setLoading(false);
        }
    };

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

    const handleRegister = async ({ username, email, password }) => {
        try {
            setLoading(true);
            const data = await register({ username, email, password });
            if (!data?.user) {
                return { success: false, error: "Unable to register" };
            }
            setUser(data.user);
            cacheUser(data.user, data.token);
            return { success: true, error: "" };
        } catch (error) {
            return { success: false, error: getErrorMessage(error, "Registration failed") };
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            setLoading(true);
            // Clear local state first to immediately revoke client session
            setUser(null);
            cacheUser(null);
            await logout();
            return { success: true };
        } catch (error) {
            setUser(null);
            cacheUser(null);
            return { success: true };
        } finally {
            setLoading(false);
        }
    };

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
    };
};
