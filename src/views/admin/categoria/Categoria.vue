<template>
  <div class="card">
    <Button
      label="Nueva Categoria"
      icon="pi pi-external-link"
      @click="visible = true"
    />

    <Dialog
      v-model:visible="visible"
      modal
      header="Categoria"
      :style="{ width: '50rem' }"
      :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
      class="p-fluid"
    >
        <div class="field">
          <label for="name">Ingrese Nombre</label>
          <InputText
            id="name"
            v-model.trim="categoria.nombre"
            required="true"
            autofocus
          />
          <small class="p-error" v-if="errors.nombre">Nombre es obligatorio.</small>
        </div>
        <div class="field">
          <label for="description">Detalle</label>
          <Textarea
            id="description"
            v-model="categoria.detalle"
            rows="3"
            cols="20"
          />
        </div>

      <template #footer>
        <Button
          label="Cancelar"
          icon="pi pi-times"
          text
          @click="visible = false"
        />
        <Button
          label="Guardar"
          icon="pi pi-check"
          text
          @click="guardarCategoria"
        />
      </template>
    </Dialog>
    <input type="text" v-model="buscar" @keyup.enter="getCategorias">
    
    <DataTable :value="categorias" tableStyle="min-width: 50rem">
      <Column field="id" header="COD"></Column>
      <Column field="nombre" header="NOMBRE CATEGORIA"></Column>
      <Column field="detalle" header="DETALLE"></Column>
      <Column :exportable="false" style="min-width:8rem">
        <template #body="slotProps">
              <Button icon="pi pi-pencil" severity="warning" class="mr-2" @click="editarCategoria(slotProps.data)" />
              <Button icon="pi pi-trash" severity="danger" @click="confirmDeleteCategoria(slotProps.data)" />
        </template>
      </Column>
    </DataTable>
    <hr />
    <br />

    <form @submit.prevent="guardarCategoria">
      <label for="">Ingrese Nombre</label>
      <input type="text" v-model="categoria.nombre" />
      <br />
      <label for="">Ingrese Detalle</label>
      <textarea v-model="categoria.detalle"></textarea>
      <br />
      <input type="submit" value="Guardar Categoria" />
    </form>

    <table border="1">
      <thead>
        <tr>
          <th>ID</th>
          <th>NOMBRE</th>
          <th>DETALLE</th>
          <th>ACCION</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="cat in categorias" :key="cat.id">
          <td>{{ cat.id }}</td>
          <td>{{ cat.nombre }}</td>
          <td>{{ cat.detalle }}</td>
          <td></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import Swal from "sweetalert2";
import { onMounted, ref } from "vue";
import catService from "./../../../services/categoria.service";

const categorias = ref([]);
const categoria = ref({});
const visible = ref(false);
const errors = ref({});
const buscar = ref('')

onMounted(() => {
  getCategorias();
});

async function getCategorias() {
  const res = await catService.index(buscar.value);
  categorias.value = res.data;
}

const guardarCategoria = async function () {
    try {
        if(categoria.value.id){
          // MODIFICAR
          const res = await catService.update(categoria.value.id, categoria.value);
          visible.value = false;
          categoria.value = {};
        
          getCategorias();
          Swal.fire({
            title: "Categoria Actualizada!",
            text: "ok para continuar!",
            icon: "success",
          });

        }else{
          // GUARDAR
          const res = await catService.store(categoria.value);
        
          visible.value = false;
          categoria.value = {};
        
          getCategorias();
          Swal.fire({
            title: "Categoria Registrada!",
            text: "ok para continuar!",
            icon: "success",
          });
        
          console.log(res);

        }
        
    } catch (error) {
        if(error.response.status != 422){
            visible.value = false
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Error al registrar!"
            });
        }else{
            console.log(error)
            errors.value = error.response.data.errors;
        }
    }
};

const editarCategoria = (cat) => {
  categoria.value = cat

  visible.value = true;
}

const confirmDeleteCategoria = async (cat) => {
  if(confirm("¿Está seguro de eliminar la categoria?")){
    const res = await catService.destroy(cat.id);
    console.log(res);
    getCategorias()
  }
}

const getCategorias3 = () => {};
</script>
