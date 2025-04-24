<template>
    <div>
        <button @click="downloadExcel"
            class="text-white bg-blue-700 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-4 text-center ml-auto mb-4">
            Descargar Excel
        </button>
        <table class="w-full text-sm border text-left rtl:text-right">
            <thead class="text-white uppercase bg-violet-700">
                <tr>
                    <th class="px-6 py-3">ID</th>
                    <th class="px-6 py-3">Encuestador</th>
                    <!-- <th scope="col" class="px-6 py-3">Lat Base</th>
                      <th scope="col" class="px-6 py-3">Lon Base</th>
                      <th scope="col" class="px-6 py-3">Lat 1</th>
                      <th scope="col" class="px-6 py-3">Lon 1</th> -->
                    <th scope="col" class="px-6 py-3">GPS Base</th>
                    <th scope="col" class="px-6 py-3">GPS Encuesta</th>
                    <th scope="col" class="px-6 py-3">Distancia</th>
                    <!-- <th scope="col" class="px-6 py-3">GPS 2</th>
                    <th scope="col" class="px-6 py-3">Distancia 2</th>
                    <th scope="col" class="px-6 py-3">GPS 3</th>
                    <th scope="col" class="px-6 py-3">Distancia 3</th> -->
                </tr>
            </thead>
            <tbody>
                <tr v-for="(data, index) in gpsDatos" :key="index">
                    <td>{{ data.sbjnum }}</td>
                    <td class="capitalize">{{ data.encu }}</td>
                    <!-- <td>{{ data.lat_base }}</td>
                      <td>{{ data.lon_base }}</td>
                      <td>{{ data.lat_1 }}</td>
                      <td>{{ data.lon_1 }}</td> -->
                    <td v-if="data.latlong_base == 'NaN,NaN'">-</td>
                    <td v-else>{{ data.latlong_base }}</td>

                    <td v-if="data.latlong_1 == 'NaN,NaN'">-</td>
                    <td v-else>{{ data.latlong_1 }}</td>

                    <td v-if="isNaN(data.distance)">-</td>
                    <td v-else :style="{ color: data.distance >= 1 ? 'red' : 'inherit' }">{{ data.distance }} KM</td>
                    
                    <!-- <td v-if="data.latlong_2 == 'NaN,NaN'">-</td>
                    <td v-else>{{ data.latlong_2 }}</td>
                    
                    <td v-if="isNaN(data.distance2)">-</td>
                    <td v-else :style="{ color: data.distance2 > 1 ? 'red' : 'inherit' }">{{ data.distance2 }} KM</td>
                   
                    <td v-if="data.latlong_3 == 'NaN,NaN'">-</td>
                    <td v-else>{{ data.latlong_3 }}</td>
                    
                    <td v-if="isNaN(data.distance3)">-</td>
                    <td v-else :style="{ color: data.distance3 > 1 ? 'red' : 'inherit' }">{{ data.distance3 }} KM</td> -->
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
                gpsDatos: []
            }
        },
        methods: {
            gpsCalc() {
                this.formattedData.forEach(survey => {
                    survey.Subjects.forEach(subject => {
                        const latVarname = 'Latitude';
                        const lonVarname = 'Longitude';
                        /* const latVarname2 = 'gps_1_LA';
                        const lonVarname2 = 'gps_1_LO';
                        const latVarname3 = 'gps_2_LA';
                        const lonVarname3 = 'gps_2_LO'; */
                        const encu = subject.Columns.find(column => column.Var === 'Srvyr')?.Value || '-';
                        const sbjnum = subject.SubjectID;
                        //
                        const lat_base = subject.Columns.find(column => column.Var === 'latitud_base')?.Value || '-';
                        const lon_base = subject.Columns.find(column => column.Var === 'longitud_base')?.Value || '-';
                        const latlong_base = parseFloat(lat_base).toFixed(4) + "," + parseFloat(lon_base).toFixed(4);
                        //
                        const lat_1 = subject.Columns.find(column => column.Var === latVarname)?.Value || '-';
                        const lon_1 = subject.Columns.find(column => column.Var === lonVarname)?.Value || '-';
                        const latlong_1 = parseFloat(lat_1).toFixed(4) + "," + parseFloat(lon_1).toFixed(4);
                        
                        /* const lat_2 = subject.Columns.find(column => column.Var === latVarname2)?.Value || '-';
                        const lon_2 = subject.Columns.find(column => column.Var === lonVarname2)?.Value || '-';
                        const latlong_2 = parseFloat(lat_2).toFixed(4) + "," + parseFloat(lon_2).toFixed(4);
                        
                        const lat_3 = subject.Columns.find(column => column.Var === latVarname3)?.Value || '-';
                        const lon_3 = subject.Columns.find(column => column.Var === lonVarname3)?.Value || '-';
                        const latlong_3 = parseFloat(lat_3).toFixed(4) + "," + parseFloat(lon_3).toFixed(4); */

                        const toRadians = (degrees) => degrees * Math.PI / 180;

                        const R = 6371;
                        const dLat = toRadians(lat_1 - lat_base);
                        const dLon = toRadians(lon_1 - lon_base);

                        /* const dLat2 = toRadians(lat_2 - lat_base);
                        const dLon2 = toRadians(lon_2 - lon_base);

                        const dLat3 = toRadians(lat_3 - lat_base);
                        const dLon3 = toRadians(lon_3 - lon_base); */

                        const a =
                            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                            Math.cos(toRadians(lat_base)) * Math.cos(toRadians(lat_1)) *
                            Math.sin(dLon / 2) * Math.sin(dLon / 2);
                        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

                        const distance = (R * c).toFixed(2);

                        /* const a2 =
                            Math.sin(dLat2 / 2) * Math.sin(dLat2 / 2) +
                            Math.cos(toRadians(lat_base)) * Math.cos(toRadians(lat_2)) *
                            Math.sin(dLon2 / 2) * Math.sin(dLon2 / 2);
                        const c2 = 2 * Math.atan2(Math.sqrt(a2), Math.sqrt(1 - a2));

                        const distance2 = (R * c2).toFixed(2);

                        const a3 =
                            Math.sin(dLat3 / 2) * Math.sin(dLat3 / 2) +
                            Math.cos(toRadians(lat_base)) * Math.cos(toRadians(lat_3)) *
                            Math.sin(dLon3 / 2) * Math.sin(dLon / 2);
                        const c3 = 2 * Math.atan2(Math.sqrt(a3), Math.sqrt(1 - a3));

                        const distance3 = (R * c3).toFixed(2); */

                        /* this.gpsDatos.push({
                            sbjnum,
                            latlong_base,
                            latlong_1,
                            distance,
                            /* latlong_2,
                            distance2,
                            latlong_3,
                            distance3 * /
                            encu,
                        }); */

                        if (distance >= 1) {
                            this.gpsDatos.push({
                                sbjnum,
                                latlong_base,
                                latlong_1,
                                distance,
                                encu,
                            });
                        }

                    });
                });
            },

            downloadExcel() {
                const wsData = this.gpsDatos.map(item => ({
                    "SubjectNum": item.sbjnum,
                    "GPS_Base": item.latlong_base,
                    "GPS_Encuesta": item.latlong_1,
                    "Distancia_KM": item.distance,
                    "Encuestador": item.encu
                }));

                const ws = XLSX.utils.json_to_sheet(wsData);
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, "Datos_GPS");

                const now = new Date();
                const dateN = new Intl.DateTimeFormat("en-GB", {
                    timeZone: "America/Santiago",year: "numeric",month: "2-digit",day: "2-digit",hour: "2-digit",minute: "2-digit",hour12: false,
                }).format(now);

                const formattedDate = dateN.replace(",", "").replace(/:/g, "_").replace(/\//g, "_").replace(" ", "_");

                XLSX.writeFile(wb, `DatosGPS_${formattedDate}.xlsx`);
            },
        },
        mounted() {
            this.gpsCalc()
        }
    }
</script>
<style>

</style>