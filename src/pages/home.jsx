import {Button, message, Space} from "antd";
import {Link, Outlet, useNavigate} from "react-router-dom";
import {adminLogout} from "@/apis/api"

const Home = () => {
    const navigate = useNavigate()

    function clickLogout () {
        adminLogout().then(
            res=>{
                if(res.code === 0){
                    message.info("已退出登录")
                    navigate("/login")
                }
            }
        ).catch(err=>{
            console.log(err)
        })
    }


    return (
        <div className={"home"}>

            <div className={"head"}>
                <div className={"logo"}>PhdGao</div>
                <Space >
                    <Link to={"/"}>Questions</Link>
                    <Link to={"/users"}>Users</Link>
                    <Link to={"/todo"}>Todo</Link>
                </Space>
                <Button onClick={clickLogout} type={"text"} size={"large"}>Logout</Button>
            </div>
            <Outlet />

        </div>
    )
}

export default Home