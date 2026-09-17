import { createContext, useState, useEffect } from "react";
import { getMe } from "./services/auth.api";

export const AuthContext = createContext();

const getCachedUser = () => {
    try {
        const rawUser = localStorage.getItem("prepai_user");
        return rawUser ? JSON.parse(rawUser) : null;
    } catch (error) {
        return null;
    }
};

export const AuthProvider = ({ children }) => {
    const [ user, setUser ] = useState(getCachedUser);
    const [ loading, setLoading ] = useState(false);
    const [ isInitializing, setIsInitializing ] = useState(true);

    // Initialize user ONCE on application mount
    useEffect(() => {
        let isMounted = true;
        const initUser = async () => {
            const token = localStorage.getItem("prepai_token");
            try {
                const data = await getMe();
                if (isMounted && data?.user) {
                    setUser(data.user);
                    localStorage.setItem("prepai_user", JSON.stringify(data.user));
                }
            } catch (error) {
                if (isMounted) {
                    // Only clear if no valid cached token/user or 401
                    if (error?.response?.status === 401) {
                        setUser(null);
                        localStorage.removeItem("prepai_user");
                        localStorage.removeItem("prepai_token");
                    }
                }
            } finally {
                if (isMounted) {
                    setIsInitializing(false);
                }
            }
        };

        initUser();

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, loading, setLoading, isInitializing, setIsInitializing }}>
            {children}
        </AuthContext.Provider>
    );
};