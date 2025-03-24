<template>
  <div class="relative overflow-x-auto">
    <button @click="downloadExcel"
        class="text-white bg-blue-700 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-4 text-center ml-auto mb-4">
        Descargar Excel
    </button>
    <table class="w-full text-sm border text-left rtl:text-right">
      <thead class="text-white uppercase bg-violet-700">
        <tr>
          <th scope="col" class="px-6 py-3">Encuestador</th>
          <th scope="col" class="px-6 py-3">Hora inusual</th>
          <th scope="col" class="px-6 py-3">Dispositivo rooteado</th>
          <th scope="col" class="px-6 py-3">Gps desactivado</th>
          <th scope="col" class="px-6 py-3">Grabación en silencio</th>
          <th scope="col" class="px-6 py-3">Demora en pregunta</th>
          <th scope="col" class="px-6 py-3">Duración</th>
          <th scope="col" class="px-6 py-3">Gps falso</th>
          <th scope="col" class="px-6 py-3">Sin gps</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, Srvyr) in getSurveyCounts()"
          :key="Srvyr"
          class="bg-white border-b"
        >
          <td class="px-6 py-3 capitalize">{{ Srvyr }}</td>
          <td class="px-6 py-3" :style="{ color: item.FlaggedByClockChanged >= 1 ? 'red' : 'inherit' }">{{ item.FlaggedByClockChanged }}</td>
          <td class="px-6 py-3" :style="{ color: item.FlaggedByDeviceRooted >= 1 ? 'red' : 'inherit' }">{{ item.FlaggedByDeviceRooted }}</td>
          <td class="px-6 py-3" :style="{ color: item.FlaggedByGPSServicesOff >= 1 ? 'red' : 'inherit' }">{{ item.FlaggedByGPSServicesOff }}</td>
          <td class="px-6 py-3" :style="{ color: item.FlaggedByNoSilentRecordings >= 1 ? 'red' : 'inherit' }">{{ item.FlaggedByNoSilentRecordings }}</td>
          <td class="px-6 py-3" :style="{ color: item.FlaggedByQuestionTakingTooLong >= 1 ? 'red' : 'inherit' }">{{ item.FlaggedByQuestionTakingTooLong }}</td>
          <td class="px-6 py-3" :style="{ color: item.FlagsByDuration >= 1 ? 'red' : 'inherit' }">{{ item.FlagsByDuration }}</td>
          <td class="px-6 py-3" :style="{ color: item.FlagsByFakeGPS >= 1 ? 'red' : 'inherit' }">{{ item.FlagsByFakeGPS }}</td>
          <td class="px-6 py-3" :style="{ color: item.FlagsByNoGPS >= 1 ? 'red' : 'inherit' }">{{ item.FlagsByNoGPS }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import * as XLSX from "xlsx";

export default {
  props: {
    formattedData: { type: Array, default: [] },
  },
  data() {
        return {
            FlagsData: []
        }
    },
  methods: {
    getSurveyCounts() {
        const counts = {};
        const srvyrSet = new Set(); // Usamos un Set para asegurar que los valores no se repitan

        this.formattedData.forEach((survey) => {
            survey.Subjects.forEach((subject) => {
            subject.Columns.forEach((col) => {
                if (col.Var === "Srvyr") {
                srvyrSet.add(col.Value); // Agregamos el valor al Set
                }
            });
            });
        });

        srvyrSet.forEach((srvyr) => {
            counts[srvyr] = {
            FlaggedByClockChanged: 0,
            FlaggedByDeviceRooted: 0,
            FlaggedByGPSServicesOff: 0,
            FlaggedByNoSilentRecordings: 0,
            FlaggedByQuestionTakingTooLong: 0,
            FlagsByDuration: 0,
            FlagsByFakeGPS: 0,
            FlagsByNoGPS: 0,
            };
        });

        // Recorre de nuevo los datos para contar las flags
        this.formattedData.forEach((survey) => {
            survey.Subjects.forEach((subject) => {
            const subjectColumns = subject.Columns;

            const srvyr = subjectColumns.find(
                (col) => col.Var === "Srvyr"
            )?.Value;

            if (!srvyr) return; // Si no se encuentra Srvyr, omitir

            const flaggedByClockChanged = subjectColumns.some(
                (col) => col.Var === "FlaggedByClockChanged" && col.Value === true
            );
            const flaggedByDeviceRooted = subjectColumns.some(
                (col) => col.Var === "FlaggedByDeviceRooted" && col.Value === true
            );
            const flaggedByGPSServicesOff = subjectColumns.some(
                (col) => col.Var === "FlaggedByGPSServicesOff" && col.Value === true
            );
            const flaggedByNoSilentRecordings = subjectColumns.some(
                (col) =>
                col.Var === "FlaggedByNoSilentRecordings" && col.Value === true
            );
            const flaggedByQuestionTakingTooLong = subjectColumns.some(
                (col) =>
                col.Var === "FlaggedByQuestionTakingTooLong" && col.Value === true
            );
            const flagsByDuration = subjectColumns.some(
                (col) => col.Var === "FlagsByDuration" && col.Value === true
            );
            const flagsByFakeGPS = subjectColumns.some(
                (col) => col.Var === "FlagsByFakeGPS" && col.Value === true
            );
            const flagsByNoGPS = subjectColumns.some(
                (col) => col.Var === "FlagsByNoGPS" && col.Value === true
            );

            if (flaggedByClockChanged) counts[srvyr].FlaggedByClockChanged += 1;
            if (flaggedByDeviceRooted) counts[srvyr].FlaggedByDeviceRooted += 1;
            if (flaggedByGPSServicesOff)
                counts[srvyr].FlaggedByGPSServicesOff += 1;
            if (flaggedByNoSilentRecordings)
                counts[srvyr].FlaggedByNoSilentRecordings += 1;
            if (flaggedByQuestionTakingTooLong)
                counts[srvyr].FlaggedByQuestionTakingTooLong += 1;
            if (flagsByDuration) counts[srvyr].FlagsByDuration += 1;
            if (flagsByFakeGPS) counts[srvyr].FlagsByFakeGPS += 1;
            if (flagsByNoGPS) counts[srvyr].FlagsByNoGPS += 1;
            });
        });

        this.FlagsData = Object.entries(counts).map(([srvyr, flags]) => ({
            srvyr,
            ...flags
        }));

        return counts;
    },
    downloadExcel() {
        /* const wsData = this.gpsDatos.map(item => ({
            "SubjectNum": item.sbjnum,
            "GPS_Base": item.latlong_base,
            "GPS_Encuesta": item.latlong_1,
            "Distancia_KM": item.distance,
            "Encuestador": item.encu
        })); */

        const ws = XLSX.utils.json_to_sheet(this.FlagsData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Datos_Flags");

        const now = new Date();
        const dateN = new Intl.DateTimeFormat("en-GB", {
            timeZone: "America/Santiago",year: "numeric",month: "2-digit",day: "2-digit",hour: "2-digit",minute: "2-digit",hour12: false,
        }).format(now);

        const formattedDate = dateN.replace(",", "").replace(/:/g, "_").replace(/\//g, "_").replace(" ", "_");

        XLSX.writeFile(wb, `Datos_Flags_${formattedDate}.xlsx`);
    },
  },
};
</script>

<style>
</style>