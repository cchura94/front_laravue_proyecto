<template>
    <div class="card">
        <h1>Mi Perfil</h1>
        <h2>Nombre: {{ perfil.name }}</h2>
        <h2>Correo: {{ perfil.email }}</h2>
        <h2>Creado en: {{ perfil.created_at }}</h2>
    
        <Button @click="funSalir()">Salir</Button>
    </div>
</template>

<script setup>
    import { onMounted, ref } from "vue"
    import authService from "../../services/auth.service"

    const userBlank = {name: '', email: '', created_at:''}

    const perfil = ref(userBlank)

    onMounted(async () => {
        
        const res = await authService.perfil()
        perfil.value = res.data

    })

    function funSalir(){
        localStorage.removeItem("access_token")
    }
</script>