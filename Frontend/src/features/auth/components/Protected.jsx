import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router";
import React from 'react'

const Protected = ({children}) => {
    const { user } = useAuth()

    if(!user){
        return <Navigate to={'/login'} />
    }
    
    return children
}

export default Protected