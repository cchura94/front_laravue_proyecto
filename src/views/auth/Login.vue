<template>
    <div>
        <h1>Ingresar (Login)</h1>
    
        <hr>
        <label for="">Ingrese su Correo</label>
        <input type="email" v-model="credenciales.email">
        {{ errors.email }}
        <br>
        <label for="">Ingrese su Contraseña</label>
        <input type="password" v-model="credenciales.password">
        {{ errors.password }}
        <br>
        <button @click="funIngresar()">Ingresar</button>
        

    </div>
</template>

<script setup>
    import {ref} from "vue"
    import loginService from "./../../services/auth.service"
    import { useRouter } from "vue-router"

    const router = useRouter()

    const credenciales = ref({email: "", password: ""})
    const errors = ref({})

    async function funIngresar(){
        try {
            const {data} = await loginService.loginConLaravel(credenciales.value)
            console.log(data)
            localStorage.setItem("access_token", data.access_token)
            router.push("/admin/perfil")

        } catch (error) {
            console.log(error);
            errors.value =error.response.data.errors
            alert("Error al Autenticar")
        }
    }
</script>