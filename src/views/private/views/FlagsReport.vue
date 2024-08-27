<template>
  <div class="relative overflow-x-auto">
    <table class="w-full text-sm border text-left rtl:text-right">
      <thead class="text-white uppercase bg-violet-700">
        <tr>
          <th scope="col" class="px-6 py-3">Encuestador</th>
          <th scope="col" class="px-6 py-3">Horas inusuales</th>
          <th scope="col" class="px-6 py-3">Dispositivo rooteado</th>
          <th scope="col" class="px-6 py-3">Gps desactivado</th>
          <th scope="col" class="px-6 py-3">Grabación en silencio</th>
          <th scope="col" class="px-6 py-3">
            Demora excesiva de tiempo en pregunta
          </th>
          <th scope="col" class="px-6 py-3">Duración</th>
          <th scope="col" class="px-6 py-3">Gps falso</th>
          <th scope="col" class="px-6 py-3">No cuenta con gps</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, Srvyr) in getSurveyCounts()"
          :key="Srvyr"
          class="bg-white border-b"
        >
          <td class="px-6 py-3">{{ Srvyr }}</td>
          <td class="px-6 py-3">{{ item.FlaggedByClockChanged }}</td>
          <td class="px-6 py-3">{{ item.FlaggedByDeviceRooted }}</td>
          <td class="px-6 py-3">{{ item.FlaggedByGPSServicesOff }}</td>
          <td class="px-6 py-3">{{ item.FlaggedByNoSilentRecordings }}</td>
          <td class="px-6 py-3">{{ item.FlaggedByQuestionTakingTooLong }}</td>
          <td class="px-6 py-3">{{ item.FlagsByDuration }}</td>
          <td class="px-6 py-3">{{ item.FlagsByFakeGPS }}</td>
          <td class="px-6 py-3">{{ item.FlagsByNoGPS }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    formattedData: { type: Array, default: [] },
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

      return counts;
    },
  },
};
</script>

<style>
</style>