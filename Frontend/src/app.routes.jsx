import { createBrowserRouter } from "react-router";
import Login from "./features/auth/pages/login";
import Register from "./features/auth/pages/register";
import Protected from "./features/auth/components/Protected";
import Home from "./features/interview/pages/home";
import Interview from "./features/interview/pages/interview";
import Landing from "./features/landing/pages/landing";


export const router = createBrowserRouter([
    {
        path: "/",
        element: <Landing />
    },
    {
        path: "/login",
        element:<Login />
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/app",
        element: <Protected><Home /></Protected>
    },
    {
        path:"/interview/:interviewId",
        element: <Protected><Interview /></Protected>
    }
])