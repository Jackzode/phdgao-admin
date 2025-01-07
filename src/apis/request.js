// axios的封装处理
import axios from "axios"

axios.defaults.withCredentials = true;

const request = axios.create({
    baseURL: 'http://localhost:8082/phdgao',
    timeout: 3000
})




// 添加请求拦截器
// 在请求发送之前 做拦截 插入一些自定义的配置 [参数的处理]
// request.interceptors.request.use((config) => {
//     // 操作这个config 注入token数据
//     // 1. 获取到token
//     // 2. 按照后端的格式要求做token拼接
//
//     return config
// }, (error) => {
//     return Promise.reject(error)
// })

// 添加响应拦截器
// 在响应返回到客户端之前 做拦截 重点处理返回的数据
request.interceptors.response.use((response) => {
    return response.data
}, (error) => {
    return Promise.reject(error)
})





export { request }