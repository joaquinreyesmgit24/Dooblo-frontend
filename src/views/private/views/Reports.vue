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
    <div class="grid grid-cols-1 gap-6 mb-6">
        <div class="bg-white border border-gray-100 shadow-md shadow-black/5 p-6 rounded-md">
            <VueGoodTable :columns="columns" :rows="rows" :search-options="searchOptions"
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
            </VueGoodTable>
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
                surveyID: [],
                expiredcanceledSurveyID: [],
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
                    //Total
                    const response = await axios.get(`http://api.dooblo.net/newapi/SurveyInterviewIDs?surveyIDs=${project.surveyID}&testMode=False&completed=True&filtered=FalsedateType=Upload`, this.dooblouser)
                    this.surveyID = response.data
                    //Expiradas y canceladas
                    const responseB = await axios.get(`http://api.dooblo.net/newapi/SurveyInterviewIDs?surveyIDs=${project.surveyID}&testMode=False&completed=True&filtered=False&statuses=7,10`, this.dooblouser);
                    this.expiredcanceledSurveyID = responseB.data
                    this.getDataSurvey(project,this.surveyID)
                } catch (error) {
                    console.error("Error", error);
                }
            },
            async getDataSurvey(project, surveyID) {
                const unifiedSurveyID=surveyID.slice(0,10).join(',')
                console.log(unifiedSurveyID)
                const response = await axios.get(`http://api.dooblo.net/newapi/SimpleExport?surveyID=${project.surveyID}&subjectIDs=${unifiedSurveyID}`, this.dooblouser)
                console.log(response)
            }
        },
        mounted() {
            this.getDataProjects()
        }
    }
</script>

<style>

</style>