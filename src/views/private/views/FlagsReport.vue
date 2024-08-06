<template>
    <div class="relative overflow-x-auto">
        <table class="w-full text-sm border text-left rtl:text-right">
            <thead class="text-white uppercase bg-violet-700">
                <tr>
                    <th scope="col" class="px-6 py-3">Encuestador</th>
                    <th scope="col" class="px-6 py-3">Encuestas marcadas con servicio de gps desactivado</th>
                    <th scope="col" class="px-6 py-3">Encuestas encontradas con horas inusuales</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, Srvyr) in getSurveyCounts()" :key="surveyID" class="bg-white border-b">
                    <td class="px-6 py-3">{{ Srvyr }}</td>
                    <td class="px-6 py-3">{{ item.FlaggedByGPSServicesOff }}</td>
                    <td class="px-6 py-3">{{ item.FlagsOddHours }}</td>
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

                this.formattedData.forEach((survey) => {
                    // Obtener el valor de Srvyr desde los sujetos
                    const srvyr = survey.Subjects.flatMap(
                        (subject) => subject.Columns
                    ).find((col) => col.Var === "Srvyr")?.Value;

                    if (!srvyr) {
                        // Si no se encuentra el valor de Srvyr, no se cuenta
                        return;
                    }

                    // Inicializar el conteo para este valor de Srvyr
                    if (!counts[srvyr]) {
                        counts[srvyr] = { FlaggedByGPSServicesOff: 0, FlagsOddHours: 0 };
                    }

                    const flaggedByClockChanged = survey.Subjects.some((subject) =>
                        subject.Columns.some(
                            (col) => col.Var === "FlaggedByClockChanged" && col.Value === true
                        )
                    )
                    const flaggedByDeviceRooted = survey.Subjects.some((subject) =>
                        subject.Columns.some(
                            (col) => col.Var === "FlaggedByDeviceRooted" && col.Value === true
                        )
                    )
                    const flaggedByGPSServicesOff = survey.Subjects.some((subject) =>
                        subject.Columns.some(
                            (col) => col.Var === "FlaggedByGPSServicesOff" && col.Value === true
                        )
                    )
                    const flaggedByNoSilentRecordings = survey.Subjects.some((subject) =>
                        subject.Columns.some(
                            (col) => col.Var === "FlaggedByNoSilentRecordings" && col.Value === true
                        )
                    )
                    const flaggedByQuestionTakingTooLong = survey.Subjects.some((subject) =>
                        subject.Columns.some(
                            (col) => col.Var === "FlaggedByQuestionTakingTooLong" && col.Value === true
                        )
                    )
                    const flagsByDuration = survey.Subjects.some((subject) =>
                        subject.Columns.some(
                            (col) => col.Var === "FlagsByDuration" && col.Value === true
                        )
                    )
                    const flagsByFakeGPS = survey.Subjects.some((subject) =>
                        subject.Columns.some(
                            (col) => col.Var === "FlagsByFakeGPS" && col.Value === true
                        )
                    )
                    const flagsByNoGPS = survey.Subjects.some((subject) =>
                        subject.Columns.some(
                            (col) => col.Var === "FlagsByNoGPS" && col.Value === true
                        )
                    )

                    if (flaggedByClockChanged) {
                        counts[srvyr].FlaggedByClockChanged += 1;
                    }
                    if (flaggedByDeviceRooted) {
                        counts[srvyr].FlaggedByDeviceRooted += 1;
                    }
                    if (flaggedByGPSServicesOff) {
                        counts[srvyr].FlaggedByGPSServicesOff += 1;
                    }
                    if (flaggedByNoSilentRecordings) {
                        counts[srvyr].FlaggedByGPSServicesOff += 1;
                    }
                    if (flaggedByQuestionTakingTooLong) {
                        counts[srvyr].FlaggedByGPSServicesOff += 1;
                    }
                    if (flagsByDuration) {
                        counts[srvyr].FlaggedByGPSServicesOff += 1;
                    }
                    if (flagsByFakeGPS) {
                        counts[srvyr].FlaggedByGPSServicesOff += 1;
                    }
                    if (flagsByNoGPS) {
                        counts[srvyr].FlaggedByGPSServicesOff += 1;
                    }
                });

                return counts;
            },
        },
    };
</script>

<style>
</style>