import { Meta } from "./meta.service"

export default {
    enviarMensaje(msgTexto){
        return Meta().post("/messages", msgTexto);
    },

    enviarImg(urlImg){
        
    }
}