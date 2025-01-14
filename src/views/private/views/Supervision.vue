<template>
  <div>
    <!-- Input para ingresar el porcentaje -->
    <label for="percentage">Ingrese porcentaje (%):</label>
    <input
      id="percentage"
      type="number"
      v-model.number="percentage"
      min="0"
      max="100"
      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 p-2.5 placeholder-gray-400 focus:ring-primary-500 w-40 mr-2 ml-2"
    />
    <button @click="filtrarPorPorcentaje" class="text-white bg-gray-600 hover:bg-gray-500 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-3 text-center mr-2">Calcular porcentaje</button>
    <button @click="filtrarPorPorcentaje" class="text-white bg-gray-600 hover:bg-gray-500 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-3 text-center">Guardar encuestas para supervisión</button>
    <!-- Mostrar encuestas filtradas en un acordeón -->   
    <div class="space-y-2 mt-4">
      <div
        v-for="(encuestas, encuestador) in encuestasFiltradas"
        :key="encuestador"
        class="border rounded-lg"
      >
        <div
          class="p-4 cursor-pointer flex justify-between items-center bg-gray-200 hover:bg-gray-300 rounded-t-lg"
          @click="toggleAccordion(encuestador)"
        >
          <span>{{ encuestador }} ({{ encuestas.length }} encuestas)</span>
          <div class="flex items-center">
            <!-- <button @click="eliminarEncuestador(encuestador)" class="text-red-500 hover:text-red-700 text-sm ml-4">
              Eliminar todas las encuestas del encuestador
            </button> -->
            <span :class="accordionState[encuestador] ? 'rotate-180' : ''" class="transition-transform transform ml-2">
              &#9660;
            </span>
          </div>
        </div>
        <div
          v-show="accordionState[encuestador]"
          class="p-4 bg-gray-100 border-t"
        >
          <ul>
            <li v-for="(encuesta, index) in encuestas" :key="index" class="flex justify-between items-center">
              <span v-if="telefonoVarName" class="ml-2">
                Teléfono: {{ obtenerTelefono(encuesta) }}
              </span>
              <span>{{ encuesta.SubjectID }}</span>
              <button @click="eliminarEncuesta(encuestador, index)" class="text-red-500 hover:text-red-700">
                <i class="ri-delete-bin-line"></i> <!-- Ícono de basurero de RemyIcon -->
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import GlobalService from "../../../services/GlobalServices";
export default {
  props: {
    formattedData: { type: Array, default: () => [] },
    selectedStudy: { type: Object, default: {} },
  },
  data() {
    return {
      telefonoVarName:"",
      resultado: {},
      encuestasFiltradas: {},
      percentage: 0, // Porcentaje ingresado por el usuario
      accordionState: {},
    };
  },
  methods: {
    obtenerTelefonoVarName() {
      GlobalService.getData(`/study/list-study/${this.selectedStudy.id}`)
      .then((response) => {
        this.telefonoVarName=response.study.TelefonoVarName
      }).catch((error) => {
        console.log(error);
      });
    },
    obtenerTelefono(encuesta) {
      // Encuentra la columna que tiene el nombre almacenado en telefonoVarName
      console.log(encuesta)
      const telefonoColumna = encuesta.Columns.find(col => col.Var === this.telefonoVarName);
      // console.log(telefonoColumna)
      return telefonoColumna ? telefonoColumna.Value : 'No disponible'; // Retorna el valor o un mensaje por defecto
    },
    encuestasPorEncuestador() {
      // Construir el objeto `resultado`
      for (const item of this.formattedData) {
        for (const sujeto of item.Subjects) {
          const encuestador =
            sujeto.Columns?.find(col => col.Var === 'Srvyr')?.Value || 'Desconocido';
          if (!this.resultado[encuestador]) {
            this.resultado[encuestador] = [];
          }
          this.resultado[encuestador].push(sujeto);
        }
      }
      // Inicializar encuestas filtradas con todos los datos
      this.encuestasFiltradas = { ...this.resultado };
    },
    filtrarPorPorcentaje() {
      // Calcular el porcentaje de encuestas para cada encuestador
      const porcentajeDecimal = this.percentage / 100;
  
      this.encuestasFiltradas = {};
      for (const [encuestador, encuestas] of Object.entries(this.resultado)) {
        const cantidad = Math.ceil(encuestas.length * porcentajeDecimal);
        this.encuestasFiltradas[encuestador] = encuestas.slice(0, cantidad);
      }
    },
    toggleAccordion(encuestador) {
      // Alternar el estado del acordeón
      this.accordionState[encuestador] = !this.accordionState[encuestador];
    },
    eliminarEncuesta(encuestador, index) {
      // Eliminar la encuesta del array del encuestador en las encuestas filtradas
      this.encuestasFiltradas[encuestador].splice(index, 1);
    },
    eliminarEncuestador(encuestador) {
      // Eliminar todas las encuestas de un encuestador en los objetos `resultado` y `encuestasFiltradas`
      delete this.resultado[encuestador]; // Eliminar del objeto `resultado`
      this.encuestasFiltradas[encuestador] = []; // Vaciar el array de encuestas en `encuestasFiltradas`
    },
  },
  
  mounted() {
    this.encuestasPorEncuestador();
    this.obtenerTelefonoVarName();
  },
};
</script>
  
  <style scoped>
  ul {
    list-style: none;
    padding: 0;
  }
  li {
    margin: 5px 0;
  }
  </style>
  