import { Api } from "./api.service"

export default {
    index(q=''){
        return Api().get("/categoria?q="+q);
    },
    store(datos){
        return Api().post("/categoria", datos);
    },
    show(id){
        return Api().get(`/categoria/${id}`);
    },
    update(id, datos){
        return Api().put(`/categoria/${id}`, datos);
    },
    destroy(id){
        return Api().delete(`/categoria/${id}`);
    },
}