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
    <button @click="guardarEncuestasParaSupervision" class="text-white bg-gray-600 hover:bg-gray-500 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-3 text-center">Guardar encuestas para supervisión</button>

    <!-- Mostrar encuestas filtradas en una tabla -->
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
            <span :class="accordionState[encuestador] ? 'rotate-180' : ''" class="transition-transform transform ml-2">
              &#9660;
            </span>
          </div>
        </div>
        <div
          v-show="accordionState[encuestador]"
          class="p-4 bg-gray-100 border-t"
        >
          <table class="min-w-full table-auto">
            <thead>
              <tr>
                <th class="px-4 py-2">ID de la encuesta</th>
                <th class="px-4 py-2">Correo</th>
                <th class="px-4 py-2">Teléfono</th>
                <th class="px-4 py-2">Dirección</th>
                <th class="px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(encuesta, index) in encuestas" :key="index">
                <td class="border px-4 py-2">{{ encuesta.SubjectID }}</td>
                <td class="border px-4 py-2">{{ obtenerCorreo(encuesta) }}</td>
                <td class="border px-4 py-2">{{ obtenerTelefono(encuesta) }}</td>
                <td class="border px-4 py-2">{{ obtenerDireccion(encuesta) }}</td>
                <td class="border px-4 py-2">
                  <button @click="eliminarEncuesta(encuestador, index)" class="text-red-500 hover:text-red-700">
                    <i class="ri-delete-bin-line"></i> <!-- Ícono de basurero de RemyIcon -->
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
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
      correoVarName:"",
      telefonoVarName:"",
      direccionVarName:"",
      resultado: {},
      encuestasFiltradas: {},
      percentage: 0, // Porcentaje ingresado por el usuario
      accordionState: {},
    };
  },
  methods: {
    guardarEncuestasParaSupervision() {
      // Recorre las encuestas filtradas por encuestador
      const encuestasParaGuardar = [];

      for (const [encuestador, encuestas] of Object.entries(this.encuestasFiltradas)) {
        console.log(this.selectedStudy)
        encuestas.forEach(encuesta => {
          // Prepara el objeto que será enviado a la API
          const encuestaData = {
            subjNum: encuesta.SubjectID,
            mail: this.obtenerCorreo(encuesta),
            phone: this.obtenerTelefono(encuesta),
            address: this.obtenerDireccion(encuesta),
            studyId: this.selectedStudy
          };
          encuestasParaGuardar.push(encuestaData);
        });
      }
      // Llamada API para guardar las encuestas en la base de datos
      GlobalService.createData('/supervision/create-supervision/', encuestasParaGuardar)
        .then(response => {
          console.log('Encuestas guardadas correctamente', response);
          // Aquí puedes añadir alguna acción tras el éxito, como mostrar un mensaje o limpiar los datos
        })
        .catch(error => {
          console.error('Error al guardar encuestas', error);
          // Mostrar mensaje de error si ocurre algún problema con la API
        });
    },
    obtenerVarName() {
      GlobalService.getData(`/study/list-study/${this.selectedStudy.id}`)
      .then((response) => {
        this.correoVarName=response.study.CorreoVarName
        this.telefonoVarName=response.study.TelefonoVarName
        this.direccionVarName=response.study.DireccionVarName
      }).catch((error) => {
        console.log(error);
      });
    },
    obtenerCorreo(encuesta) {
      const correoColumna = encuesta.Columns.find(col => col.Var === this.correoVarName);
      return correoColumna ? correoColumna.Value : 'No disponible'; // Retorna el valor o un mensaje por defecto
    },
    obtenerTelefono(encuesta) {
      const telefonoColumna = encuesta.Columns.find(col => col.Var === this.telefonoVarName);
      return telefonoColumna ? telefonoColumna.Value : 'No disponible'; // Retorna el valor o un mensaje por defecto
    },
    obtenerDireccion(encuesta) {
      const direccionColumna = encuesta.Columns.find(col => col.Var === this.direccionVarName);
      return direccionColumna ? direccionColumna.Value : 'No disponible'; // Retorna el valor o un mensaje por defecto
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
    this.obtenerVarName();
  },
};
</script>
  
  <style scoped>
  table {
    width: 100%;
    border-collapse: collapse;
  }
  th, td {
    text-align: left;
  }
  th {
    background-color: #f2f2f2;
    font-weight: bold;
  }
  td {
    padding: 8px;
  }
  tr:nth-child(even) {
    background-color: #f9f9f9;
  }
  </style>
  