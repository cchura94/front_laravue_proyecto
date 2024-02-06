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
                    <Column field="stock" header="C" sortable style="min-width:2rem"></Column>
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
                            <Button icon="pi pi-plus" rounded severity="success" @click="agregarProducto(slotProps.data)" />
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
                        
                        <DataTable :value="carrito" size="small">
                            <Column field="nombre" header="Nom"></Column>
                            <Column field="cantidad" header="Cantidad">
                                <template #body="slotProps">
                                    <Button icon="pi pi-plus" rounded severity="success" @click="aumentar(slotProps.data)" size="small" />
                                    <p>{{ slotProps.data.cantidad }}</p>
                                    <Button icon="pi pi-minus" rounded severity="info" @click="reducir(slotProps.data)" size="small" />
                                </template>
                            </Column>
                            <Column field="precio" header="Precio"></Column>
                            <Column :exportable="false" style="min-width:5rem">
                                <template #body="slotProps">
                                    <Button icon="pi pi-trash" rounded severity="danger" @click="quitarProducto(slotProps.data)" />
                                </template>
                            </Column>
                        </DataTable>

                    </div>
                </div>
                <div class="col-12">
                    <div class="card">
                        <div class="text-center p-1 border-round-sm bg-primary font-bold ">Cliente</div>
                        <div class="flex flex-wrap gap-2 align-items-center justify-content-between mt-4">
                            <Button label="Nuevo Cliente" rounded severity="info" @click="clienteDialog=true" />
                            
                            <span class="p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText placeholder="Buscar..." v-model="buscar_clie" @keyup.enter="buscarCliente()" />
                            </span>
                        </div>

                        <div class="card" v-if="cliente_seleccionado.id">
                            <h5>NOMBRE Cliente: {{ cliente_seleccionado.nombre_completo }}</h5>
                            <h5>CI/NIT: {{ cliente_seleccionado.ci_nit }}</h5>
                            <h5>TELEFONO: {{ cliente_seleccionado.telefono }}</h5>
                            <h5>DIRECCIÓN: {{ cliente_seleccionado.direccion }}</h5>
                        </div>

                    </div>
                </div>
                <div class="col-12">
                    <div class="card">
                        <div class="text-center p-1 border-round-sm bg-primary font-bold ">Pedido</div>
                        <div class="p-fluid">
                            <div class="field">
                                <label for="description">Observaciónes</label>
                                <Textarea id="description" v-model="pedido.observacion" rows="3" cols="20" />
                            </div>
          
                            <Button label="Guardar Nuevo Pedido" rounded severity="info" @click="registrarPedido()" />
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>

    <Dialog v-model:visible="clienteDialog" :style="{width: '450px'}" header="Datos Cliente" :modal="true" class="p-fluid">
            <div class="field">
                <label for="name">nombre_completo</label>
                <InputText id="name" v-model.trim="cliente.nombre_completo" required="true" autofocus :class="{'p-invalid': submitted && !cliente.nombre_completo}" />
                <small class="p-error" v-if="submitted && !cliente.nombre_completo">nombre_completo es obligatorio.</small>
            </div>
            <div class="field">
                <label for="ci">ci_nit</label>
                <InputText id="ci" v-model.trim="cliente.ci_nit" required="true" autofocus  />
            </div>
            <div class="field">
                <label for="tel">telefono</label>
                <InputText id="tel" v-model.trim="cliente.telefono" required="true" autofocus />
                
            </div>
            <div class="field">
                <label for="name">direccion</label>
                <InputText id="name" v-model.trim="cliente.direccion" required="true" autofocus />
            </div>

            <div class="field">
                <Button label="Guardar Cliente" rounded severity="info" @click="guardarCliente" />
            </div>
    </Dialog>
</template>

<script setup>

import { ref, onMounted } from "vue"
    import productoService from "@/services/producto.service"
import Swal from "sweetalert2";
import clienteService from "@/services/cliente.service"
import pedidoService from "@/services/pedido.service"

const dt = ref();

    const productos = ref([])
    const totalRecords = ref(0)
    const loading = ref(false)
    const lazyParams = ref({page: 0})
    const buscar = ref("")
    const carrito = ref([])

    const submitted = ref(false)
    const cliente = ref({})
    
    const clienteDialog = ref(false)

    const cliente_seleccionado = ref({})

    const pedido = ref({})
    const buscar_clie = ref("")


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
    
    const agregarProducto = (prod) => {

        var sw = 0;
        carrito.value.forEach((pr) => {
            if(pr.producto_id == prod.id){
                sw=1
            }
        })

        if(prod.stock>0 && sw==0){
            const p = {producto_id: prod.id, nombre: prod.nombre, cantidad: 1, precio: prod.precio, st: prod.precio}
            carrito.value.push(p);
        }

        
    }
    
    const quitarProducto = (prod) => {

        let pos = carrito.value.indexOf(prod);

        carrito.value.splice(pos, 1);
    }

    const aumentar = (prod) => {
        var sw = 0;
        productos.value.forEach((pr) => {
            if(pr.id == prod.producto_id && pr.stock > 0 && pr.stock > prod.cantidad && sw==0){
                sw=1;
                prod.cantidad++;
            }
        })
    }

    const reducir = (prod) => {
        var sw = 0;
        productos.value.forEach((pr) => {
            if(pr.id == prod.producto_id && prod.cantidad > 1 && sw==0){
                sw=1;
                prod.cantidad--;
            }
        })
    }

    const buscarCliente = async () => {
        const {data} = await clienteService.buscarCliente(buscar_clie.value)
        cliente_seleccionado.value = data
    }

    const guardarCliente =async () => {
        // guardar y seleccionar cliente

        submitted.value = true;
        const {data} = await clienteService.guardar(cliente.value)

        cliente_seleccionado.value = data

        clienteDialog.value = false
        cliente.value = {};
    }

    const registrarPedido = async () => {
        if(cliente_seleccionado.value.id){
            if(confirm("¿Está seguro de guardar este pedido?")){

                let prods = [] 
                carrito.value.forEach((prod) => {
                    prods.push({producto_id: prod.producto_id, cantidad: prod.cantidad})
                })

                const pe = {
                    cliente_id: cliente_seleccionado.value.id,
                    productos: prods,
                    observacion: pedido.value.observacion        
                }
                const {data} = await pedidoService.store(pe)
                alert("Pedido Registrado");

                cliente_seleccionado.value = {}
                carrito.value = [];
            }
        }else{
            alert("Falta Cliente");
        }
    }
</script>