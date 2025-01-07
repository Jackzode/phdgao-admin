import {createBrowserRouter, } from "react-router-dom"
import React, {useState, useEffect} from 'react';
import Home from "./pages/home";
import Login from "@/pages/login";
import NotFound from "./pages/notfound";
import Questions from "@/components/questions";
import Users from "@/components/users";
import {loginStatus} from "@/apis/api";
import {Spin} from "antd";
import Todo from "@/pages/todo";


export const ProtectedRoute = ({ element }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    // const navigate = useNavigate();
    useEffect(() => {
        loginStatus() // 调用后端接口验证登录状态
            .then(response => {
                if (response.code === 0) {
                    setIsAuthenticated(true);
                } else {
                    // navigate("/login"); // 跳转到登录页面
                    window.location.href = "/login";
                }
            })
            .catch(() => {
                // navigate("/login");
                window.location.href = "/login";
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <Spin size="large" />; // 或者加载指示器
    }

    return isAuthenticated ? element : null;
};


const router = createBrowserRouter([
    {
        path: "/",
        element: <ProtectedRoute element={<Home />} />,
        children: [
            {
                index: true,
                element: <Questions />
            },
            {
                path: "/users",
                element: <Users />
            },
            {
                path: "/todo",
                element: <Todo />
            },
        ]
    },

    {
        path: "/login",
        element: <Login />
    },

    {
        path: "*", // 捕获所有未匹配的路径
        element: <NotFound/>,
    }

])


export default router




