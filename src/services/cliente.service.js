import { Api } from "./api.service"

export default {

    listar(page=1, limit=10, q=''){
        return Api().get(`/cliente?page=${page}&limit=${limit}&q=${q}`);
    },
    guardar(datos){
        return Api().post("/cliente", datos);
    },
    mostrar(id){
        return Api().get(`/cliente/${id}`);
    },
    modificar(id, datos){
        return Api().put(`/cliente/${id}`, datos);
    },
    eliminar(id){
        return Api().delete(`/cliente/${id}`);
    },

    actualizaImagen(id, formData){
        return Api().post(`/cliente/${id}/carga-imagen`, formData)
    },
    
    buscarCliente(q=''){
        return Api().get(`/cliente/buscar?q=${q}`);
    },

}