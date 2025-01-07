import React from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import {Button, Checkbox, Form, Input, Flex, message} from 'antd';
import "./index.scss"
import {adminLogin } from '@/apis/api'
import {useNavigate} from "react-router-dom";


const Login = () => {

    const navigate = useNavigate()

    const onFinish = (values) => {
        adminLogin(values).then(
            res => {
                if (res.code === 0) {
                    navigate('/')
                }
            }
        ).catch(err => {
            console.log(err)
            message.error("登录失败");
        })
    };



    return (
        <div className="loginPage">
            <div className="loginForm">
                <Form
                    name="login"
                    initialValues={{
                        remember: true,
                    }}
                    style={{
                        maxWidth: 360,
                    }}
                    onFinish={onFinish}
                >
                    <h1>
                        PhdGao-Admin
                    </h1>
                    <Form.Item
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Username!',
                            },
                        ]}
                    >
                        <Input size="large" prefix={<UserOutlined />} placeholder="Username" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Password!',
                            },
                        ]}
                    >
                        <Input size="large" prefix={<LockOutlined />} type="password" placeholder="Password" />
                    </Form.Item>
                    <Form.Item>
                        <Flex justify="space-between" align="center">
                            <Form.Item name="remember" valuePropName="checked" noStyle>
                                <Checkbox>Remember me</Checkbox>
                            </Form.Item>
                            <a href="">Forgot password</a>
                        </Flex>
                    </Form.Item>

                    <Form.Item>
                        <Button size="large" block type="primary" htmlType="submit">
                            Log in
                        </Button>
                    </Form.Item>
                </Form>
            </div>


        </div>
    );
};
export default Login;