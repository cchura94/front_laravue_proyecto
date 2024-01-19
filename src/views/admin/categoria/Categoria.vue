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

    <DataTable :value="categorias" tableStyle="min-width: 50rem">
      <Column field="id" header="COD"></Column>
      <Column field="nombre" header="NOMBRE CATEGORIA"></Column>
      <Column field="detalle" header="DETALLE"></Column>
      <Column field="acciones" header="ACCIONES"></Column>
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
const errors = ref({})

onMounted(() => {
  getCategorias();
});

async function getCategorias() {
  const res = await catService.index();
  categorias.value = res.data;
}

const guardarCategoria = async function () {
    try {
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

const getCategorias3 = () => {};
</script>
