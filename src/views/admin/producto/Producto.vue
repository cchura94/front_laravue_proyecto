<template>
    <div class="card">
        <Toolbar class="mb-4">
            <template #start>
                <Button label="New" icon="pi pi-plus" severity="success" class="mr-2" @click="openNew" />
                <Button label="Delete" icon="pi pi-trash" severity="danger" @click="confirmDeleteSelected" :disabled="!selectedProducts || !selectedProducts.length" />
            </template>
            <template #end>
                <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" chooseLabel="Import" class="mr-2 inline-block" />
                <Button label="Export" icon="pi pi-upload" severity="help" @click="exportCSV($event)"  />
            </template>
        </Toolbar>

        <DataTable ref="dt" :value="productos" dataKey="id" :totalRecords="totalRecords"
            :paginator="true" :rows="2" lazy :loading="loading" @page="onPage($event)"
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
            <Column field="nombre" header="Nombre" sortable style="min-width:16rem"></Column>
            <Column header="Image">
                <template #body="slotProps">
                    <img :src="`http://127.0.0.1:8000/${slotProps.data.imagen}`" :alt="slotProps.data.imagen" class="border-round" style="width: 64px" />
                </template>
            </Column>
            <Column field="precio" header="Precio" sortable style="min-width:8rem">
                <template #body="slotProps">
                    {{formatCurrency(slotProps.data.precio)}}
                </template>
            </Column>
            <Column field="categoria.nombre" header="Categoria" sortable style="min-width:10rem"></Column>
            
            <Column field="estado" header="Estado" sortable style="min-width:12rem">
                <template #body="slotProps">
                    <Tag :value="slotProps.data.estado" :severity="getStatusLabel(slotProps.data.estado)" />
                </template>
            </Column>
            <Column :exportable="false" style="min-width:8rem">
                <template #body="slotProps">
                    <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editProduct(slotProps.data)" />
                    <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteProduct(slotProps.data)" />
                </template>
            </Column>
        </DataTable>

        <h1>Producto</h1>
        {{ productos }}
        <h1>TOTAL: {{ totalRecords }} productos</h1>
    </div>
</template>

<script setup>
    import { ref, onMounted } from "vue"
    import productoService from "@/services/producto.service"

    const productos = ref([])
    const totalRecords = ref(0)
    const loading = ref(false)
    const lazyParams = ref({page: 1})
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

    const guardarProducto = () => {

    }

    const editarProducto = () => {

    }

    const eliminarProducto = () => {

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