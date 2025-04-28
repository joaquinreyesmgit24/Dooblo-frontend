<template>
    <div class="relative overflow-x-auto">
        <button @click="downloadExcel"
            class="text-white bg-blue-700 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-4 text-center ml-auto mb-4">
            Descargar Excel
        </button>
        <table class="w-full text-sm border text-left rtl:text-right mb-5">
            <thead class="text-white uppercase bg-violet-700">
                <tr>
                    <th colspan="7" class="px-6 py-3 text-center bg-violet-800">
                        GENERAL
                    </th>
                </tr>
                <tr>
                    <th scope="col" class="px-6 py-3">
                        Nro de región
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Nombre de región
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Casos a lograr
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Estado de avance
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Faltantes
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Realizadas el día de hoy
                    </th>
                    <th scope="col" class="px-6 py-3">
                        % de avance
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="regionInfo in regionCounts" :key="regionInfo.number" class="bg-white border-b">
                    <td class="px-6 py-3">
                        {{ regionInfo.number }}
                    </td>
                    <td class="px-6 py-3">
                        {{regionInfo.name}}
                    </td>
                    <td class="px-6 py-3">
                        {{ regionInfo.total_reg }}
                    </td>
                    <td class="px-6 py-3">
                        {{regionInfo.total || 0}}
                    </td>
                    <td class="px-6 py-3">
                        {{ Math.max(regionInfo.total_reg - regionInfo.total, 0) }}
                    </td>
                    <td class="px-6 py-3">
                        {{regionInfo.today}}
                    </td>
                    <td class="px-6 py-3">
                        <div class="relative h-4 bg-neutral-400 rounded-md">
                            <div class="absolute inset-y-0 left-0 flex items-center rounded-md" :class="{
                                                'bg-green-500': regionInfo.total / regionInfo.total_reg >= 1,
                                                'bg-orange-500': regionInfo.total / regionInfo.total_reg >= 0.5 && regionInfo.total / regionInfo.total_reg < 1,
                                                'bg-red-500': regionInfo.total / regionInfo.total_reg < 0.5
                                            }"
                                :style="{ width: `${Math.min((regionInfo.total / regionInfo.total_reg) * 100, 100)}%`}">
                                <span class="text-xs text-white px-2">
                                    <!-- {{ Math.min(Math.round((regionInfo.total / regionInfo.total_reg) * 100), 100) }}% -->
                                    {{ isNaN(Math.min(Math.round((regionInfo.total / regionInfo.total_reg) * 100), 100)) ? 0 : Math.min(Math.round((regionInfo.total / regionInfo.total_reg) * 100), 100) }}%
                                </span>
                            </div>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
        <table class="w-full text-sm border text-left rtl:text-right">
            <thead class="text-white uppercase bg-violet-700">
                <tr>
                    <th  colspan="12" class="px-6 py-3 text-center bg-violet-800">
                        URBANO Y RURAL
                    </th>
                </tr>
                <tr>
                    <!-- <th scope="col" class="px-6 py-3">
                        Nro de región
                    </th> -->
                    <th scope="col" class="px-6 py-3k">
                        <!-- Nombre de  -->región
                    </th>
                    <th scope="col" class="px-6 py-3 border-l-2 border-gray-400">
                        Casos a lograr urbano
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Estado de avance
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Faltantes
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Realizadas hoy
                    </th>
                    <th scope="col" class="px-6 py-3">
                        % de avance
                    </th>
                    <th scope="col" class="px-6 py-3 border-l-2 border-gray-400">
                        Casos a lograr rural
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Estado de avance
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Faltantes
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Realizadas hoy
                    </th>
                    <th scope="col" class="px-6 py-3">
                        % de avance
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="regionInfo in regionCounts" :key="regionInfo.number" class="bg-white border-b">
                    <!-- <td class="px-6 py-3">
                        {{ regionInfo.number }}
                    </td> -->
                    <td class="px-6 py-3">
                        {{ regionInfo.number }} - {{regionInfo.name}}
                    </td>
                    <td class="px-6 py-3 border-l-2 border-gray-400">
                        {{regionInfo.total_urban}}
                    </td>
                    <td class="px-6 py-3">
                        {{regionInfo.urban}}
                    </td>
                    <td class="px-6 py-3">
                        {{ Math.max(regionInfo.total_urban - regionInfo.urban, 0) }}
                    </td>
                    <td class="px-6 py-3">
                        {{regionInfo.todayUrban}}
                    </td>
                    <td class="px-6 py-3">
                        <div class="relative h-4 bg-neutral-400 rounded-md">
                            <div class="absolute inset-y-0 left-0 flex items-center rounded-md" :class="{
                                                'bg-green-500': regionInfo.urban / regionInfo.total_urban >= 1,
                                                'bg-orange-500': regionInfo.urban / regionInfo.total_urban >= 0.5 && regionInfo.urban / regionInfo.total_urban < 1,
                                                'bg-red-500': regionInfo.urban / regionInfo.total_urban < 0.5
                                            }"
                                :style="{ width: `${Math.min((regionInfo.urban / regionInfo.total_urban) * 100, 100)}%`}">
                                <span class="text-xs text-white px-2">
                                    <!-- {{ Math.min(Math.round((regionInfo.urban / regionInfo.total_urban) * 100), 100) }}% -->
                                    {{ isNaN(Math.min(Math.round((regionInfo.urban / regionInfo.total_urban) * 100), 100)) ? 0 : Math.min(Math.round((regionInfo.urban / regionInfo.total_urban) * 100), 100) }}%
                                </span>
                            </div>
                        </div>
                    </td>
                    <td class="px-6 py-3 border-l-2 border-gray-400">
                        {{regionInfo.total_rural}}
                    </td>
                    <td class="px-6 py-3">
                        {{regionInfo.rural}}
                    </td>
                    <td class="px-6 py-3">
                        {{ Math.max(regionInfo.total_rural - regionInfo.rural, 0) }}
                    </td>
                    <td class="px-6 py-3">
                        {{regionInfo.todayRural}}
                    </td>
                    <td class="px-6 py-3">
                        <div class="relative h-4 bg-neutral-400 rounded-md">
                            <div class="absolute inset-y-0 left-0 flex items-center rounded-md" :class="{
                                                'bg-green-500': regionInfo.rural / regionInfo.total_rural >= 1,
                                                'bg-orange-500': regionInfo.rural / regionInfo.total_rural >= 0.5 && regionInfo.rural / regionInfo.total_rural < 1,
                                                'bg-red-500': regionInfo.rural / regionInfo.total_rural < 0.5
                                            }"
                                :style="{ width: `${Math.min((regionInfo.rural / regionInfo.total_rural) * 100, 100)}%`}">
                                <span class="text-xs text-white px-2">
                                    <!-- {{ Math.min(Math.round((regionInfo.rural / regionInfo.total_rural) * 100), 100) }}% -->
                                    {{ isNaN(Math.min(Math.round((regionInfo.rural / regionInfo.total_rural) * 100), 100)) ? 0 : Math.min(Math.round((regionInfo.rural / regionInfo.total_rural) * 100), 100) }}%
                                </span>
                            </div>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
        <!--     
        const sheet1Indices = [0, 1, 3, 2, 4]; // Número, Nombre, Total, Rural, Urban
        const sheet2Indices = [0, 1, 5, 6, 9]; // Número, Nombre, Hoy, HoyRural, TotalRural
        const sheet3Indices = [0, 1, 7, 8, 10]; // Número, Nombre, HoyUrbano, TotalReg, TotalUrban
        -->
    </div>
</template>

<script>
    import * as XLSX from "xlsx";

    export default {
        name: "reportregion",
        props: {
            regionCounts: { type: Array, default: [] },
        },
        methods: {
            downloadExcel() {
                const wb = XLSX.utils.book_new(); // Crear un nuevo libro

                // Convertir regionCounts en un array de valores
                const regionArray = Object.values(this.regionCounts);

                // Verificar que ahora es un array
                if (!Array.isArray(regionArray)) {
                    console.error("Error: regionCounts no es un array después de conversión.", regionArray);
                    return;
                }

                // Definir las claves y títulos de cada hoja
                const sheet1Keys = ["number", "name", "total_reg", "total", "today"];
                const sheet1Titles = ["Nro", "Región", "Totales", "Avance", "Hoy"];

                const sheet2Keys = ["number", "name", "total_urban", "urban", "todayUrban"];
                const sheet2Titles = ["Nro", "Región", "Totales", "Avance", "Hoy"];

                const sheet3Keys = ["number", "name", "total_rural", "rural", "todayRural"];
                const sheet3Titles = ["Nro", "Región", "Totales", "Avance", "Hoy"];

                // Función para extraer valores basados en claves y agregar títulos
                const filterByKeysWithTitles = (data, keys, titles) => {
                    const filteredData = data.map(item => keys.map(key => item[key] ?? null));
                    return [titles, ...filteredData]; // Agregar títulos como primera fila
                };

                const sheet1Data = XLSX.utils.aoa_to_sheet(filterByKeysWithTitles(regionArray, sheet1Keys, sheet1Titles));
                const sheet2Data = XLSX.utils.aoa_to_sheet(filterByKeysWithTitles(regionArray, sheet2Keys, sheet2Titles));
                const sheet3Data = XLSX.utils.aoa_to_sheet(filterByKeysWithTitles(regionArray, sheet3Keys, sheet3Titles));

                XLSX.utils.book_append_sheet(wb, sheet1Data, "General");
                XLSX.utils.book_append_sheet(wb, sheet2Data, "Urbano");
                XLSX.utils.book_append_sheet(wb, sheet3Data, "Rural");

                const now = new Date();
                const dateN = new Intl.DateTimeFormat("en-GB", {
                    timeZone: "America/Santiago",year: "numeric",month: "2-digit",day: "2-digit",hour: "2-digit",minute: "2-digit",hour12: false,
                }).format(now);

                const formattedDate = dateN.replace(",", "").replace(/:/g, "_").replace(/\//g, "_").replace(" ", "_");

                // Escribir el archivo Excel
                XLSX.writeFile(wb, `Reporte_${formattedDate}.xlsx`);
            }
        }
    }
</script>

<style>

</style>