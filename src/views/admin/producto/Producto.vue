<template>
  <div>
    <div class="card">
      <Toolbar class="mb-4">
        <template #start>
          <Button
            label="Nuevo"
            icon="pi pi-plus"
            severity="success"
            class="mr-2"
            @click="openNuevo"
          />
        </template>
        <template #end>
          <FileUpload
            mode="basic"
            accept="image/*"
            :maxFileSize="1000000"
            label="Importar"
            chooseLabel="Import"
            class="mr-2 inline-block"
          />
          <input type="file" @change="importarXlsx">
          <Button
            label="Exportar"
            icon="pi pi-upload"
            severity="help"
            @click="exportCSV($event)"
          />
          <Button
            label="EXCEL"
            icon="pi pi-upload"
            severity="help"
            @click="exportarXlsx()"
          />
        </template>
      </Toolbar>

      <DataTable
        ref="dt"
        :value="productos"
        dataKey="id"
        :totalRecords="totalRecords"
        :paginator="true"
        :rows="5"
        lazy
        :loading="loading"
        @page="onPage($event)"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[5, 10, 25]"
        currentPageReportTemplate="Mostrando {first} al {last} de {totalRecords} productos"
      >
        <template #header>
          <div
            class="flex flex-wrap gap-2 align-items-center justify-content-between"
          >
            <h4 class="m-0">Gestión Productos</h4>
            <span class="p-input-icon-left">
              <i class="pi pi-search" />
              <InputText
                placeholder="Buscar..."
                v-model="buscar"
                @keyup.enter="getProductos()"
              />
            </span>
          </div>
        </template>
        <Column
          field="id"
          header="ID"
          sortable
          style="min-width: 2rem"
        ></Column>
        <Column
          field="nombre"
          header="Nombre"
          sortable
          style="min-width: 16rem"
        ></Column>
        <Column header="Image">
          <template #body="slotProps">
            <Image
              :src="`http://127.0.0.1:8000/${slotProps.data.imagen}`"
              alt="Image"
              width="64px"
              preview
            />
          </template>
        </Column>
        <Column field="precio" header="Precio" sortable style="min-width: 8rem">
          <template #body="slotProps">
            {{ formatCurrency(slotProps.data.precio) }}
          </template>
        </Column>
        <Column
          field="categoria.nombre"
          header="Categoria"
          sortable
          style="min-width: 10rem"
        ></Column>

        <Column
          field="estado"
          header="Estado"
          sortable
          style="min-width: 12rem"
        >
          <template #body="slotProps">
            <Tag
              :value="slotProps.data.estado"
              :severity="getStatusLabel(slotProps.data.estado)"
            />
          </template>
        </Column>
        <Column :exportable="false" style="min-width: 8rem">
          <template #body="slotProps">
            <Button icon="pi pi-image" @click="editImagen(slotProps.data)" />
            <Button
              icon="pi pi-pencil"
              outlined
              rounded
              class="mr-2"
              @click="editarProducto(slotProps.data)"
            />
            <Button
              icon="pi pi-trash"
              outlined
              rounded
              severity="danger"
              @click="confirmDeleteProduct(slotProps.data)"
            />
          </template>
        </Column>
      </DataTable>
    </div>

    <Dialog
      v-model:visible="productDialog"
      :style="{ width: '450px' }"
      header="Datos Producto"
      :modal="true"
      class="p-fluid"
    >
      <img
        v-if="producto.imagen"
        :src="`http://127.0.0.1:8000/${producto.imagen}`"
        :alt="producto.imagen"
        class="block m-auto pb-3"
        width="150px"
      />

      <div class="field">
        <label for="name">Nombre</label>
        <InputText
          id="name"
          v-model.trim="producto.nombre"
          required="true"
          autofocus
          :class="{ 'p-invalid': submitted && !producto.nombre }"
        />
        <small class="p-error" v-if="submitted && !producto.nombre"
          >El Nombre es Obligatorio.</small
        >
        {{ errors.nombre }}
      </div>
      <div class="field">
        <label for="description">Descripción</label>
        <Textarea
          id="description"
          v-model="producto.descripcion"
          required="true"
          rows="3"
          cols="20"
        />
      </div>

      <div class="field">
        <label class="mb-3">Categoria</label>
        <div class="formgrid grid">
          <div
            class="field-radiobutton col-6"
            v-for="cat in categorias"
            :key="cat.id"
          >
            <RadioButton
              id="category1"
              name="category"
              :value="cat.id"
              v-model="producto.categoria_id"
            />
            <label for="category1">{{ cat.nombre }}</label>
          </div>
          {{ errors.categoria_id }}
        </div>
      </div>

      <div class="formgrid grid">
        <div class="field col">
          <label for="price">Precio</label>
          <InputNumber
            id="price"
            v-model="producto.precio"
            mode="currency"
            currency="USD"
            locale="en-US"
          />
          {{ errors.precio }}
        </div>
        <div class="field col">
          <label for="quantity">Stock</label>
          <InputNumber id="quantity" v-model="producto.stock" integeronly />
          {{ errors.stock }}
        </div>
      </div>
      <template #footer>
        <Button label="Cancelar" icon="pi pi-times" text @click="hideDialog" />
        <Button
          label="Guardar"
          icon="pi pi-check"
          text
          @click="guardarProducto"
        />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="visibleImagen"
      modal
      header="Actualizar Imagen"
      :style="{ width: '50rem' }"
    >
      <div class="grid">
        <div class="col-8">
          <FileUpload
            @uploader="onAdvancedUpload($event)"
            :multiple="true"
            accept="image/*"
            customUpload
            :maxFileSize="1000000"
          >
            <template #empty>
              <p>Drag and drop files to here to upload.</p>
            </template>
          </FileUpload>
        </div>
        <div class="col-4">
          <Image
            :src="`http://127.0.0.1:8000/${producto.imagen}`"
            alt="Image"
            width="100%"
            preview
          />
        </div>
      </div>

      <!--
    <input type="file" @change="onImagenSeleccionado">
    <button type="button" @click="actualizarImagen()">Subir Imagen</button>
-->
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import productoService from "@/services/producto.service";
import categoriaService from "@/services/categoria.service";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";

const dt = ref();

const productos = ref([]);
const totalRecords = ref(0);
const loading = ref(false);
const lazyParams = ref({ page: 0 });
const buscar = ref("");
// dialog
const productDialog = ref(false);
const producto = ref({});
const submitted = ref(false);
const errors = ref({});

const imagenSeleccionada = ref();
const visibleImagen = ref(false);

const categorias = ref([]);
onMounted(() => {
  getProductos();

  getCategorias();
});

const getProductos = async () => {
  try {
    loading.value = true;

    let page = lazyParams.value.page + 1;
    let limit = lazyParams.value.rows;

    const { data } = await productoService.listar(page, limit, buscar.value);
    productos.value = data.data;
    totalRecords.value = data.total;

    loading.value = false;
  } catch (error) {
    alert("Error al solicitar los datos");
  }
};

const getCategorias = async () => {
  const { data } = await categoriaService.index();
  categorias.value = data;
};

const onPage = (event) => {
  lazyParams.value = event;
  getProductos();
};

const guardarProducto = async () => {
  if (producto.value.id) {
    // editar

    try {
      submitted.value = true;
      if (producto.value.nombre) {
        producto.value.estado = true;
        const { data } = await productoService.modificar(
          producto.value.id,
          producto.value
        );

        productDialog.value = false;

        getProductos();
      }
    } catch (error) {
      if (error.response.status == 422) {
        errors.value = error.response.data.errors;
      } else {
        alert("Error al registrar el Producto");
      }
    }
  } else {
    // guardar
    try {
      submitted.value = true;
      if (producto.value.nombre) {
        producto.value.estado = true;
        const { data } = await productoService.guardar(producto.value);

        productDialog.value = false;

        getProductos();
      }
    } catch (error) {
      if (error.response.status == 422) {
        errors.value = error.response.data.errors;
      } else {
        alert("Error al registrar el Producto");
      }
    }
  }
};

const editarProducto = (prod) => {
  producto.value = prod;
  productDialog.value = true;
  submitted.value = false;
};

const eliminarProducto = () => {};

const formatCurrency = (value) => {
  if (value)
    return value.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  return;
};

const getStatusLabel = (status) => {
  switch (status) {
    case true:
      return "success";

    case false:
      return "warning";
    default:
      return "danger";
  }
};

const openNuevo = () => {
  producto.value = {};
  productDialog.value = true;
  submitted.value = false;
};

const hideDialog = () => {
  productDialog.value = false;
};

const onImagenSeleccionado = (event) => {
  console.log(event.target.files[0]);
  imagenSeleccionada.value = event.target.files[0];
};

const actualizarImagen = async () => {
  let fd = new FormData();
  fd.append("imagen", imagenSeleccionada.value);

  await productoService.actualizaImagen(producto.value.id, fd);

  visibleImagen.value = false;
  getProductos();
};

const editImagen = (prod) => {
  visibleImagen.value = true;
  producto.value = prod;
};

const onAdvancedUpload = async (event) => {
  imagenSeleccionada.value = event.files[0];
  let fd = new FormData();
  fd.append("imagen", imagenSeleccionada.value);

  await productoService.actualizaImagen(producto.value.id, fd);

  visibleImagen.value = false;
  getProductos();
};

const confirmDeleteProduct = (prod) => {
  Swal.fire({
    title: "¿Está seguro de Inactivar el producto?",
    text: "Al aceptar cambiar el estado del producto!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Si, cambiar estado!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      const { data } = await productoService.eliminar(prod.id);

      Swal.fire({
        title: "Correcto!",
        text: "El Producto se ha inactivado.",
        icon: "success",
      });

      getProductos();
    }
  });
};

const exportCSV = () => {
  dt.value.exportCSV();
};

const exportarXlsx = () => {
  let data = XLSX.utils.json_to_sheet(productos.value);

  const workbook = XLSX.utils.book_new();
  const filename = "prueba";

  XLSX.utils.book_append_sheet(workbook, data, filename);

  XLSX.writeFile(workbook, `${filename}.xlsx`);
};

const importarXlsx = (event) => {



    let file = event.target.files[0];
    if(file){
        let fileReader = new FileReader();

        fileReader.onload = (e) => {
          var data = e.target.result;
      
      
          var workbook = XLSX.read(data, {
            type: "binary",
          });
      
          const sheetName = workbook.SheetNames[0];
      
          const sheet = workbook.Sheets[sheetName];
      
          const jsonData = XLSX.utils.sheet_to_json(sheet, {header: 1})
      
          console.log(jsonData);
      
          /*workbook.SheetNames.forEach((sheet) => {
            let rowObject = XLSX.utils.sheet_to_row_object_array(
              workbook.Sheets[sheet]
            );
            let jsonObject = JSON.stringify(rowObject);
            document.getElementById("jsonData").innerHTML = jsonObject;
            console.log(jsonObject);
          });*/
        };

        fileReader.readAsBinaryString(file)

    }

  
};
</script>
