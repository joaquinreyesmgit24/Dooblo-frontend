<template>
    <div class="grid grid-cols-1 gap-6 mb-6">
        <p class="text-center w-full" v-show="selectedStudy!='' && progreso==100"><span class="font-bold">{{ selectedStudy.name }}</span>
            <span class="text-xs"><a href="/reports"> (Seleccionar otro estudio)</a></span>
        </p>
        <div class="bg-white rounded-md border border-gray-100 p-6 shadow-md shadow-black/5" v-show="selectedStudy==''">
            <div class="flex items-center">
                <select id="countries"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                    v-model="selectedStudy" @change="getSurveyId(this.selectedStudy)">
                    <option value="" disabled selected>Selecciona un estudio</option>
                    <option v-for="study in studies" :key="study.id" :value="study">
                        {{ study.name }}
                    </option>
                </select>
            </div>
        </div>
        <hr v-show="selectedStudy!='' && progreso==100">
    </div>
    <div v-if="selectedStudy" class="grid grid-cols-1 gap-6">
        <template v-if="loading">
            <div class="bg-white border border-gray-100 shadow-md shadow-black/5 p-6 rounded-md">
                <div class="text-center">
                    <div role="status">
                        <svg aria-hidden="true"
                            class="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-violet-700"
                            viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                fill="currentColor" />
                            <path
                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                fill="currentFill" />
                        </svg>
                        <!-- <span class="sr-only">Loading...</span> -->
                        <p>Cargando {{ progreso }}%...</p>
                    </div>
                </div>
            </div>
        </template>
        <template v-else>
            <div class="flex">
                <router-link :to="{ name: 'general-summary' }"
                    class="text-white bg-violet-700 hover:bg-violet-600 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm px-5 py-4 text-center ml-2">
                    <span class="text-sm">Resumen General</span>
                </router-link>
                <router-link :to="{ name: 'report-region' }"
                    class="text-white bg-violet-700 hover:bg-violet-600 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm px-5 py-4 text-center ml-2">
                    <span class="text-sm">Reporte de regiones</span>
                </router-link>
                <router-link :to="{ name: 'gps-report' }"
                    class="text-white bg-violet-700 hover:bg-violet-600 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm px-5 py-4 text-center ml-2">
                    <span class="text-sm">Diferencia del GPS</span>
                </router-link>
                <router-link :to="{ name: 'flags-report' }"
                    class="text-white bg-violet-700 hover:bg-violet-600 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm px-5 py-4 text-center ml-2">
                    <span class="text-sm">Flags</span>
                </router-link>
                <router-link :to="{ name: 'supervision' }"
                    class="text-white bg-violet-700 hover:bg-violet-600 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm px-5 py-4 text-center ml-2">
                    <span class="text-sm">Supervisión</span>
                </router-link>
                <router-link :to="{ name: 'supervision-selected' }"
                    class="text-white bg-violet-700 hover:bg-violet-600 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm px-5 py-4 text-center ml-2">
                    <span class="text-sm">Supervisión Selección</span>
                </router-link>
                <button @click="downloadSurveyExcel"
                    class="text-white bg-blue-700 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-4 text-center ml-auto">
                    Descargar Encuestas
                </button>
            </div>
            <router-view :regionCounts="regionCounts" :formattedData="formattedData" :selectedStudy="selectedStudy"
                :surveyID="surveyID" :expiredcanceledSurveyID="expiredcanceledSurveyID"></router-view>
        </template>
    </div>
</template>

<script>
    import GlobalService from "../../../services/GlobalServices";
    import axios from "axios";
    import * as XLSX from "xlsx";
    /* import { mapGetters } from 'vuex'; */
    export default {
        name: "reports",
        data() {
            return {
                /* roleUser: "", */
                selectedStudy: "",
                studies: [],
                dooblouser: {
                    auth: {
                        username: "c1982d08-43d1-4956-aff8-59c1a8db840c/j.reyes",
                        password: "j.reyes",
                    },
                },
                loading: false,
                surveyID: [],
                expiredcanceledSurveyID: [],
                formattedData: [],
                regionCounts: [],
                progreso: 0,
            };
        },
        /* computed: {
            ...mapGetters(['getRolName']),
        },
        watch: {
            getRolName: {
                immediate: true,
                handler(newValue) {
                    this.roleUser = newValue;
                },
            },
        }, */
        methods: {
            getDataStudies() {
                GlobalService.getData("/study/list-active-studies")
                    .then((response) => {
                        this.studies = response.studies;
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            },
            async getSurveyId(study) {
                try {
                    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
                    this.loading = true;
                    //Total
                    const response = await axios.get(
                        //`http://api.dooblo.net/newapi/SurveyInterviewIDs?surveyIDs=${study.surveyID}&testMode=False&completed=True&filtered=FalsedateType=Upload`,
                        `http://api.dooblo.net/newapi/SurveyInterviewIDs?surveyIDs=${study.surveyID}&testMode=False&completed=True&filtered=False&statuses=1,5,11`,
                        this.dooblouser
                    );
                    this.surveyID = response.data;
                    await sleep(500);
                    //Expiradas y canceladas
                    const responseB = await axios.get(
                        `http://api.dooblo.net/newapi/SurveyInterviewIDs?surveyIDs=${study.surveyID}&testMode=False&completed=True&filtered=False&statuses=2,3,4,6,7,8,9,10,12,13,14,15`,
                        this.dooblouser
                        
                    );
                    console.log(responseB)
                    this.expiredcanceledSurveyID = responseB.data;
                    await sleep(500);
                    await this.getDataSurvey(study, this.surveyID);
                    this.loading = false;
                } catch (error) {
                    console.error("Error", error);
                }
            },
            async getDataSurvey(study, surveyID) {
                let group = [];
                for (let i = 0; i < surveyID.length; i += 99) {
                    group.push(surveyID.slice(i, i + 99));
                }
                let formattedGroups = group.map((g) => g.join(","));
                let totalGroups = formattedGroups.length;
                try {
                    let resp = [];
                    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
                    for (let i = 0; i < formattedGroups.length; i++) {
                        const response = await axios.get(
                            `http://api.dooblo.net/newapi/SimpleExport?surveyID=${study.surveyID}&subjectIDs=${formattedGroups[i]}`,
                            this.dooblouser
                        );
                        resp.push(response.data); // Aquí puedes ajustar según lo que necesites
                        await sleep(500);

                        // Calcular y mostrar el progreso
                        let progress = ((i + 1) / totalGroups) * 100;
                        this.progreso = progress.toFixed(1);
                    }
                    this.formattedData = [...resp.flat()];
                    this.countSurveysByRegion();
                } catch (error) {
                    console.error("Error al obtener los registros:", error);
                }
            },

            /* countSurveysByRegion() {
                const regionCounter = {};
                const today = new Date().toISOString().split("T")[0];
                // Inicializar todas las regiones del 1 al 16 con 0
                for (let i = 1; i <= 16; i++) {
                    regionCounter[i] = {
                        number: i,
                        name: this.regionName(i),
                        total: 0,
                        total_reg: this.selectedStudy[`expectedCasesRegion${i}`],
                        today: 0,
                        urban: 0,
                        total_urban:this.selectedStudy[`expectedCasesUrbanAreaRegion${i}`],
                        rural: 0,
                        total_rural:this.selectedStudy[`expectedCasesRuralAreaRegion${i}`],
                        todayUrban: 0,
                        todayRural: 0
                    };
                }
                this.formattedData.forEach((survey) => {
                    survey.Subjects.forEach((subject) => {
                        const regionColumn = subject.Columns.find(
                            (column) => column.Var === this.selectedStudy[`RegionVarName`]
                        );
                        const dateColumn = subject.Columns.find(
                            (column) => column.Var === "Date"
                        );
                        const zoneColumn = subject.Columns.find(
                            (column) => column.Var === this.selectedStudy[`AreaVarName`]
                        ); // Asegúrate de que el nombre de la variable sea correcto

                        if (regionColumn) {
                            const regionValue = regionColumn.Value;
                            regionCounter[regionValue].total++;

                            if (zoneColumn) {
                                const zoneValue = zoneColumn.Value.toLowerCase(); // Normaliza el valor a minúsculas
                                if (zoneValue === "urbano") {
                                    regionCounter[regionValue].urban++;
                                    if (dateColumn) {
                                        const surveyDate = new Date(dateColumn.Value)
                                            .toISOString()
                                            .split("T")[0];
                                        if (surveyDate === today) {
                                            regionCounter[regionValue].todayUrban++;
                                        }
                                    }
                                } else if (zoneValue === "rural") {
                                    regionCounter[regionValue].rural++;
                                    if (dateColumn) {
                                        const surveyDate = new Date(dateColumn.Value)
                                            .toISOString()
                                            .split("T")[0];
                                        if (surveyDate === today) {
                                            regionCounter[regionValue].todayRural++;
                                        }
                                    }
                                }
                            }

                            if (dateColumn) {
                                const surveyDate = new Date(dateColumn.Value)
                                    .toISOString()
                                    .split("T")[0];
                                if (surveyDate === today) {
                                    regionCounter[regionValue].today++;
                                }
                            }
                        }
                    });
                });
                this.regionCounts = regionCounter;
            }, */

            countSurveysByRegion() {
                const regionCounter = {};
                const today = new Date().toISOString().split("T")[0];

                // Crear un mapeo de nombres de regiones a números
                const regionNameToNumber = {
                    "TARAPACÁ": 1,
                    "ANTOFAGASTA": 2,
                    "ATACAMA": 3,
                    "COQUIMBO": 4,
                    "VALPARAÍSO": 5,
                    "LIBERTADOR BERNARDO O’HIGGINS": 6,
                    "MAULE": 7,
                    "BIOBÍO": 8,
                    "ARAUCANÍA": 9,
                    "LOS LAGOS": 10,
                    "AYSÉN": 11,
                    "MAGALLANES": 12,
                    "METROPOLITANA": 13,
                    "LOS RÍOS": 14,
                    "ARICA Y PARINACOTA": 15,
                    "BIOBÍO": 16
                };

                // Inicializar todas las regiones del 1 al 16 con 0
                for (let i = 1; i <= 16; i++) {
                    regionCounter[i] = {
                        number: i,
                        name: this.regionName(i),
                        total: 0,
                        total_reg: this.selectedStudy[`expectedCasesRegion${i}`],
                        today: 0,
                        urban: 0,
                        total_urban: this.selectedStudy[`expectedCasesUrbanAreaRegion${i}`],
                        rural: 0,
                        total_rural: this.selectedStudy[`expectedCasesRuralAreaRegion${i}`],
                        todayUrban: 0,
                        todayRural: 0
                    };
                }

                this.formattedData.forEach((survey) => {
                    survey.Subjects.forEach((subject) => {
                        const regionColumn = subject.Columns.find(
                            (column) => column.Var === this.selectedStudy[`RegionVarName`]
                        );
                        const dateColumn = subject.Columns.find(
                            (column) => column.Var === "Date"
                        );
                        const zoneColumn = subject.Columns.find(
                            (column) => column.Var === this.selectedStudy[`AreaVarName`]
                        );

                        if (regionColumn) {
                            // Normalizar la región, si es texto, convertirla a número
                            let regionValue = regionColumn.Value;
                            if (typeof regionValue === 'string' && regionNameToNumber[regionValue]) {
                                regionValue = regionNameToNumber[regionValue];
                            }

                            // Verificar si el valor es un número válido
                            if (regionCounter[regionValue]) {
                                regionCounter[regionValue].total++;

                                if (zoneColumn) {
                                    const zoneValue = zoneColumn.Value.toLowerCase();
                                    if (zoneValue === "urbano") {
                                        regionCounter[regionValue].urban++;
                                        if (dateColumn) {
                                            const surveyDate = new Date(dateColumn.Value)
                                                .toISOString()
                                                .split("T")[0];
                                            if (surveyDate === today) {
                                                regionCounter[regionValue].todayUrban++;
                                            }
                                        }
                                    } else if (zoneValue === "rural") {
                                        regionCounter[regionValue].rural++;
                                        if (dateColumn) {
                                            const surveyDate = new Date(dateColumn.Value)
                                                .toISOString()
                                                .split("T")[0];
                                            if (surveyDate === today) {
                                                regionCounter[regionValue].todayRural++;
                                            }
                                        }
                                    }
                                }

                                if (dateColumn) {
                                    const surveyDate = new Date(dateColumn.Value)
                                        .toISOString()
                                        .split("T")[0];
                                    if (surveyDate === today) {
                                        regionCounter[regionValue].today++;
                                    }
                                }
                            }
                        }
                    });
                });

                this.regionCounts = regionCounter;
            },

            regionName(region) {
                // Aquí puedes definir la lógica para obtener el nombre de la región
                // Puedes usar un objeto, una función, o cualquier método que tengas
                // para mapear el número de región a su nombre correspondiente.
                // Por ejemplo, un simple mapeo podría ser:
                const regionNames = {
                    1: "Tarapacá",
                    2: "Antofagasta",
                    3: "Atacama",
                    4: "Coquimbo",
                    5: "Valparaíso",
                    6: "Ohiggins",
                    7: "Maule",
                    8: "Biobío",
                    9: "Araucanía",
                    10: "Los lagos",
                    11: "Aysén",
                    12: "Magallanes",
                    13: "Metropolitana",
                    14: "Los ríos",
                    15: "Arica y parinacota",
                    16: "Ñuble",
                };
                return regionNames[region];
            },
            downloadSurveyExcel() {
                // Recorre cada encuesta en formattedData
                const ws_data = this.formattedData
                    .map((survey) => {
                        // Acumula todos los registros de Subjects
                        return survey.Subjects.map((subject) => {
                            const surveyData = {};
                            // Recorre cada columna del subject y agrega los datos al objeto surveyData
                            subject.Columns.forEach((col) => {
                                surveyData[col.Var] = col.Value;
                            });
                            return surveyData;
                        });
                    })
                    .flat(); // Aplana el arreglo para combinar todos los registros
                // Crea la hoja de Excel a partir de los datos procesados
                const ws = XLSX.utils.json_to_sheet(ws_data);
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, "Encuestas");

                // Escribe el archivo Excel
                XLSX.writeFile(wb, "Encuestas.xlsx");
            },
        },
        mounted() {
            this.getDataStudies();
        },
    };
</script>

<style>
</style>