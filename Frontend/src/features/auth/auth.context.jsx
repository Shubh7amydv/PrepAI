// import { useState } from "react";
// import { createContext } from "react";

// export const AuthContext=createContext();

// export const AuthProvider=({children})=>{
    
//     const [user,setUser]=useState(null)

//     const [loading,setLoading]=useState(false);

//     return (
//         <AuthContext.Provider value={{user,setUser,loading,setLoading}}>
//             {children}
//         </AuthContext.Provider>
//     )
// }




// /**
 
//    createContext()  → creates empty pipe

//    AuthProvider     → creates water (data: user, loading)

//    Provider         → pushes water into pipe

//    children         → receive water

//  */


import { createContext, useState } from "react";


export const AuthContext = createContext()

const getCachedUser = () => {
    try {
        const rawUser = localStorage.getItem("prepai_user")
        return rawUser ? JSON.parse(rawUser) : null
    } catch (error) {
        return null
    }
}


export const AuthProvider = ({ children }) => { 

    const [ user, setUser ] = useState(getCachedUser)
    const [ loading, setLoading ] = useState(false)
    const [ isInitializing, setIsInitializing ] = useState(true)

    


    return (
        <AuthContext.Provider value={{ user, setUser, loading, setLoading, isInitializing, setIsInitializing }} >
            {children}
        </AuthContext.Provider>
    )

    
}