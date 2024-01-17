<template>
    <!--
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
-->
    <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <div class="flex flex-column align-items-center justify-content-center">
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
                    <div class="text-center mb-5">
                        <img src="/demo/images/login/avatar.png" alt="Image" height="50" class="mb-3" />
                        <div class="text-900 text-3xl font-medium mb-3">Ingresar</div>
                        <span class="text-600 font-medium">Ingrese sus Credenciales...</span>
                    </div>

                    <div>
                        <label for="email1" class="block text-900 text-xl font-medium mb-2">Correo</label>
                        <InputText id="email1" type="text" placeholder="Correo electronico" class="w-full md:w-30rem mb-5" style="padding: 1rem" v-model="credenciales.email" />
                        {{ errors.email }}

                        <label for="password1" class="block text-900 font-medium text-xl mb-2">Contraseña</label>
                        <Password id="password1" v-model="credenciales.password" placeholder="Contraseña" :toggleMask="true" class="w-full mb-3" inputClass="w-full" :inputStyle="{ padding: '1rem' }"></Password>
                        {{ errors.password }}

                        <div class="flex align-items-center justify-content-between mb-5 gap-5">
                            <div class="flex align-items-center">
                                <Checkbox v-model="checked" id="rememberme1" binary class="mr-2"></Checkbox>
                                <label for="rememberme1">Recordar</label>
                            </div>
                            <a class="font-medium no-underline ml-2 text-right cursor-pointer" style="color: var(--primary-color)">¿Has olvidado tu contraseña?</a>
                        </div>
                        <Button label="Ingresar" class="w-full p-3 text-xl" @click="funIngresar()"></Button>
                    </div>
                </div>
            </div>
        </div>
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