import { Api } from "./api.service"

export default {
    listarUsuario(){
        return Api().get("/user");
    },

    guardarUsuario(datos){
        return Api().post("/user", datos);
    },

    mostrarUsuario(id){
        return Api().get("/user/"+id);
    },

    modificarUsuario(id, datos){
        return Api().put("/user/"+id, datos);
    },

    elininarUsuario(id){
        return Api().delete("/user/"+id);
    },
}