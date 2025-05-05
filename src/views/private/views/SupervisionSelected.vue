<template>
    <div>
        <button @click="deleteStudy()" v-show="supervisionData.length > 0"
            class="text-white bg-red-700 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-4 text-center ml-auto mb-4">
            Borrar selección
        </button>&nbsp;
        <button @click="downloadExcel" v-show="supervisionData.length > 0"
            class="text-white bg-blue-700 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-4 text-center ml-auto mb-4">
            Descargar Excel
        </button>
        <div class="max-w-full max-h-96 overflow-auto border border-gray-300 rounded-lg">
            <table class="min-w-full table-auto">
                <thead class="bg-violet-700 text-white uppercase sticky top-0 z-10">
                    <tr>
                        <th class="border px-4 py-2">ID de la encuesta</th>
                        <th class="border px-4 py-2">Correo</th>
                        <th class="border px-4 py-2">Teléfono</th>
                        <th class="border px-4 py-2">Dirección</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="supervisionData.length === 0">
                        <td colspan="4" class="text-center py-4 text-gray-500">No hay datos disponibles</td>
                    </tr>
                    <tr v-for="(supervision, index) in supervisionData" :key="index">
                        <td class="border px-4 py-2">{{ supervision.subjNum }}</td>
                        <td class="border px-4 py-2">{{ supervision.mail }}</td>
                        <td class="border px-4 py-2">{{ supervision.phone }}</td>
                        <td class="border px-4 py-2">{{ supervision.address }}</td>
                    </tr>
                </tbody>
            </table>         
        </div>
    </div>
    
</template>
  
<script>
    import GlobalService from "../../../services/GlobalServices";
    import * as XLSX from "xlsx";
    import { useToast } from "vue-toastification";

    export default {
        props: {
            formattedData: { type: Array, default: () => [] },
            selectedStudy: { type: Object, default: {} },
        },
        data() {
            return {
                toast: useToast(),
                supervisionData: [],
                rows: [],
            };
        },
        methods: {
            async getDataSupervisions() {
                const response = await GlobalService.getData(`/supervision/list-supervision/${this.selectedStudy.id}`).then((response) => {
                    this.supervisionData = response.supervisions;
                })
                .catch((error) => {
                    console.log(error);
                });
            },

            deleteStudy() {
                GlobalService.deleteDataById("/supervision/delete-supervision", this.selectedStudy.id)
                .then((response) => {
                    this.toast.success(response.msg);
                    if (response.supervisions) {
                        this.rows = response.supervisions.map((supervision) => ({
                            id: supervision.id,
                            subjNum: supervision.subjNum,
                            mail: supervision.mail,
                            phone: supervision.phone,
                            address: supervision.address,
                            createdAt: supervision.createdAt,
                            updatedAt: supervision.updatedAt,
                            studyId: supervision.studyId
                        }));
                    }
                    this.getDataSupervisions(); 
                })
                .catch((error) => {
                    console.log(error);
                    this.getDataSupervisions();
                    //this.toast.error(error);
                });
            },

            downloadExcel() {
                const wsData = this.supervisionData.map(item => ({
                    "SubjectNum": item.subjNum,
                    "Correo": item.mail,
                    "Teléfono": item.phone,
                    "Dirección": item.address,
                }));

                const ws = XLSX.utils.json_to_sheet(wsData);
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, "Datos_supervision");

                const now = new Date();
                const dateN = new Intl.DateTimeFormat("en-GB", {
                    timeZone: "America/Santiago",year: "numeric",month: "2-digit",day: "2-digit",hour: "2-digit",minute: "2-digit",hour12: false,
                }).format(now);

                const formattedDate = dateN.replace(",", "").replace(/:/g, "_").replace(/\//g, "_").replace(" ", "_");

                XLSX.writeFile(wb, `Datos_Supervision_${formattedDate}.xlsx`);
            },
        },
        
        mounted() {
            this.getDataSupervisions();
        },
    };
  </script>

    