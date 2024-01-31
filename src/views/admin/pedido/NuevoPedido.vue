<template>
    <div class="grid">
        <div class="col-7">
            <div class="card">
                <div class="text-center p-1 border-round-sm bg-primary font-bold ">Productos</div>
                
                <DataTable ref="dt" :value="productos" dataKey="id" :totalRecords="totalRecords"
                    :paginator="true" :rows="5" lazy :loading="loading" @page="onPage($event)"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" :rowsPerPageOptions="[5,10,25]"
                    currentPageReportTemplate="Mostrando {first} al {last} de {totalRecords} productos">
                    <template #header>
                        <div class="flex flex-wrap gap-2 align-items-center justify-content-between">
                            <h4 class="m-0">Gestión Productos</h4>
                            <span class="p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText placeholder="Buscar..." v-model="buscar" @keyup.enter="getProductos()" />
                            </span>
                        </div>
                    </template>
                    <Column field="id" header="ID" sortable style="min-width:2rem"></Column>
                    <Column field="nombre" header="Nombre" sortable style="min-width:10rem"></Column>
                    <Column header="Image">
                        <template #body="slotProps">
                            <Image :src="`http://127.0.0.1:8000/${slotProps.data.imagen}`" alt="Image" width="64px" preview />
                        </template>
                    </Column>
                    <Column field="precio" header="Precio" sortable style="min-width:3rem">
                        <template #body="slotProps">
                            {{formatCurrency(slotProps.data.precio)}}
                        </template>
                    </Column>
                    <Column field="categoria.nombre" header="Categoria" sortable style="min-width:3rem"></Column>
                    
                    <Column :exportable="false" style="min-width:5rem">
                        <template #body="slotProps">
                            <Button icon="pi pi-plus" rounded severity="success" @click="confirmDeleteProduct(slotProps.data)" />
                        </template>
                    </Column>
                </DataTable>

            </div>
        </div>
        <div class="col-5">
            <div class="grid">
                <div class="col-12">
                    <div class="card">
                        <div class="text-center p-1 border-round-sm bg-primary font-bold ">Detalle Venta</div>

                    </div>
                </div>
                <div class="col-12">
                    <div class="card">
                        <div class="text-center p-1 border-round-sm bg-primary font-bold ">Cliente</div>

                    </div>
                </div>
                <div class="col-12">
                    <div class="card">
                        <div class="text-center p-1 border-round-sm bg-primary font-bold ">Pedido</div>

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>

import { ref, onMounted } from "vue"
    import productoService from "@/services/producto.service"
import Swal from "sweetalert2";
const dt = ref();

    const productos = ref([])
    const totalRecords = ref(0)
    const loading = ref(false)
    const lazyParams = ref({page: 0})
    const buscar = ref("")
onMounted(() => {
        getProductos()
    })
const getProductos = async () => {
        try {
            loading.value = true;

            let page = lazyParams.value.page + 1;
            let limit = lazyParams.value.rows;

            const { data } = await productoService.listar(page, limit, buscar.value)
            productos.value = data.data
            totalRecords.value = data.total

            loading.value = false;
        } catch (error) {
            alert("Error al solicitar los datos")
        }
    }
const onPage = (event) => {
        lazyParams.value = event;
        getProductos()
    }
const formatCurrency = (value) => {
        if(value)
            return value.toLocaleString('en-US', {style: 'currency', currency: 'USD'});
        return;
    };
const getStatusLabel = (status) => {
        switch (status) {
            case true:
                return 'success';

            case false:
                return 'warning';
            default:
                return 'danger';
        }
    };

</script>