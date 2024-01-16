import axios from "axios"

let local = "dev";

let urlBase = ""

if(local == 'dev'){
    urlBase = "http://127.0.0.1:8000/api"
}if(local == 'prod'){
    urlBase = "http://miempresa.com"
}if(local == 'test'){
    urlBase = "http://127.0.0.1:3000"
}

export function Api(){

    let token = localStorage.getItem("access_token");

    const api = axios.create({
        baseURL: urlBase,
        headers:{
            'Authorization': 'Bearer '+token,
            'Content-Type': 'application/json'
        }
    });

    // interceptor
    api.interceptors.response.use(
        (response) => {
            return response;
        },
        (error) => {
            console.log("INTERCEPTOR", error.response.data)
            if(error.response.status === 401){
                localStorage.removeItem("access_token")
                window.location.href = "/ingresar"
            }

            return Promise.reject(error);
        }
    )

    return api;
} 