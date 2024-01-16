<template>
    <h1>Mi Perfil</h1>
    <p>{{ perfil }}</p>

    <button @click="funSalir()">Salir</button>
</template>

<script setup>
    import { onMounted, ref } from "vue"
    import authService from "../../services/auth.service"

    const perfil = ref(null)

    onMounted(async () => {
        
        const res = await authService.perfil()
        perfil.value = res.data

    })

    function funSalir(){
        localStorage.removeItem("access_token")
    }
</script>