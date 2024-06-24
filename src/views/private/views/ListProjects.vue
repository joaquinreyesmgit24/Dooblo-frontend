<template>
    <div class="grid grid-cols-1 gap-6 mb-6">
        <div class="bg-white rounded-md border border-gray-100 p-6 shadow-md shadow-black/5">
            <div class="flex">
                <button type="button"
                    class="text-white bg-violet-700 hover:bg-violet-800 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ml-auto"
                    data-bs-toggle="modal" data-bs-target="#modalUpdateUser" @click="openCreateProjectModal()">
                    Agregar
                </button>
            </div>
            <div class="text-2xl font-semibold mb-1">Proyectos</div>
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
            <div v-if="showProjectUpdateModal" class="fixed z-10 inset-0 overflow-y-auto">
                <div class="flex items-center justify-center min-h-screen">
                    <div class="fixed inset-0 transition-opacity" @click="closeUpdateProjectModal" aria-hidden="true">
                        <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
                    </div>
                    <div class="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full"
                        role="dialog" aria-modal="true" aria-labelledby="modal-headline">
                        <button @click="closeUpdateProjectModal"
                            class="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none">
                            <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <form @submit.prevent="updateProject(editedProject.id, editedProject)" class="p-4 md:p-5">
                            <div class="grid gap-4 mb-4 grid-cols-2">
                                <div class="col-span-2">
                                    <label for="name" class="block mb-2 text-sm font-medium text-gray-900">Id de
                                        encuesta:</label>
                                    <input type="text" name="name" id="name"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Id de encuesta" required="" v-model="editedProject.surveyID">
                                </div>
                                <div class="col-span-2">
                                    <label for="name" class="block mb-2 text-sm font-medium text-gray-900">Código del
                                        proyecto:</label>
                                    <input type="text" name="name" id="name"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Código del proyecto" required="" v-model="editedProject.code">
                                </div>
                                <div class="col-span-2">
                                    <label for="name" class="block mb-2 text-sm font-medium text-gray-900">Nombre de
                                        proyecto:</label>
                                    <input type="text" name="name" id="name"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Nombre de proyecto" required="" v-model="editedProject.name">
                                </div>
                                <div class="col-span-2">
                                    <label for="name"
                                        class="block mb-2 text-sm font-medium text-gray-900">Región:</label>
                                    <input type="text" name="name" id="name"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Nombre de proyecto" required=""
                                        v-model="editedProject.RegionVarName">
                                </div>
                                <div class="col-span-2">
                                    <label for="name"
                                        class="block mb-2 text-sm font-medium text-gray-900">Comuna:</label>
                                    <input type="text" name="name" id="name"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Nombre de proyecto" required=""
                                        v-model="editedProject.ComunaVarName">
                                </div>
                                <div class="col-span-2">
                                    <label for="name" class="block mb-2 text-sm font-medium text-gray-900">UMP:</label>
                                    <input type="text" name="name" id="name"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Nombre de proyecto" required="" v-model="editedProject.UMPVarName">
                                </div>
                                <div class="col-span-2 sm:col-span-1">
                                    <label for="statusUpdateUser"
                                        class="block mb-4 text-sm font-medium text-gray-900">Estado</label>
                                    <input type="checkbox" id="statusUpdateUser" v-model="editedProject.status" />
                                </div>
                            </div>
                            <button type="submit" @click="closeModal"
                                class="text-white inline-flex items-center bg-violet-700 hover:bg-violet-800 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                                Editar usuario
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <div v-if="showProjectCreateModal" class="fixed z-10 inset-0 overflow-y-auto">
                <div class="flex items-center justify-center min-h-screen">
                    <div class="fixed inset-0 transition-opacity" @click="closeCreateProjectModal" aria-hidden="true">
                        <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
                    </div>
                    <div class="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full"
                        role="dialog" aria-modal="true" aria-labelledby="modal-headline">
                        <button @click="closeCreateProjectModal"
                            class="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none">
                            <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <form  @submit.prevent="createProject(createdProject)" class="p-4 md:p-5">
                            <div class="grid gap-4 mb-4 grid-cols-2">
                                <div class="col-span-2">
                                    <label for="name" class="block mb-2 text-sm font-medium text-gray-900">Id de
                                        encuesta:</label>
                                    <input type="text" name="name" id="name"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Id de encuesta" required="" v-model="createdProject.surveyID">
                                </div>
                                <div class="col-span-2">
                                    <label for="name" class="block mb-2 text-sm font-medium text-gray-900">Código del
                                        proyecto:</label>
                                    <input type="text" name="name" id="name"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Código del proyecto" required="" v-model="createdProject.code">
                                </div>
                                <div class="col-span-2">
                                    <label for="name" class="block mb-2 text-sm font-medium text-gray-900">Nombre de
                                        proyecto:</label>
                                    <input type="text" name="name" id="name"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Nombre de proyecto" required="" v-model="createdProject.name">
                                </div>
                                <div class="col-span-2">
                                    <label for="name" class="block mb-2 text-sm font-medium text-gray-900">Nombre de
                                        proyecto:</label>
                                    <input type="text" name="name" id="name"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Nombre de proyecto" required="" v-model="createdProject.name">
                                </div>
                                <div class="col-span-2">
                                    <label for="name" class="block mb-2 text-sm font-medium text-gray-900">Nombre de
                                        proyecto:</label>
                                    <input type="text" name="name" id="name"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Nombre de proyecto" required="" v-model="createdProject.name">
                                </div>
                                <div class="col-span-2">
                                    <label for="name" class="block mb-2 text-sm font-medium text-gray-900">Nombre de
                                        proyecto:</label>
                                    <input type="text" name="name" id="name"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Nombre de proyecto" required="" v-model="createdProject.name">
                                </div>
                                <div class="col-span-2 sm:col-span-1">
                                    <label for="statusUpdateUser"
                                        class="block mb-4 text-sm font-medium text-gray-900">Estado</label>
                                    <input type="checkbox" id="statusUpdateUser" v-model="createdProject" />
                                </div>
                            </div>
                            <button type="submit" @click="closeModal"
                                class="text-white inline-flex items-center bg-violet-700 hover:bg-violet-800 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                                Crear usuario
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import GlobalService from "../../../services/GlobalServices";
    import { VueGoodTable } from "vue-good-table-next";
    import "vue-good-table-next/dist/vue-good-table-next.css";
    import { useToast } from "vue-toastification";
    import dayjs from "dayjs"; // Importa dayjs
    export default {
        name: "list-users",
        components: {
            VueGoodTable,
        },
        data() {
            return {
                showProjectUpdateModal: false,
                showProjectCreateModal: false,
                searchOptions: {
                    enabled: true,
                    placeholder: "Buscar",
                },
                paginationOptions: {
                    enabled: true,
                    perPage: 5,
                    nextLabel: "Siguiente",
                    prevLabel: "Anterior",
                    rowsPerPageLabel: "Filas por página",
                    paginationComplete: false,
                    ofLabel: "de",
                },
                toast: useToast(),
                columns: [
                    {
                        label: "Id de encuesta",
                        field: "surveyID",
                    },
                    {
                        label: "Código",
                        field: "code",
                    },
                    {
                        label: "Nombre",
                        field: "name",
                    },
                    {
                        label: "Región",
                        field: "RegionVarName",
                    },
                    {
                        label: "Comuna",
                        field: "ComunaVarName",
                    },
                    {
                        label: "UMP",
                        field: "UMPVarName",
                    },
                    {
                        label: "Estado",
                        field: "status",
                    },
                    {
                        label: "Acciones",
                        field: "acciones",
                        type: "slots",
                    },
                ],
                rows: [],
                editedProject: {
                    code: "",
                    name: "",
                    surveyID: "",
                    status: "",
                    RegionVarName: "",
                    ComunaVarName: "",
                    UMPVarName: ""
                },
                createdProject: {
                    code: "",
                    name: "",
                    surveyID: "",
                    status: "",
                    RegionVarName: "",
                    ComunaVarName: "",
                    UMPVarName: ""
                }
            };
        },
        methods: {
            openUpdateProjectModal(item) {
                this.showProjectUpdateModal = true;
                this.editedProject = { ...item };
                this.showProjectUpdateModal = true;
                if (item.status === "Activo") {
                    this.editedProject.status = true;
                } else {
                    this.editedProject.status = false;
                }
            },
            openCreateProjectModal() {
                this.showProjectCreateModal = true;
            },
            closeUpdateProjectModal() {
                this.showProjectUpdateModal = false;
            },
            closeCreateProjectModal() {
                this.showProjectCreateModal = false;
            },
            getDataProjects() {
                GlobalService.getData("/project/list-projects")
                    .then((response) => {
                        this.rows = response.projects.map((project) => ({
                            id: project.id,
                            surveyID: project.surveyID,
                            code: project.code,
                            name: project.name,
                            RegionVarName: project.RegionVarName,
                            ComunaVarName: project.ComunaVarName,
                            UMPVarName: project.UMPVarName,
                            status: project.status ? "Activo" : "Inactivo",
                        }));
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            },
            createProject(createdProject) {
                    GlobalService.createData("/project/create", createdProject)
                        .then((response) => {
                            this.toast.success(response.msg);
                            this.rows = response.projects.map((project) => ({
                                id: project.id,
                                surveyID: project.surveyID,
                                code: project.code,
                                name: project.name,
                                RegionVarName: project.RegionVarName,
                                ComunaVarName: project.ComunaVarName,
                                UMPVarName: project.UMPVarName,
                                status: project.status ? "Activo" : "Inactivo",
                            }));
                            this.closeCreateProjectModal()
                        })
                        .catch((e) => {
                            let errors = e.response.data.errors;
                            let error = e.response.data.error;
                            console.log(errors)
                            if (errors) {
                                errors.forEach((error_element) => {
                                    this.toast.error(error_element.msg);
                                });
                            } else {
                                this.toast.error(error);
                            }
                        });
                },
            updateProject(projectId, editedProject) {
                GlobalService.setData("/project/update", projectId, editedProject)
                    .then((response) => {
                        this.toast.success(response.msg);
                        this.rows = response.projects.map((project) => ({
                            id: project.id,
                            surveyID: project.surveyID,
                            code: project.code,
                            name: project.name,
                            RegionVarName: project.RegionVarName,
                            ComunaVarName: project.ComunaVarName,
                            UMPVarName: project.UMPVarName,
                            status: project.status ? "Activo" : "Inactivo",
                        }));
                        this.closeUpdateProjectModal()
                    })
                    .catch((e) => {
                        let errors = e.response.data.errors;
                        let error = e.response.data.error;
                        console.log(errors)
                        if (errors) {
                            errors.forEach((error_element) => {
                                this.toast.error(error_element.msg);
                            });
                        } else {
                            this.toast.error(error);
                        }
                    });
            }
        },
        mounted() {
            this.getDataProjects();
        },
    }
</script>

<style>

</style>