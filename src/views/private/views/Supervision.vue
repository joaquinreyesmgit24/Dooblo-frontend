<template>
    <div>
      <!-- Input para ingresar el porcentaje -->
      <label for="percentage">Ingrese porcentaje (%):</label>
      <input
        id="percentage"
        type="number"
        v-model.number="percentage"
        @input="filtrarPorPorcentaje"
        min="0"
        max="100"
      />
      <p>Porcentaje seleccionado: {{ percentage }}%</p>
  
      <!-- Mostrar encuestas filtradas -->
      <ul>
        <li v-for="(encuestas, encuestador) in encuestasFiltradas" :key="encuestador">
          {{ encuestador }} ({{ encuestas.length }} encuestas):
          <ul>
            <li v-for="(encuesta, index) in encuestas" :key="index">
              {{ encuesta.SubjectID }}
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      formattedData: { type: Array, default: () => [] },
    },
    data() {
      return {
        resultado: {},
        encuestasFiltradas: {},
        percentage: 0, // Porcentaje ingresado por el usuario
      };
    },
    methods: {
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
    },
    mounted() {
      this.encuestasPorEncuestador();
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
  