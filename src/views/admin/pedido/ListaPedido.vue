<template>
    <div class="card">
        <DataTable ref="dt" :value="pedidos" dataKey="id"
    :paginator="true" :rows="10"
    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" :rowsPerPageOptions="[5,10,25]"
    currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} productos">
    <template #header>
        <div class="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 class="m-0">Pedidos</h4>
            <IconField iconPosition="left">
                <InputIcon>
                    <i class="pi pi-search" />
                </InputIcon>
                <InputText placeholder="Buscar..." />
            </IconField>
        </div>
    </template>
    <Column field="id" header="ID" sortable style="min-width:2rem"></Column>
    <Column field="fecha" header="FECHA" sortable style="min-width:10rem"></Column>
    <Column field="cliente" header="CLIENTE" sortable style="min-width:16rem">
        <template #body="slotProps">
            <h6>NOMBRE: {{slotProps.data.cliente?.nombre_completo}}</h6>
            <h6>CI/NIT: {{slotProps.data.cliente?.ci_nit}}</h6>
        </template>
    </Column>
    <Column :exportable="false" style="min-width:8rem">
        <template #body="slotProps">
            <Button icon="pi pi-table" rounded class="mr-2" @click="mostrarPedido(slotProps.data)" />
            <Button icon="pi pi-pdf" rounded severity="success" @click="generarPedidoPDF(slotProps.data)" />
        </template>
    </Column>
</DataTable>
    </div>


<Dialog v-model:visible="visible" modal header="Detalle Pedido" :style="{ width: '50rem' }">

    <Card>

        <template #title>Pedido: #{{ pedido.id }} </template>
        <template #subtitle>------------</template>
        <template #content>
            <h5>Cliente: {{ pedido.cliente?.nombre_completo }}</h5>
            <h5>TELEFONO: {{ pedido.cliente?.telefono }}</h5>
            <h5>CI/NIT: {{ pedido.cliente?.ci_nit }}</h5>
        </template>
    </Card>

    <DataTable :value="pedido.productos">
        <Column field="id" header="COD"></Column>
        <Column field="nombre" header="NOMBRE"></Column>
        <Column field="precio" header="PRECIO"></Column>
        <Column field="pivot.cantidad" header="Cantidad"></Column>
    </DataTable>
    
    
    <div class="flex justify-content-end gap-2">
        <Button type="button" label="Cerrar" severity="secondary" @click="visible = false"></Button>
    </div>
</Dialog>
</template>

<script setup>

import pedidoService from '@/services/pedido.service';
import { onMounted, ref } from 'vue';

const pedidos = ref([])
const totalRecords = ref(0)
const visible = ref(false);

const pedido = ref({})

onMounted(() => {
    getPedidos()
})

const getPedidos = async () => {
    const {data} = await pedidoService.index();

    pedidos.value = data.data
    totalRecords.value = data.total

}

const mostrarPedido = (data) => {
    visible.value = true;
    pedido.value = data
}
const generarPedidoPDF = (data) => {

}
</script>