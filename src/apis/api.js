import {request} from "@/apis/request";


export function loginStatus() {
    return request({
        url: '/checkLoginStatus',
        method: 'get',
    })
}

export function adminLogin(data) {
    return request({
        url: "/login",
        method: "post",
        data: data,
    })
}

export function adminLogout() {
    return request({
        url: "/logout",
        method: "get",
        withCredentials: true
    })
}

export function searchQuestionByTitle(data) {
    return request({
        url: "/searchQuestionByTitle",
        method: "GET",
        params: {
            title: data,
        },
        withCredentials: true
    })
}

export function deleteQuestionByID(id) {
    return request({
        url: "/deleteQuestionByID",
        method: "GET",
        params: {
            id: id,
        },
        withCredentials: true
    })
}


export function updateQuestionByID(data) {
    return request({
        url: "/updateQuestionByID",
        method: "post",
        data: data,
        withCredentials: true
    })
}


export function uploadPicture(data) {
    return request({
        url: "/uploadPicture",
        method: "POST",
        data: data,
    })
}

