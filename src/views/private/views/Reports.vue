<template>
    <div class="grid grid-cols-1 gap-6 mb-6">
        <div class="bg-white rounded-md border border-gray-100 p-6 shadow-md shadow-black/5">
            <div class="flex mb-6">
                <div>
                    <label for="countries" class="block font-semibold text-gray-900 dark:text-white">
                        Estudio:</label>
                </div>
            </div>
            <div class="flex items-center">
                <select id="countries"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                    v-model="selectedStudy" @change="getSurveyId(this.selectedStudy)">
                    <option value="" disabled selected>
                        Selecciona un estudio
                    </option>
                    <option v-for="study in studies" :key="study.id" :value="study">
                        {{ study.name }}
                    </option>
                </select>
            </div>
        </div>
    </div>
    <div class="grid grid-cols-1 gap-6 mb-6" v-if="activado">
        <div class="bg-white border border-gray-100 shadow-md shadow-black/5 p-6 rounded-md">
            <!-- <VueGoodTable :columns="columns" :rows="rows" :search-options="searchOptions"
                :pagination-options="paginationOptions" max-height="450px" :fixed-header="true">
                <template v-slot:table-row="props">
                    <span v-if="props.column.field == 'acciones'">
                        <button type="button"
                            class="text-white bg-violet-700 hover:bg-violet-800 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                            data-bs-toggle="modal" data-bs-target="#modalUpdateUser"
                            @click="openUpdateProjectModal(props.row)">
                            Editar
                        </button>
                    </span>
                </template>
                <template v-slot:emptystate>
                    <div style="text-align: center;">
                        No hay datos disponibles
                    </div>
                </template>
            </VueGoodTable> -->
            <template v-if="loading">
                <div class="text-center">
                    <div role="status">
                        <svg aria-hidden="true" class="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-violet-700" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                        </svg>
                        <span class="sr-only">Loading...</span>
                    </div>
                </div>
            </template>
            <template v-else>
                <h3>
                    Total de encuestas: {{ surveyID.length }}
                </h3>
                <!-- {{ formattedData }} -->
                <!-- <div v-for="(item, index) in formattedData">
                    {{item}}
                </div> -->
                <h3>
                    Cantidad de encuestas canceladas y expiradas: {{ expiredcanceledSurveyID.length}}
                </h3>
            </template>
        </div>
    </div>
</template>

<script>
    import GlobalService from "../../../services/GlobalServices";
    import axios from 'axios';
    export default {
        name: "reports",
        data() {
            return {
                selectedStudy: "",
                studies: [],
                dooblouser: {
                    auth: {
                        username: "c1982d08-43d1-4956-aff8-59c1a8db840c/j.reyes",
                        password: "j.reyes"
                    }
                },
                activado: false,
                loading: false,
                surveyID: [],
                expiredcanceledSurveyID: [],
                formattedData:[]
            }
        },
        methods: {
            getDataStudies() {
                GlobalService.getData("/study/list-studies")
                    .then((response) => {
                        this.studies = response.studies
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            },
            async getSurveyId(study) {
                try {
                    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
                    this.activado = true;
                    this.loading = true;
                    //Total
                    const response = await axios.get(`http://api.dooblo.net/newapi/SurveyInterviewIDs?surveyIDs=${study.surveyID}&testMode=False&completed=True&filtered=FalsedateType=Upload`, this.dooblouser)
                    this.surveyID = response.data
                    await sleep(500);
                    //Expiradas y canceladas
                    const responseB = await axios.get(`http://api.dooblo.net/newapi/SurveyInterviewIDs?surveyIDs=${study.surveyID}&testMode=False&completed=True&filtered=False&statuses=7,10`, this.dooblouser);
                    this.expiredcanceledSurveyID = responseB.data
                    await sleep(500);
                    await this.getDataSurvey(study, this.surveyID)
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
                let formattedGroups = group.map(grupo => grupo.join(','));
                try {
                    let respuestas = []
                    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
                    for (let i=0; i<formattedGroups.length;i++) {
                        const response = await axios.get(`http://api.dooblo.net/newapi/SimpleExport?surveyID=${study.surveyID}&subjectIDs=${formattedGroups[i]}`, this.dooblouser);
                        respuestas.push(response.data); // Aquí puedes ajustar según lo que necesites
                        await sleep(500);
                    }
                    this.formattedData = [...respuestas.flat()]
                } catch (error) {
                    console.error('Error al obtener los registros:', error);
                }
            }
        },
        mounted() {
            this.getDataStudies()
        }
    }
</script>

<style>

</style>