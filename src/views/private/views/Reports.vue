<template>
    <div class="grid grid-cols-1 gap-6 mb-6">
        <div class="bg-white rounded-md border border-gray-100 p-6 shadow-md shadow-black/5">
            <div class="flex mb-6">
                <div>
                    <label for="countries" class="block font-semibold text-gray-900 dark:text-white">
                        Proyecto:</label>
                </div>
            </div>
            <div class="flex items-center">
                <select id="countries"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                    v-model="selectedProject" @change="getSurveyId(this.selectedProject)">
                    <option value="" disabled selected>
                        Selecciona un proyecto
                    </option>
                    <option v-for="project in projects" :key="project.id" :value="project">
                        {{ project.name }}
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
            <h3>
                Total de encuestas: {{ surveyID.length }}
            </h3>
            <div v-for="(item, index) in formattedData">
                {{item}}
            </div>
            <h3>
                Cantidad de encuestas canceladas y expiradas: {{ expiredcanceledSurveyID.length}}
            </h3>
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
                selectedProject: "",
                projects: [],
                dooblouser: {
                    auth: {
                        username: "c1982d08-43d1-4956-aff8-59c1a8db840c/j.reyes",
                        password: "j.reyes"
                    }
                },
                activado: false,
                surveyID: [],
                expiredcanceledSurveyID: [],
                formattedData:[]
            }
        },
        methods: {
            getDataProjects() {
                GlobalService.getData("/project/list-projects")
                    .then((response) => {
                        this.projects = response.projects
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            },
            async getSurveyId(project) {
                try {
                    this.activado = true;
                    //Total
                    const response = await axios.get(`http://api.dooblo.net/newapi/SurveyInterviewIDs?surveyIDs=${project.surveyID}&testMode=False&completed=True&filtered=FalsedateType=Upload`, this.dooblouser)
                    this.surveyID = response.data
                    //Expiradas y canceladas
                    const responseB = await axios.get(`http://api.dooblo.net/newapi/SurveyInterviewIDs?surveyIDs=${project.surveyID}&testMode=False&completed=True&filtered=False&statuses=7,10`, this.dooblouser);
                    this.expiredcanceledSurveyID = responseB.data
                    this.getDataSurvey(project, this.surveyID)
                } catch (error) {
                    console.error("Error", error);
                }
            },
            async getDataSurvey(project, surveyID) {
                let group = [];
                for (let i = 0; i < surveyID.length; i += 99) {
                    group.push(surveyID.slice(i, i + 99));
                }
                let formattedGroups = group.map(grupo => grupo.join(','));
                let allData = []
                try {
                    let respuestas = await Promise.all(formattedGroups.map(async grupo => {
                        const response = await axios.get(`http://api.dooblo.net/newapi/SimpleExport?surveyID=${project.surveyID}&subjectIDs=${grupo}`, this.dooblouser);
                        return response.data; // Aquí puedes ajustar según lo que necesites
                    }));
                    for (let i = 0; i < respuestas.length; i++) {
                        allData.push(respuestas[i].Subjects)
                    }
                    this.formattedData = [...allData.flat()]
                } catch (error) {
                    console.error('Error al obtener los registros:', error);
                }
            }
        },
        mounted() {
            this.getDataProjects()
        }
    }
</script>

<style>

</style>