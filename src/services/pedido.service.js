import { Api } from "./api.service"

export default {
    index(page=''){
        return Api().get(`/pedido?page=${page}`);
    },
    store(datos){
        return Api().post("/pedido", datos);
    },
    show(id){
        return Api().get(`/pedido/${id}`);
    }
}