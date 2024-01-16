<template>
    <div>
    <h1>Hola Facebook</h1>
    <br />
    <input type="text" v-model="mensaje" />
    <button type="button" @click="enviarMensaje()">Enviar Mensaje</button>
    <button type="button" @click="sendUsuario()">Guardar Usuario</button>
    <hr>
    {{ usuarios }}

  </div>
</template>
<script setup>
import { ref } from "vue";
import messageService from "@/services/message.service";
import usuarioService from "@/services/usuario.service"

const mensaje = ref("");
const usuarios = ref([])

async function enviarMensaje() {
  let men = {
      "messaging_product": "whatsapp",
      "recipient_type": "individual",
      "to": "59173277937",
      "type": "text",
      "text": {
        "preview_url": false,
        "body": mensaje.value
        }
    };
  await messageService.enviarMensaje(men);
}

async function getUsuarios(){
  const {data} = await usuarioService.listarUsuario();
  usuarios.value = data
  console.log(data)
}

async function sendUsuario(){
  const {data} = await usuarioService.guardarUsuario({name: "cristian", email: "cristian@mail.com", password: "cristian54321"});
 
  console.log(data)
}



getUsuarios()
</script>
