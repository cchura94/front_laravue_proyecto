<script setup>
import { ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';

const model = ref([
    {
        label: 'Admin',
        items: [
            { label: 'Administrador', icon: 'pi pi-fw pi-home', to: '/admin' },
            { label: 'Perfil', icon: 'pi pi-fw pi-id-card', to: '/admin/perfil' }
        ]
    },
    {
        label: 'Gestión Productos',
        items: [
            { label: 'Categorias', icon: 'pi pi-fw pi-check-square', to: '/admin/categoria' },
            { label: 'Productos', icon: 'pi pi-fw pi-clone', to: '/admin/producto' }
        ]
    },
    {
        label: 'Gestión Usuarios',
        items: [
            { label: 'Usuarios', icon: 'pi pi-fw pi-users', to: '/admin/usuario', badge: 'NEW' },
        ]
    },
    {
        label: 'Gestión Pedidos',
        items: [
            { label: 'Nuevo Pedido', icon: 'pi pi-fw pi-prime', to: '/utilities/icons' },
            { label: 'Pedidos', icon: 'pi pi-fw pi-desktop', url: 'https://www.primefaces.org/primeflex/', target: '_blank' },
            { label: 'Clientes', icon: 'pi pi-fw pi-users', to: '/admin/cliente' },
        ]
    }
]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    <!--
        <li>
            <a href="https://www.primefaces.org/primeblocks-vue/#/" target="_blank">
                <img src="/layout/images/banner-primeblocks.png" alt="Prime Blocks" class="w-full mt-3" />
            </a>
        </li>
    -->
    </ul>
</template>

<style lang="scss" scoped></style>
