<template>
    <div class="grid grid-cols-1 gap-6 mb-6">
        <div class="bg-white rounded-md border border-gray-100 p-6 shadow-md shadow-black/5">
            <div class="flex">
                <button type="button"
                    class="text-white bg-lime-500 hover:bg-lime-600 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ml-auto"
                    data-bs-toggle="modal" data-bs-target="#modalcreateStudy" @click="openCreateStudyModal()">
                    Agregar
                </button>
            </div>
            <div class="text-2xl font-semibold mb-1">Estudios</div>
            <VueGoodTable :columns="columns" :rows="rows" :search-options="searchOptions"
                :pagination-options="paginationOptions" max-height="450px" :fixed-header="true">
                <template v-slot:table-row="props">
                    <span v-if="props.column.field == 'acciones'">
                        <button type="button"
                            class="text-white bg-violet-700 hover:bg-violet-800 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3"
                            data-bs-toggle="modal" data-bs-target="#modalUpdateStudy"
                            @click="openUpdateStudyModal(props.row)">
                            Editar
                        </button>
                        <button type="button"
                            class="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                            @click="openDeleteStudyAlert(props.row)">
                            Eliminar
                        </button>
                    </span>
                </template>
                <template v-slot:emptystate>
                    <div style="text-align: center">No hay datos disponibles</div>
                </template>
            </VueGoodTable>
            <div v-if="showStudyDeleteAlert" class="fixed z-10 inset-0 overflow-y-auto">
                <div class="flex items-center justify-center min-h-screen">
                    <div class="fixed inset-0 transition-opacity" @click="closeDeleteStudyalert" aria-hidden="true">
                        <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
                    </div>
                    <div class="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full p-4 mb-4"
                        role="dialog" aria-modal="true" aria-labelledby="modal-headline">
                        <div class="flex items-center">
                            <h3 class="text-lg font-medium">
                                ¿Estás seguro que deseas eliminar al estudio
                                {{ studyDeleted.name }}?
                            </h3>
                        </div>
                        <div class="mt-2 mb-4 text-sm">
                            Este elemento se eliminará permanentemente. Esta acción no se
                            puede revertir.
                        </div>
                        <div class="flex">
                            <button @click="deleteStudy(this.studyDeleted.id)" type="button"
                                class="text-white inline-flex items-center bg-red-700 hover:bg-red-800 border border-red-800 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2">
                                Eliminar
                            </button>
                            <button @click="closeDeleteStudyalert()" type="button"
                                class="text-red-800 bg-transparent inline-flex items-center hover:bg-red-800 hover:text-white border border-red-800 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                                data-dismiss-target="#alert-additional-content-2" aria-label="Close">
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="showStudyUpdateModal" class="fixed z-10 inset-0 overflow-y-auto">
                <div class="flex items-center justify-center min-h-screen">
                    <div class="fixed inset-0 transition-opacity" @click="closeUpdateStudyModal" aria-hidden="true">
                        <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
                    </div>
                    <div class="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full"
                        role="dialog" aria-modal="true" aria-labelledby="modal-headline">
                        <button @click="closeUpdateStudyModal"
                            class="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none">
                            <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <form @submit.prevent="updateStudy(editedStudy.id, editedStudy)" class="p-4 md:p-5">
                            <div v-show="nextStudyUpdateModal" class="modal-content grid gap-2 mb-4 grid-cols-2">
                                <div class="col-span-2">
                                    <label for="surveyID" class="block mb-2 text-sm font-medium text-gray-900">Id de
                                        encuesta:</label>
                                    <input type="text" name="surveyID" id="surveyID"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Id de encuesta" v-model.trim="editedStudy.surveyID" />
                                </div>
                                <div class="col-span-2">
                                    <label for="code" class="block mb-2 text-sm font-medium text-gray-900">Código del
                                        estudio:</label>
                                    <input type="text" name="code" id="code"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Código del estudio" v-model.trim="editedStudy.code" />
                                </div>
                                <div class="col-span-2">
                                    <label for="name" class="block mb-2 text-sm font-medium text-gray-900">Nombre de
                                        estudio:</label>
                                    <input type="text" name="name" id="name"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Nombre de estudio" v-model.trim="editedStudy.name" />
                                </div>
                                <div class="col-span-2">
                                    <label for="expectedCases"
                                        class="block mb-2 text-sm font-medium text-gray-900">Casos esperados:</label>
                                    <input type="number" name="expectedCases" id="expectedCases"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Casos esperados" v-model="editedStudy.expectedCases" min="0" />
                                </div>
                                <div class="col-span-2">
                                    <label for="startDate" class="block mb-2 text-sm font-medium text-gray-900">Fecha de
                                        inicio del estudio:</label>
                                    <input type="date" name="startDate" id="startDate"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        v-model="editedStudy.startDate"/>
                                </div>
                                <div class="col-span-2">
                                    <label for="telefono" class="block mb-2 text-sm font-medium text-gray-900">Teléfono:</label>
                                    <input type="text" name="telefono" id="telefono"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Teléfono" v-model.trim="editedStudy.TelefonoVarName" />
                                </div>
                                <div class="col-span-2">
                                    <label for="RegionVarName"
                                        class="block mb-2 text-sm font-medium text-gray-900">Región:</label>
                                    <input type="text" name="RegionVarName" id="RegionVarName"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Región" v-model.trim="editedStudy.RegionVarName" />
                                </div>
                                <div class="col-span-2">
                                    <label for="ComunaVarName"
                                        class="block mb-2 text-sm font-medium text-gray-900">Comuna:</label>
                                    <input type="text" name="ComunaVarName" id="ComunaVarName"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Comuna" v-model.trim="editedStudy.ComunaVarName" />
                                </div>
                                <div class="col-span-2">
                                    <label for="UMPVarName"
                                        class="block mb-2 text-sm font-medium text-gray-900">UMP:</label>
                                    <input type="text" name="UMPVarName" id="UMPVarName"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="UMP" v-model.trim="editedStudy.UMPVarName" />
                                </div>
                                <div class="col-span-2 sm:col-span-1">
                                    <label for="status"
                                        class="block mb-4 text-sm font-medium text-gray-900">Estado</label>
                                    <input type="checkbox" name="status" id="status" v-model="editedStudy.status" />
                                </div>
                            </div>
                            <div class="flex justify-end mt-4" v-show="nextStudyUpdateModal">
                                <button type="button" @click="nextUpdateModal"
                                    class="text-white inline-flex items-center bg-zinc-500 hover:bg-zinc-600 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                                    Siguiente
                                </button>
                            </div>
                            <div v-show="!nextStudyUpdateModal" class="modal-content grid gap-2 mb-4 grid-cols-6">
                                <div class="col-span-2">
                                    <label for="expectedCasesRegion1"
                                        class="block mb-2 text-sm font-medium text-gray-900">Casos esperados región
                                        1:</label>
                                    <input type="number" name="expectedCasesRegion1" id="expectedCasesRegion1"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Casos esperados" v-model="editedStudy.expectedCasesRegion1"
                                        min="0" />
                                </div>
                                <div class="col-span-2">
                                    <label for="expectedCasesUrbanAreaRegion1"
                                        class="block mb-2 text-sm font-medium text-gray-900">Casos esperados por zona urbana:</label>
                                    <input type="number" name="expectedCasesUrbanAreaRegion1" id="expectedCasesUrbanAreaRegion1"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Casos esperados" v-model="editedStudy.expectedCasesUrbanAreaRegion1"
                                        min="0" />
                                </div>
                                <div class="col-span-2">
                                    <label for="expectedCasesRuralAreaRegion1"
                                        class="block mb-2 text-sm font-medium text-gray-900">Casos esperados por zona rural:</label>
                                    <input type="number" name="expectedCasesRuralAreaRegion1" id="expectedCasesRuralAreaRegion1"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Casos esperados" v-model="editedStudy.expectedCasesRuralAreaRegion1"
                                        min="0" />
                                </div>
                                <div class="col-span-2">
                                    <label for="expectedCasesRegion2"
                                        class="block mb-2 text-sm font-medium text-gray-900">Casos esperados región 2:</label>
                                    <input type="number" name="expectedCasesRegion2" id="expectedCasesRegion2"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Casos esperados" v-model="editedStudy.expectedCasesRegion2"
                                        min="0" />
                                </div>
                                <div class="col-span-2">
                                    <label for="expectedCasesUrbanAreaRegion2"
                                        class="block mb-2 text-sm font-medium text-gray-900">Casos esperados por zona urbana:</label>
                                    <input type="number" name="expectedCasesUrbanAreaRegion2" id="expectedCasesUrbanAreaRegion2"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Casos esperados" v-model="editedStudy.expectedCasesUrbanAreaRegion2"
                                        min="0" />
                                </div>
                                <div class="col-span-2">
                                    <label for="expectedCasesRuralAreaRegion2"
                                        class="block mb-2 text-sm font-medium text-gray-900">Casos esperados por zona rural:</label>
                                    <input type="number" name="expectedCasesRuralAreaRegion2" id="expectedCasesRuralAreaRegion2"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Casos esperados" v-model="editedStudy.expectedCasesRuralAreaRegion2"
                                        min="0" />
                                </div>
                                <div class="col-span-2">
                                    <label for="expectedCasesRegion3"
                                        class="block mb-2 text-sm font-medium text-gray-900">Casos esperados región
                                        3:</label>
                                    <input type="number" name="expectedCasesRegion3" id="expectedCasesRegion3"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Casos esperados" v-model="editedStudy.expectedCasesRegion3"
                                        min="0" />
                                </div>
                                <div class="col-span-2">
                                    <label for="expectedCasesUrbanAreaRegion3"
                                        class="block mb-2 text-sm font-medium text-gray-900">Casos esperados por zona urbana:</label>
                                    <input type="number" name="expectedCasesUrbanAreaRegion3" id="expectedCasesUrbanAreaRegion3"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Casos esperados" v-model="editedStudy.expectedCasesUrbanAreaRegion3"
                                        min="0" />
                                </div>
                                <div class="col-span-2">
                                    <label for="expectedCasesRuralAreaRegion3"
                                        class="block mb-2 text-sm font-medium text-gray-900">Casos esperados por zona rural:</label>
                                    <input type="number" name="expectedCasesRuralAreaRegion3" id="expectedCasesRuralAreaRegion3"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Casos esperados" v-model="editedStudy.expectedCasesRuralAreaRegion3"
                                        min="0" />
                                </div>
                                <div class="col-span-2">
                                    <label for="expectedCasesRegion4"
                                        class="block mb-2 text-sm font-medium text-gray-900">Casos esperados región
                                        4:</label>
                                    <input type="number" name="expectedCasesRegion4" id="expectedCasesRegion4"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Casos esperados" v-model="editedStudy.expectedCasesRegion4"
                                        min="0" />
                                </div>
                                <div class="col-span-2">
                                    <label for="expectedCasesUrbanAreaRegion4"
                                        class="block mb-2 text-sm font-medium text-gray-900">Casos esperados por zona urbana:</label>
                                    <input type="number" name="expectedCasesUrbanAreaRegion4" id="expectedCasesUrbanAreaRegion4"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Casos esperados" v-model="editedStudy.expectedCasesUrbanAreaRegion4"
                                        min="0" />
                                </div>
                                <div class="col-span-2">
                                    <label for="expectedCasesRuralAreaRegion4"
                                        class="block mb-2 text-sm font-medium text-gray-900">Casos esperados por zona rural:</label>
                                    <input type="number" name="expectedCasesRuralAreaRegion4" id="expectedCasesRuralAreaRegion4"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Casos esperados" v-model="editedStudy.expectedCasesRuralAreaRegion4"
                                        min="0" />
                                </div>
                                <div class="col-span-2">
                                    <label for="expectedCasesRegion5"
                                        class="block mb-2 text-sm font-medium text-gray-900">Casos esperados región 5:</label>
                                    <input type="number" name="expectedCasesRegion5" id="expectedCasesRegion5"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Casos esperados" v-model="editedStudy.expectedCasesRegion5"
                                        min="0" />
                                </div>
                                <div class="col-span-2">
                                    <label for="expectedCasesUrbanAreaRegion5"
                                        class="block mb-2 text-sm font-medium text-gray-900">Casos esperados por zona urbana:</label>
                                    <input type="number" name="expectedCasesUrbanAreaRegion5" id="expectedCasesUrbanAreaRegion5"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Casos esperados" v-model="editedStudy.expectedCasesUrbanAreaRegion5"
                                        min="0" />
                                </div>
                                <div class="col-span-2">
                                    <label for="expectedCasesRuralAreaRegion5"
                                        class="block mb-2 text-sm font-medium text-gray-900">Casos esperados por zona rural:</label>
                                    <input type="number" name="expectedCasesRuralAreaRegion5" id="expectedCasesRuralAreaRegion5"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Casos esperados" v-model="editedStudy.expectedCasesRuralAreaRegion5"
                                        min="0" />
                                </div>
                                <div class="col-span-2">
                                    <label for="expectedCasesRegion6"
                                        class="block mb-2 text-sm font-medium text-gray-900">Casos esperados región 6:</label>
                                    <input type="number" name="expectedCasesRegion6" id="expectedCasesRegion6"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Casos esperados" v-model="editedStudy.expectedCasesRegion6"
                                        min="0" />
                                </div>
                                <div class="col-span-2">
                                    <label for="expectedCasesUrbanAreaRegion6"
                                        class="block mb-2 text-sm font-medium text-gray-900">Casos esperados por zona urbana:</label>
                                    <input type="number" name="expectedCasesUrbanAreaRegion6" id="expectedCasesUrbanAreaRegion6"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Casos esperados" v-model="editedStudy.expectedCasesUrbanAreaRegion6"
                                        min="0" />
                                </div>
                                <div class="col-span-2">
                                    <label for="expectedCasesRuralAreaRegion6"
                                        class="block mb-2 text-sm font-medium text-gray-900">Casos esperados por zona rural:</label>
                                    <input type="number" name="expectedCasesRuralAreaRegion6" id="expectedCasesRuralAreaRegion6"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Casos esperados" v-model="editedStudy.expectedCasesRuralAreaRegion6"
                                        min="0" />
                                </div>
                                <div class="col-span-2">
                                    <label for="expectedCasesRegion7"
                                        class="block mb-2 text-sm font-medium text-gray-900">Casos esperados región 7:</label>
                                    <input type="number" name="expectedCasesRegion7" id="expectedCasesRegion7"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Casos esperados" v-model="editedStudy.expectedCasesRegion7"
                                        min="0" />
                                </div>
                                <div class="col-span-2">
                                    <label for="expectedCasesUrbanAreaRegion7"
                                        class="block mb-2 text-sm font-medium text-gray-900">Casos esperados por zona urbana:</label>
                                    <input type="number" name="expectedCasesUrbanAreaRegion7" id="expectedCasesUrbanAreaRegion7"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Casos esperados" v-model="editedStudy.expectedCasesUrbanAreaRegion7"
                                        min="0" />
                                </div>
                                <div class="col-span-2">
                                    <label for="expectedCasesRuralAreaRegion7"
                                        class="block mb-2 text-sm font-medium text-gray-900">Casos esperados por zona rural:</label>
                                    <input type="number" name="expectedCasesRuralAreaRegion7" id="expectedCasesRuralAreaRegion7"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Casos esperados" v-model="editedStudy.expectedCasesRuralAreaRegion7"
                                        min="0" />
                                </div>
                                <div class="col-span-2">
                                    <label for="expectedCasesRegion8"
                                        class="block mb-2 text-sm font-medium text-gray-900">Casos esperados región 8:</label>
                                    <input type="number" name="expectedCasesRegion8" id="expectedCasesRegion8"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Casos esperados" v-model="editedStudy.expectedCasesRegion8"
                                        min="0" />
                                </div>
                                <div class="col-span-2">
                                    <label for="expectedCasesUrbanAreaRegion8"
                                        class="block mb-2 text-sm font-medium text-gray-900">Casos esperados por zona urbana:</label>
                                    <input type="number" name="expectedCasesUrbanAreaRegion8" id="expectedCasesUrbanAreaRegion8"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Casos esperados" v-model="editedStudy.expectedCasesUrbanAreaRegion8"
                                        min="0" />
                                </div>
                                <div class="col-span-2">
                                    <label for="expectedCasesRuralAreaRegion8"
                                        class="block mb-2 text-sm font-medium text-gray-900">Casos esperados por zona rural:</label>
                                    <input type="number" name="expectedCasesRuralAreaRegion8" id="expectedCasesRuralAreaRegion8"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Casos esperados" v-model="editedStudy.expectedCasesRuralAreaRegion8"
                                        min="0" />
                                </div>
                                <div class="col-span-2">
                                    <label for="expectedCasesRegion9"
                                        class="block mb-2 text-sm font-medium text-gray-900">Casos esperados región
                                        9:</label>
                                    <input type="number" name="expectedCasesRegion9" id="expectedCasesRegion9"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Casos esperados" v-model="editedStudy.expectedCasesRegion9"
                                        min="0" />
                                </div>
                                <div class="col-span-2">
                                    <label for="expectedCasesUrbanAreaRegion9"
                                        class="block mb-2 text-sm font-medium text-gray-900">Casos esperados por zona urbana:</label>
                                    <input type="number" name="expectedCasesUrbanAreaRegion9" id="expectedCasesUrbanAreaRegion9"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Casos esperados" v-model="editedStudy.expectedCasesUrbanAreaRegion9"
                                        min="0" />
                                </div>
                                <div class="col-span-2">
                                    <label for="expectedCasesRuralAreaRegion9"
                                        class="block mb-2 text-sm font-medium text-gray-900">Casos esperados por zona rural:</label>
                                    <input type="number" name="expectedCasesRuralAreaRegion9" id="expectedCasesRuralAreaRegion9"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Casos esperados" v-model="editedStudy.expectedCasesRuralAreaRegion9"
                                        min="0" />
                                </div>
                                <div class="col-span-2">
                                    <label for="expectedCasesRegion10"
                                        class="block mb-2 text-sm font-medium text-gray-900">Casos esperados región
                                        10:</label>
                                    <input type="number" name="expectedCasesRegion10" id="expectedCasesRegion10"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Casos esperados" v-model="editedStudy.expectedCasesRegion10"
                                        min="0" />
                                </div>
                                <div class="col-span-2">
                                    <label for="expectedCasesUrbanAreaRegion10"
                                        class="block mb-2 text-sm font-medium text-gray-900">Casos esperados por zona urbana:</label>
                                    <input type="number" name="expectedCasesUrbanAreaRegion10" id="expectedCasesUrbanAreaRegion10"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Casos esperados" v-model="editedStudy.expectedCasesUrbanAreaRegion10"
                                        min="0" />
                                </div>
                                <div class="col-span-2">
                                    <label for="expectedCasesRuralAreaRegion10"
                                        class="block mb-2 text-sm font-medium text-gray-900">Casos esperados por zona rural:</label>
                                    <input type="number" name="expectedCasesRuralAreaRegion10" id="expectedCasesRuralAreaRegion10"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Casos esperados" v-model="editedStudy.expectedCasesRuralAreaRegion10"
                                        min="0" />
                                </div>
                                <div class="col-span-2">
                                    <label for="expectedCasesRegion11"
                                        class="block mb-2 text-sm font-medium text-gray-900">Casos esperados región
                                        11:</label>
                                    <input type="number" name="expectedCasesRegion11" id="expectedCasesRegion11"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Casos esperados" v-model="editedStudy.expectedCasesRegion11"
                                        min="0" />
                                </div>
                                <div class="col-span-2">
                                    <label for="expectedCasesUrbanAreaRegion11"
                                        class="block mb-2 text-sm font-medium text-gray-900">Casos esperados por zona urbana:</label>
                                    <input type="number" name="expectedCasesUrbanAreaRegion11" id="expectedCasesUrbanAreaRegion11"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Casos esperados" v-model="editedStudy.expectedCasesUrbanAreaRegion11"
                                        min="0" />
                                </div>
                                <div class="col-span-2">
                                    <label for="expectedCasesRuralAreaRegion11"
                                        class="block mb-2 text-sm font-medium text-gray-900">Casos esperados por zona rural:</label>
                                    <input type="number" name="expectedCasesRuralAreaRegion11" id="expectedCasesRuralAreaRegion11"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Casos esperados" v-model="editedStudy.expectedCasesRuralAreaRegion11"
                                        min="0" />
                                </div>
                                <div class="col-span-2">
                                    <label for="expectedCasesRegion12"
                                        class="block mb-2 text-sm font-medium text-gray-900">Casos esperados región
                                        12:</label>
                                    <input type="number" name="expectedCasesRegion12" id="expectedCasesRegion12"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Casos esperados" v-model="editedStudy.expectedCasesRegion12"
                                        min="0" />
                                </div>
                                <div class="col-span-2">
                                    <label for="expectedCasesUrbanAreaRegion12"
                                        class="block mb-2 text-sm font-medium text-gray-900">Casos esperados por zona urbana:</label>
                                    <input type="number" name="expectedCasesUrbanAreaRegion12" id="expectedCasesUrbanAreaRegion12"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Casos esperados" v-model="editedStudy.expectedCasesUrbanAreaRegion12"
                                        min="0" />
                                </div>
                                <div class="col-span-2">
                                    <label for="expectedCasesRuralAreaRegion12"
                                        class="block mb-2 text-sm font-medium text-gray-900">Casos esperados por zona rural:</label>
                                    <input type="number" name="expectedCasesRuralAreaRegion12" id="expectedCasesRuralAreaRegion12"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Casos esperados" v-model="editedStudy.expectedCasesRuralAreaRegion12"
                                        min="0" />
                                </div>
                                <div class="col-span-2">
                                    <label for="expectedCasesRegion13"
                                        class="block mb-2 text-sm font-medium text-gray-900">Casos esperados región 13:</label>
                                    <input type="number" name="expectedCasesRegion13" id="expectedCasesRegion13"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Casos esperados" v-model="editedStudy.expectedCasesRegion13"
                                        min="0" />
                                </div>
                                <div class="col-span-2">
                                    <label for="expectedCasesUrbanAreaRegion13"
                                        class="block mb-2 text-sm font-medium text-gray-900">Casos esperados por zona urbana:</label>
                                    <input type="number" name="expectedCasesUrbanAreaRegion13" id="expectedCasesUrbanAreaRegion13"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Casos esperados" v-model="editedStudy.expectedCasesUrbanAreaRegion13"
                                        min="0" />
                                </div>
                                <div class="col-span-2">
                                    <label for="expectedCasesRuralAreaRegion13"
                                        class="block mb-2 text-sm font-medium text-gray-900">Casos esperados por zona rural:</label>
                                    <input type="number" name="expectedCasesRuralAreaRegion13" id="expectedCasesRuralAreaRegion13"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Casos esperados" v-model="editedStudy.expectedCasesRuralAreaRegion13"
                                        min="0" />
                                </div>
                                <div class="col-span-2">
                                    <label for="expectedCasesRegion14"
                                        class="block mb-2 text-sm font-medium text-gray-900">Casos esperados región 14:</label>
                                    <input type="number" name="expectedCasesRegion14" id="expectedCasesRegion14"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Casos esperados" v-model="editedStudy.expectedCasesRegion14"
                                        min="0" />
                                </div>
                                <div class="col-span-2">
                                    <label for="expectedCasesUrbanAreaRegion14"
                                        class="block mb-2 text-sm font-medium text-gray-900">Casos esperados por zona urbana:</label>
                                    <input type="number" name="expectedCasesUrbanAreaRegion14" id="expectedCasesUrbanAreaRegion14"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Casos esperados" v-model="editedStudy.expectedCasesUrbanAreaRegion14"
                                        min="0" />
                                </div>
                                <div class="col-span-2">
                                    <label for="expectedCasesRuralAreaRegion14"
                                        class="block mb-2 text-sm font-medium text-gray-900">Casos esperados por zona rural:</label>
                                    <input type="number" name="expectedCasesRuralAreaRegion14" id="expectedCasesRuralAreaRegion14"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Casos esperados" v-model="editedStudy.expectedCasesRuralAreaRegion14"
                                        min="0" />
                                </div>
                                <div class="col-span-2">
                                    <label for="expectedCasesRegion15"
                                        class="block mb-2 text-sm font-medium text-gray-900">Casos esperados región 15:</label>
                                    <input type="number" name="expectedCasesRegion15" id="expectedCasesRegion15"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Casos esperados" v-model="editedStudy.expectedCasesRegion15"
                                        min="0" />
                                </div>
                                <div class="col-span-2">
                                    <label for="expectedCasesUrbanAreaRegion15"
                                        class="block mb-2 text-sm font-medium text-gray-900">Casos esperados por zona urbana:</label>
                                    <input type="number" name="expectedCasesUrbanAreaRegion15" id="expectedCasesUrbanAreaRegion15"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Casos esperados" v-model="editedStudy.expectedCasesUrbanAreaRegion15"
                                        min="0" />
                                </div>
                                <div class="col-span-2">
                                    <label for="expectedCasesRuralAreaRegion15"
                                        class="block mb-2 text-sm font-medium text-gray-900">Casos esperados por zona rural:</label>
                                    <input type="number" name="expectedCasesRuralAreaRegion15" id="expectedCasesRuralAreaRegion15"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Casos esperados" v-model="editedStudy.expectedCasesRuralAreaRegion15"
                                        min="0" />
                                </div>
                                <div class="col-span-2">
                                    <label for="expectedCasesRegion16"
                                        class="block mb-2 text-sm font-medium text-gray-900">Casos esperados región 16:</label>
                                    <input type="number" name="expectedCasesRegion16" id="expectedCasesRegion16"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Casos esperados" v-model="editedStudy.expectedCasesRegion16"
                                        min="0" />
                                </div>
                                <div class="col-span-2">
                                    <label for="expectedCasesUrbanAreaRegion16"
                                        class="block mb-2 text-sm font-medium text-gray-900">Casos esperados por zona urbana:</label>
                                    <input type="number" name="expectedCasesUrbanAreaRegion16" id="expectedCasesUrbanAreaRegion16"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Casos esperados" v-model="editedStudy.expectedCasesUrbanAreaRegion16"
                                        min="0" />
                                </div>
                                <div class="col-span-2">
                                    <label for="expectedCasesRuralAreaRegion16"
                                        class="block mb-2 text-sm font-medium text-gray-900">Casos esperados por zona rural:</label>
                                    <input type="number" name="expectedCasesRuralAreaRegion16" id="expectedCasesRuralAreaRegion16"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Casos esperados" v-model="editedStudy.expectedCasesRuralAreaRegion16"
                                        min="0" />
                                </div>
                            </div>
                            <div class="flex justify-between mt-4" v-show="!nextStudyUpdateModal">
                                <button type="button" @click="returnUpdateModal"
                                    class="text-white inline-flex items-center bg-zinc-500 hover:bg-zinc-600 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                                    Volver
                                </button>
                                <button type="submit"
                                    class="text-white inline-flex items-center bg-violet-700 hover:bg-violet-800 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                                    Editar estudio
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div v-if="showStudyCreateModal" class="fixed z-10 inset-0 overflow-y-auto">
                <div class="flex items-center justify-center min-h-screen">
                    <div class="fixed inset-0 transition-opacity" @click="closeCreateStudyModal" aria-hidden="true">
                        <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
                    </div>
                    <div class="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full"
                        role="dialog" aria-modal="true" aria-labelledby="modal-headline">
                        <button @click="closeCreateStudyModal"
                            class="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none">
                            <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <form @submit.prevent="createStudy(createdStudy)" class="p-4 md:p-5">
                            <div v-show="nextStudyCreateModal" class="modal-content grid gap-2 mb-4 grid-cols-2">
                                <div class="col-span-2">
                                    <label for="surveyID" class="block mb-2 text-sm font-medium text-gray-900">Id de
                                        encuesta:</label>
                                    <input type="text" name="surveyID" id="surveyID"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Id de encuesta" v-model.trim="createdStudy.surveyID" />
                                </div>
                                <div class="col-span-2">
                                    <label for="code" class="block mb-2 text-sm font-medium text-gray-900">Código del
                                        estudio:</label>
                                    <input type="text" name="code" id="code"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Código del estudio" v-model.trim="createdStudy.code" />
                                </div>
                                <div class="col-span-2">
                                    <label for="name" class="block mb-2 text-sm font-medium text-gray-900">Nombre del
                                        estudio:</label>
                                    <input type="text" name="name" id="name"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Nombre del estudio" v-model.trim="createdStudy.name" />
                                </div>
                                <div class="col-span-2">
                                    <label for="expectedCases" class="block mb-2 text-sm font-medium text-gray-900">Casos
                                        esperados:</label>
                                    <input type="number" name="expectedCases" id="expectedCases"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Casos esperados" v-model="createdStudy.expectedCases" min="0" />
                                </div>
                                <div class="col-span-2">
                                    <label for="name" class="block mb-2 text-sm font-medium text-gray-900">Fecha de
                                        inicio del estudio:</label>
                                    <input type="date" name="name" id="name"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        v-model="createdStudy.startDate" />
                                </div>
                                <div class="col-span-2">
                                    <label for="telefono" class="block mb-2 text-sm font-medium text-gray-900">Correo:</label>
                                    <input type="text" name="telefono" id="telefono"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Teléfono" v-model.trim="createdStudy.CorreoVarName" />
                                </div>
                                <div class="col-span-2">
                                    <label for="direccion" class="block mb-2 text-sm font-medium text-gray-900">Dirección:</label>
                                    <input type="text" name="direccion" id="direccion"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Dirección" v-model.trim="createdStudy.DireccionVarName" />
                                </div>
                                <div class="col-span-2">
                                    <label for="telefono" class="block mb-2 text-sm font-medium text-gray-900">Teléfono:</label>
                                    <input type="text" name="telefono" id="telefono"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Teléfono" v-model.trim="createdStudy.TelefonoVarName" />
                                </div>
                                <div class="col-span-2">
                                    <label for="name"
                                        class="block mb-2 text-sm font-medium text-gray-900">Region:</label>
                                    <input type="text" name="name" id="name"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Región" v-model.trim="createdStudy.RegionVarName" />
                                </div>
                                <div class="col-span-2">
                                    <label for="name"
                                        class="block mb-2 text-sm font-medium text-gray-900">Comuna:</label>
                                    <input type="text" name="name" id="name"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Comuna" v-model.trim="createdStudy.ComunaVarName" />
                                </div>
                                <div class="col-span-2">
                                    <label for="name" class="block mb-2 text-sm font-medium text-gray-900">UMP:</label>
                                    <input type="text" name="name" id="name"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="UMP" v-model.trim="createdStudy.UMPVarName" />
                                </div>
                                <div class="col-span-2 sm:col-span-1">
                                    <label for="status"
                                        class="block mb-4 text-sm font-medium text-gray-900">Estado</label>
                                    <input type="checkbox" name="status" id="status" v-model="createdStudy.status" />
                                </div>
                            </div>
                            <div class="flex justify-end mt-4" v-show="nextStudyCreateModal">
                                <button type="button" @click="nextCreateModal"
                                    class="text-white inline-flex items-center bg-zinc-500 hover:bg-zinc-600 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                                    Siguiente
                                </button>
                            </div>
                            <div v-show="!nextStudyCreateModal" class="modal-content grid gap-2 mb-4 grid-cols-6">
                                <div class="col-span-2">
                                    <label for="expectedCasesRegion1"
                                        class="block mb-2 text-sm font-medium text-gray-900">Casos esperados región
                                        1:</label>
                                    <input type="number" name="expectedCasesRegion1" id="expectedCasesRegion1"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Casos esperados" v-model="createdStudy.expectedCasesRegion1"
                                        min="0" />
                                </div>
                                <div class="col-span-2">
                                    <label for="expectedCasesUrbanAreaRegion1"
                                        class="block mb-2 text-sm font-medium text-gray-900">Casos esperados por zona urbana:</label>
                                    <input type="number" name="expectedCasesUrbanAreaRegion1" id="expectedCasesUrbanAreaRegion1"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Casos esperados" v-model="createdStudy.expectedCasesUrbanAreaRegion1"
                                        min="0" />
                                </div>
                                <div class="col-span-2">
                                    <label for="expectedCasesRuralAreaRegion1"
                                        class="block mb-2 text-sm font-medium text-gray-900">Casos esperados por zona rural:</label>
                                    <input type="number" name="expectedCasesRuralAreaRegion1" id="expectedCasesRuralAreaRegion1"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Casos esperados" v-model="createdStudy.expectedCasesRuralAreaRegion1"
                                        min="0" />
                                </div>
                                <div class="col-span-2">
                                    <label for="expectedCasesRegion2"
                                        class="block mb-2 text-sm font-medium text-gray-900">Casos esperados región 2:</label>
                                    <input type="number" name="expectedCasesRegion2" id="expectedCasesRegion2"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Casos esperados" v-model="createdStudy.expectedCasesRegion2"
                                        min="0" />
                                </div>
                                <div class="col-span-2">
                                    <label for="expectedCasesUrbanAreaRegion2"
                                        class="block mb-2 text-sm font-medium text-gray-900">Casos esperados por zona urbana:</label>
                                    <input type="number" name="expectedCasesUrbanAreaRegion2" id="expectedCasesUrbanAreaRegion2"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Casos esperados" v-model="createdStudy.expectedCasesUrbanAreaRegion2"
                                        min="0" />
                                </div>
                                <div class="col-span-2">
                                    <label for="expectedCasesRuralAreaRegion2"
                                        class="block mb-2 text-sm font-medium text-gray-900">Casos esperados por zona rural:</label>
                                    <input type="number" name="expectedCasesRuralAreaRegion2" id="expectedCasesRuralAreaRegion2"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Casos esperados" v-model="createdStudy.expectedCasesRuralAreaRegion2"
                                        min="0" />
                                </div>
                                <div class="col-span-2">
                                    <label for="expectedCasesRegion3"
                                        class="block mb-2 text-sm font-medium text-gray-900">Casos esperados región
                                        3:</label>
                                    <input type="number" name="expectedCasesRegion3" id="expectedCasesRegion3"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Casos esperados" v-model="createdStudy.expectedCasesRegion3"
                                        min="0" />
                                </div>
                                <div class="col-span-2">
                                    <label for="expectedCasesUrbanAreaRegion3"
                                        class="block mb-2 text-sm font-medium text-gray-900">Casos esperados por zona urbana:</label>
                                    <input type="number" name="expectedCasesUrbanAreaRegion3" id="expectedCasesUrbanAreaRegion3"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Casos esperados" v-model="createdStudy.expectedCasesUrbanAreaRegion3"
                                        min="0" />
                                </div>
                                <div class="col-span-2">
                                    <label for="expectedCasesRuralAreaRegion3"
                                        class="block mb-2 text-sm font-medium text-gray-900">Casos esperados por zona rural:</label>
                                    <input type="number" name="expectedCasesRuralAreaRegion3" id="expectedCasesRuralAreaRegion3"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Casos esperados" v-model="createdStudy.expectedCasesRuralAreaRegion3"
                                        min="0" />
                                </div>
                                <div class="col-span-2">
                                    <label for="expectedCasesRegion4"
                                        class="block mb-2 text-sm font-medium text-gray-900">Casos esperados región
                                        4:</label>
                                    <input type="number" name="expectedCasesRegion4" id="expectedCasesRegion4"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Casos esperados" v-model="createdStudy.expectedCasesRegion4"
                                        min="0" />
                                </div>
                                <div class="col-span-2">
                                    <label for="expectedCasesUrbanAreaRegion4"
                                        class="block mb-2 text-sm font-medium text-gray-900">Casos esperados por zona urbana:</label>
                                    <input type="number" name="expectedCasesUrbanAreaRegion4" id="expectedCasesUrbanAreaRegion4"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Casos esperados" v-model="createdStudy.expectedCasesUrbanAreaRegion4"
                                        min="0" />
                                </div>
                                <div class="col-span-2">
                                    <label for="expectedCasesRuralAreaRegion4"
                                        class="block mb-2 text-sm font-medium text-gray-900">Casos esperados por zona rural:</label>
                                    <input type="number" name="expectedCasesRuralAreaRegion4" id="expectedCasesRuralAreaRegion4"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Casos esperados" v-model="createdStudy.expectedCasesRuralAreaRegion4"
                                        min="0" />
                                </div>
                                <div class="col-span-2">
                                    <label for="expectedCasesRegion5"
                                        class="block mb-2 text-sm font-medium text-gray-900">Casos esperados región 5:</label>
                                    <input type="number" name="expectedCasesRegion5" id="expectedCasesRegion5"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Casos esperados" v-model="createdStudy.expectedCasesRegion5"
                                        min="0" />
                                </div>
                                <div class="col-span-2">
                                    <label for="expectedCasesUrbanAreaRegion5"
                                        class="block mb-2 text-sm font-medium text-gray-900">Casos esperados por zona urbana:</label>
                                    <input type="number" name="expectedCasesUrbanAreaRegion5" id="expectedCasesUrbanAreaRegion5"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Casos esperados" v-model="createdStudy.expectedCasesUrbanAreaRegion5"
                                        min="0" />
                                </div>
                                <div class="col-span-2">
                                    <label for="expectedCasesRuralAreaRegion5"
                                        class="block mb-2 text-sm font-medium text-gray-900">Casos esperados por zona rural:</label>
                                    <input type="number" name="expectedCasesRuralAreaRegion5" id="expectedCasesRuralAreaRegion5"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Casos esperados" v-model="createdStudy.expectedCasesRuralAreaRegion5"
                                        min="0" />
                                </div>
                                <div class="col-span-2">
                                    <label for="expectedCasesRegion6"
                                        class="block mb-2 text-sm font-medium text-gray-900">Casos esperados región 6:</label>
                                    <input type="number" name="expectedCasesRegion6" id="expectedCasesRegion6"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Casos esperados" v-model="createdStudy.expectedCasesRegion6"
                                        min="0" />
                                </div>
                                <div class="col-span-2">
                                    <label for="expectedCasesUrbanAreaRegion6"
                                        class="block mb-2 text-sm font-medium text-gray-900">Casos esperados por zona urbana:</label>
                                    <input type="number" name="expectedCasesUrbanAreaRegion6" id="expectedCasesUrbanAreaRegion6"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Casos esperados" v-model="createdStudy.expectedCasesUrbanAreaRegion6"
                                        min="0" />
                                </div>
                                <div class="col-span-2">
                                    <label for="expectedCasesRuralAreaRegion6"
                                        class="block mb-2 text-sm font-medium text-gray-900">Casos esperados por zona rural:</label>
                                    <input type="number" name="expectedCasesRuralAreaRegion6" id="expectedCasesRuralAreaRegion6"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Casos esperados" v-model="createdStudy.expectedCasesRuralAreaRegion6"
                                        min="0" />
                                </div>
                                <div class="col-span-2">
                                    <label for="expectedCasesRegion7"
                                        class="block mb-2 text-sm font-medium text-gray-900">Casos esperados región 7:</label>
                                    <input type="number" name="expectedCasesRegion7" id="expectedCasesRegion7"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Casos esperados" v-model="createdStudy.expectedCasesRegion7"
                                        min="0" />
                                </div>
                                <div class="col-span-2">
                                    <label for="expectedCasesUrbanAreaRegion7"
                                        class="block mb-2 text-sm font-medium text-gray-900">Casos esperados por zona urbana:</label>
                                    <input type="number" name="expectedCasesUrbanAreaRegion7" id="expectedCasesUrbanAreaRegion7"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Casos esperados" v-model="createdStudy.expectedCasesUrbanAreaRegion7"
                                        min="0" />
                                </div>
                                <div class="col-span-2">
                                    <label for="expectedCasesRuralAreaRegion7"
                                        class="block mb-2 text-sm font-medium text-gray-900">Casos esperados por zona rural:</label>
                                    <input type="number" name="expectedCasesRuralAreaRegion7" id="expectedCasesRuralAreaRegion7"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Casos esperados" v-model="createdStudy.expectedCasesRuralAreaRegion7"
                                        min="0" />
                                </div>
                                <div class="col-span-2">
                                    <label for="expectedCasesRegion8"
                                        class="block mb-2 text-sm font-medium text-gray-900">Casos esperados región 8:</label>
                                    <input type="number" name="expectedCasesRegion8" id="expectedCasesRegion8"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Casos esperados" v-model="createdStudy.expectedCasesRegion8"
                                        min="0" />
                                </div>
                                <div class="col-span-2">
                                    <label for="expectedCasesUrbanAreaRegion8"
                                        class="block mb-2 text-sm font-medium text-gray-900">Casos esperados por zona urbana:</label>
                                    <input type="number" name="expectedCasesUrbanAreaRegion8" id="expectedCasesUrbanAreaRegion8"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Casos esperados" v-model="createdStudy.expectedCasesUrbanAreaRegion8"
                                        min="0" />
                                </div>
                                <div class="col-span-2">
                                    <label for="expectedCasesRuralAreaRegion8"
                                        class="block mb-2 text-sm font-medium text-gray-900">Casos esperados por zona rural:</label>
                                    <input type="number" name="expectedCasesRuralAreaRegion8" id="expectedCasesRuralAreaRegion8"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Casos esperados" v-model="createdStudy.expectedCasesRuralAreaRegion8"
                                        min="0" />
                                </div>
                                <div class="col-span-2">
                                    <label for="expectedCasesRegion9"
                                        class="block mb-2 text-sm font-medium text-gray-900">Casos esperados región
                                        9:</label>
                                    <input type="number" name="expectedCasesRegion9" id="expectedCasesRegion9"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Casos esperados" v-model="createdStudy.expectedCasesRegion9"
                                        min="0" />
                                </div>
                                <div class="col-span-2">
                                    <label for="expectedCasesUrbanAreaRegion9"
                                        class="block mb-2 text-sm font-medium text-gray-900">Casos esperados por zona urbana:</label>
                                    <input type="number" name="expectedCasesUrbanAreaRegion9" id="expectedCasesUrbanAreaRegion9"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Casos esperados" v-model="createdStudy.expectedCasesUrbanAreaRegion9"
                                        min="0" />
                                </div>
                                <div class="col-span-2">
                                    <label for="expectedCasesRuralAreaRegion9"
                                        class="block mb-2 text-sm font-medium text-gray-900">Casos esperados por zona rural:</label>
                                    <input type="number" name="expectedCasesRuralAreaRegion9" id="expectedCasesRuralAreaRegion9"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Casos esperados" v-model="createdStudy.expectedCasesRuralAreaRegion9"
                                        min="0" />
                                </div>
                                <div class="col-span-2">
                                    <label for="expectedCasesRegion10"
                                        class="block mb-2 text-sm font-medium text-gray-900">Casos esperados región
                                        10:</label>
                                    <input type="number" name="expectedCasesRegion10" id="expectedCasesRegion10"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Casos esperados" v-model="createdStudy.expectedCasesRegion10"
                                        min="0" />
                                </div>
                                <div class="col-span-2">
                                    <label for="expectedCasesUrbanAreaRegion10"
                                        class="block mb-2 text-sm font-medium text-gray-900">Casos esperados por zona urbana:</label>
                                    <input type="number" name="expectedCasesUrbanAreaRegion10" id="expectedCasesUrbanAreaRegion10"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Casos esperados" v-model="createdStudy.expectedCasesUrbanAreaRegion10"
                                        min="0" />
                                </div>
                                <div class="col-span-2">
                                    <label for="expectedCasesRuralAreaRegion10"
                                        class="block mb-2 text-sm font-medium text-gray-900">Casos esperados por zona rural:</label>
                                    <input type="number" name="expectedCasesRuralAreaRegion10" id="expectedCasesRuralAreaRegion10"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Casos esperados" v-model="createdStudy.expectedCasesRuralAreaRegion10"
                                        min="0" />
                                </div>
                                <div class="col-span-2">
                                    <label for="expectedCasesRegion11"
                                        class="block mb-2 text-sm font-medium text-gray-900">Casos esperados región
                                        11:</label>
                                    <input type="number" name="expectedCasesRegion11" id="expectedCasesRegion11"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Casos esperados" v-model="createdStudy.expectedCasesRegion11"
                                        min="0" />
                                </div>
                                <div class="col-span-2">
                                    <label for="expectedCasesUrbanAreaRegion11"
                                        class="block mb-2 text-sm font-medium text-gray-900">Casos esperados por zona urbana:</label>
                                    <input type="number" name="expectedCasesUrbanAreaRegion11" id="expectedCasesUrbanAreaRegion11"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Casos esperados" v-model="createdStudy.expectedCasesUrbanAreaRegion11"
                                        min="0" />
                                </div>
                                <div class="col-span-2">
                                    <label for="expectedCasesRuralAreaRegion11"
                                        class="block mb-2 text-sm font-medium text-gray-900">Casos esperados por zona rural:</label>
                                    <input type="number" name="expectedCasesRuralAreaRegion11" id="expectedCasesRuralAreaRegion11"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Casos esperados" v-model="createdStudy.expectedCasesRuralAreaRegion11"
                                        min="0" />
                                </div>
                                <div class="col-span-2">
                                    <label for="expectedCasesRegion12"
                                        class="block mb-2 text-sm font-medium text-gray-900">Casos esperados región
                                        12:</label>
                                    <input type="number" name="expectedCasesRegion12" id="expectedCasesRegion12"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Casos esperados" v-model="createdStudy.expectedCasesRegion12"
                                        min="0" />
                                </div>
                                <div class="col-span-2">
                                    <label for="expectedCasesUrbanAreaRegion12"
                                        class="block mb-2 text-sm font-medium text-gray-900">Casos esperados por zona urbana:</label>
                                    <input type="number" name="expectedCasesUrbanAreaRegion12" id="expectedCasesUrbanAreaRegion12"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Casos esperados" v-model="createdStudy.expectedCasesUrbanAreaRegion12"
                                        min="0" />
                                </div>
                                <div class="col-span-2">
                                    <label for="expectedCasesRuralAreaRegion12"
                                        class="block mb-2 text-sm font-medium text-gray-900">Casos esperados por zona rural:</label>
                                    <input type="number" name="expectedCasesRuralAreaRegion12" id="expectedCasesRuralAreaRegion12"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Casos esperados" v-model="createdStudy.expectedCasesRuralAreaRegion12"
                                        min="0" />
                                </div>
                                <div class="col-span-2">
                                    <label for="expectedCasesRegion13"
                                        class="block mb-2 text-sm font-medium text-gray-900">Casos esperados región 13:</label>
                                    <input type="number" name="expectedCasesRegion13" id="expectedCasesRegion13"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Casos esperados" v-model="createdStudy.expectedCasesRegion13"
                                        min="0" />
                                </div>
                                <div class="col-span-2">
                                    <label for="expectedCasesUrbanAreaRegion13"
                                        class="block mb-2 text-sm font-medium text-gray-900">Casos esperados por zona urbana:</label>
                                    <input type="number" name="expectedCasesUrbanAreaRegion13" id="expectedCasesUrbanAreaRegion13"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Casos esperados" v-model="createdStudy.expectedCasesUrbanAreaRegion13"
                                        min="0" />
                                </div>
                                <div class="col-span-2">
                                    <label for="expectedCasesRuralAreaRegion13"
                                        class="block mb-2 text-sm font-medium text-gray-900">Casos esperados por zona rural:</label>
                                    <input type="number" name="expectedCasesRuralAreaRegion13" id="expectedCasesRuralAreaRegion13"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Casos esperados" v-model="createdStudy.expectedCasesRuralAreaRegion13"
                                        min="0" />
                                </div>
                                <div class="col-span-2">
                                    <label for="expectedCasesRegion14"
                                        class="block mb-2 text-sm font-medium text-gray-900">Casos esperados región 14:</label>
                                    <input type="number" name="expectedCasesRegion14" id="expectedCasesRegion14"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Casos esperados" v-model="createdStudy.expectedCasesRegion14"
                                        min="0" />
                                </div>
                                <div class="col-span-2">
                                    <label for="expectedCasesUrbanAreaRegion14"
                                        class="block mb-2 text-sm font-medium text-gray-900">Casos esperados por zona urbana:</label>
                                    <input type="number" name="expectedCasesUrbanAreaRegion14" id="expectedCasesUrbanAreaRegion14"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Casos esperados" v-model="createdStudy.expectedCasesUrbanAreaRegion14"
                                        min="0" />
                                </div>
                                <div class="col-span-2">
                                    <label for="expectedCasesRuralAreaRegion14"
                                        class="block mb-2 text-sm font-medium text-gray-900">Casos esperados por zona rural:</label>
                                    <input type="number" name="expectedCasesRuralAreaRegion14" id="expectedCasesRuralAreaRegion14"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Casos esperados" v-model="createdStudy.expectedCasesRuralAreaRegion14"
                                        min="0" />
                                </div>
                                <div class="col-span-2">
                                    <label for="expectedCasesRegion15"
                                        class="block mb-2 text-sm font-medium text-gray-900">Casos esperados región 15:</label>
                                    <input type="number" name="expectedCasesRegion15" id="expectedCasesRegion15"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Casos esperados" v-model="createdStudy.expectedCasesRegion15"
                                        min="0" />
                                </div>
                                <div class="col-span-2">
                                    <label for="expectedCasesUrbanAreaRegion15"
                                        class="block mb-2 text-sm font-medium text-gray-900">Casos esperados por zona urbana:</label>
                                    <input type="number" name="expectedCasesUrbanAreaRegion15" id="expectedCasesUrbanAreaRegion15"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Casos esperados" v-model="createdStudy.expectedCasesUrbanAreaRegion15"
                                        min="0" />
                                </div>
                                <div class="col-span-2">
                                    <label for="expectedCasesRuralAreaRegion15"
                                        class="block mb-2 text-sm font-medium text-gray-900">Casos esperados por zona rural:</label>
                                    <input type="number" name="expectedCasesRuralAreaRegion15" id="expectedCasesRuralAreaRegion15"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Casos esperados" v-model="createdStudy.expectedCasesRuralAreaRegion15"
                                        min="0" />
                                </div>
                                <div class="col-span-2">
                                    <label for="expectedCasesRegion16"
                                        class="block mb-2 text-sm font-medium text-gray-900">Casos esperados región 16:</label>
                                    <input type="number" name="expectedCasesRegion16" id="expectedCasesRegion16"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Casos esperados" v-model="createdStudy.expectedCasesRegion16"
                                        min="0" />
                                </div>
                                <div class="col-span-2">
                                    <label for="expectedCasesUrbanAreaRegion16"
                                        class="block mb-2 text-sm font-medium text-gray-900">Casos esperados por zona urbana:</label>
                                    <input type="number" name="expectedCasesUrbanAreaRegion16" id="expectedCasesUrbanAreaRegion16"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Casos esperados" v-model="createdStudy.expectedCasesUrbanAreaRegion16"
                                        min="0" />
                                </div>
                                <div class="col-span-2">
                                    <label for="expectedCasesRuralAreaRegion16"
                                        class="block mb-2 text-sm font-medium text-gray-900">Casos esperados por zona rural:</label>
                                    <input type="number" name="expectedCasesRuralAreaRegion16" id="expectedCasesRuralAreaRegion16"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Casos esperados" v-model="createdStudy.expectedCasesRuralAreaRegion16"
                                        min="0" />
                                </div>
                            </div>
                            <div class="flex justify-between mt-4" v-show="!nextStudyCreateModal">
                                <button type="button" @click="returnCreateModal"
                                    class="text-white inline-flex items-center bg-zinc-500 hover:bg-zinc-600 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                                    Volver
                                </button>
                                <button type="submit"
                                    class="text-white inline-flex items-center bg-lime-500 hover:bg-lime-600 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                                    Crear estudio
                                </button>
                            </div>
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
        name: "list-studies",
        components: {
            VueGoodTable,
        },
        data() {
            return {
                showStudyUpdateModal: false,
                showStudyCreateModal: false,
                showStudyDeleteAlert: false,
                nextStudyCreateModal: true,
                nextStudyUpdateModal: true,
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
                        label: "Correo",
                        field: "CorreoVarName",
                    },
                    {
                        label: "Dirección",
                        field: "DireccionVarName",
                    },
                    {
                        label: "Teléfono",
                        field: "TelefonoVarName",
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
                editedStudy: {
                    id: "",
                    code: "",
                    name: "",
                    surveyID: "",
                    status: "",
                    CorreoVarName:"",
                    DireccionVarName:"",
                    TelefonoVarName:"",
                    RegionVarName: "",
                    ComunaVarName: "",
                    UMPVarName: "",
                    expectedCases: "",
                    startDate: "",
                    expectedCasesRegion1: "",
                    expectedCasesUrbanAreaRegion1: "",
                    expectedCasesRuralAreaRegion1: "",
                    expectedCasesRegion2: "",
                    expectedCasesUrbanAreaRegion2: "",
                    expectedCasesRuralAreaRegion2: "",
                    expectedCasesRegion3: "",
                    expectedCasesUrbanAreaRegion3: "",
                    expectedCasesRuralAreaRegion3: "",
                    expectedCasesRegion4: "",
                    expectedCasesUrbanAreaRegion4: "",
                    expectedCasesRuralAreaRegion4: "",
                    expectedCasesRegion5: "",
                    expectedCasesUrbanAreaRegion5: "",
                    expectedCasesRuralAreaRegion5: "",
                    expectedCasesRegion6: "",
                    expectedCasesUrbanAreaRegion6: "",
                    expectedCasesRuralAreaRegion6: "",
                    expectedCasesRegion7: "",
                    expectedCasesUrbanAreaRegion7: "",
                    expectedCasesRuralAreaRegion7: "",
                    expectedCasesRegion8: "",
                    expectedCasesUrbanAreaRegion8: "",
                    expectedCasesRuralAreaRegion8: "",
                    expectedCasesRegion9: "",
                    expectedCasesUrbanAreaRegion9: "",
                    expectedCasesRuralAreaRegion9: "",
                    expectedCasesRegion10: "",
                    expectedCasesUrbanAreaRegion10: "",
                    expectedCasesRuralAreaRegion10: "",
                    expectedCasesRegion11: "",
                    expectedCasesUrbanAreaRegion11: "",
                    expectedCasesRuralAreaRegion11: "",
                    expectedCasesRegion12: "",
                    expectedCasesUrbanAreaRegion12: "",
                    expectedCasesRuralAreaRegion12: "",
                    expectedCasesRegion13: "",
                    expectedCasesUrbanAreaRegion13: "",
                    expectedCasesRuralAreaRegion13: "",
                    expectedCasesRegion14: "",
                    expectedCasesUrbanAreaRegion14: "",
                    expectedCasesRuralAreaRegion14: "",
                    expectedCasesRegion15: "",
                    expectedCasesUrbanAreaRegion15: "",
                    expectedCasesRuralAreaRegion15: "",
                    expectedCasesRegion16: "",
                    expectedCasesUrbanAreaRegion16: "",
                    expectedCasesRuralAreaRegion16: "",
                },
                createdStudy: {
                    code: "",
                    name: "",
                    surveyID: "",
                    status: false,
                    CorreoVarName:"",
                    DireccionVarName:"",
                    TelefonoVarName:"",
                    RegionVarName: "",
                    ComunaVarName: "",
                    UMPVarName: "",
                    expectedCases: 0,
                    startDate: "",
                    expectedCasesRegion1: 0,
                    expectedCasesUrbanAreaRegion1: 0,
                    expectedCasesRuralAreaRegion1: 0,
                    expectedCasesRegion2: 0,
                    expectedCasesUrbanAreaRegion2: 0,
                    expectedCasesRuralAreaRegion2: 0,
                    expectedCasesRegion3: 0,
                    expectedCasesUrbanAreaRegion3: 0,
                    expectedCasesRuralAreaRegion3: 0,
                    expectedCasesRegion4: 0,
                    expectedCasesUrbanAreaRegion4: 0,
                    expectedCasesRuralAreaRegion4: 0,
                    expectedCasesRegion5: 0,
                    expectedCasesUrbanAreaRegion5: 0,
                    expectedCasesRuralAreaRegion5: 0,
                    expectedCasesRegion6: 0,
                    expectedCasesUrbanAreaRegion6: 0,
                    expectedCasesRuralAreaRegion6: 0,
                    expectedCasesRegion7: 0,
                    expectedCasesUrbanAreaRegion7: 0,
                    expectedCasesRuralAreaRegion7: 0,
                    expectedCasesRegion8: 0,
                    expectedCasesUrbanAreaRegion8: 0,
                    expectedCasesRuralAreaRegion8: 0,
                    expectedCasesRegion9: 0,
                    expectedCasesUrbanAreaRegion9: 0,
                    expectedCasesRuralAreaRegion9: 0,
                    expectedCasesRegion10: 0,
                    expectedCasesUrbanAreaRegion10: 0,
                    expectedCasesRuralAreaRegion10: 0,
                    expectedCasesRegion11: 0,
                    expectedCasesUrbanAreaRegion11: 0,
                    expectedCasesRuralAreaRegion11: 0,
                    expectedCasesRegion12: 0,
                    expectedCasesUrbanAreaRegion12: 0,
                    expectedCasesRuralAreaRegion12: 0,
                    expectedCasesRegion13: 0,
                    expectedCasesUrbanAreaRegion13: 0,
                    expectedCasesRuralAreaRegion13: 0,
                    expectedCasesRegion14: 0,
                    expectedCasesUrbanAreaRegion14: 0,
                    expectedCasesRuralAreaRegion14: 0,
                    expectedCasesRegion15: 0,
                    expectedCasesUrbanAreaRegion15: 0,
                    expectedCasesRuralAreaRegion15: 0,
                    expectedCasesRegion16: 0,
                    expectedCasesUrbanAreaRegion16: 0,
                    expectedCasesRuralAreaRegion16: 0
                },
                studyDeleted: {
                    id: "",
                    code: "",
                    name: "",
                    surveyID: "",
                    status: "",
                    CorreoVarName:"",
                    DireccionVarName:"",
                    TelefonoVarName:"",
                    RegionVarName: "",
                    ComunaVarName: "",
                    UMPVarName: "",
                    expectedCases: "",
                    startDate: "",
                    expectedCasesRegion1: "",
                    expectedCasesUrbanAreaRegion1: "",
                    expectedCasesRuralAreaRegion1: "",
                    expectedCasesRegion2: "",
                    expectedCasesUrbanAreaRegion2: "",
                    expectedCasesRuralAreaRegion2: "",
                    expectedCasesRegion3: "",
                    expectedCasesUrbanAreaRegion3: "",
                    expectedCasesRuralAreaRegion3: "",
                    expectedCasesRegion4: "",
                    expectedCasesUrbanAreaRegion4: "",
                    expectedCasesRuralAreaRegion4: "",
                    expectedCasesRegion5: "",
                    expectedCasesUrbanAreaRegion5: "",
                    expectedCasesRuralAreaRegion5: "",
                    expectedCasesRegion6: "",
                    expectedCasesUrbanAreaRegion6: "",
                    expectedCasesRuralAreaRegion6: "",
                    expectedCasesRegion7: "",
                    expectedCasesUrbanAreaRegion7: "",
                    expectedCasesRuralAreaRegion7: "",
                    expectedCasesRegion8: "",
                    expectedCasesUrbanAreaRegion8: "",
                    expectedCasesRuralAreaRegion8: "",
                    expectedCasesRegion9: "",
                    expectedCasesUrbanAreaRegion9: "",
                    expectedCasesRuralAreaRegion9: "",
                    expectedCasesRegion10: "",
                    expectedCasesUrbanAreaRegion10: "",
                    expectedCasesRuralAreaRegion10: "",
                    expectedCasesRegion11: "",
                    expectedCasesUrbanAreaRegion11: "",
                    expectedCasesRuralAreaRegion11: "",
                    expectedCasesRegion12: "",
                    expectedCasesUrbanAreaRegion12: "",
                    expectedCasesRuralAreaRegion12: "",
                    expectedCasesRegion13: "",
                    expectedCasesUrbanAreaRegion13: "",
                    expectedCasesRuralAreaRegion13: "",
                    expectedCasesRegion14: "",
                    expectedCasesUrbanAreaRegion14: "",
                    expectedCasesRuralAreaRegion14: "",
                    expectedCasesRegion15: "",
                    expectedCasesUrbanAreaRegion15: "",
                    expectedCasesRuralAreaRegion15: "",
                    expectedCasesRegion16: "",
                    expectedCasesUrbanAreaRegion16: "",
                    expectedCasesRuralAreaRegion16: "",
                },
            };
        },
        methods: {
            resetStudy() {
                this.createdStudy = {
                    code: "",
                    name: "",
                    surveyID: "",
                    status: false,
                    CorreoVarName:"",
                    DireccionVarName:"",
                    TelefonoVarName:"",
                    RegionVarName: "",
                    ComunaVarName: "",
                    UMPVarName: "",
                    expectedCases: 0,
                    startDate: "",
                    expectedCasesRegion1: 0,
                    expectedCasesUrbanAreaRegion1: 0,
                    expectedCasesRuralAreaRegion1: 0,
                    expectedCasesRegion2: 0,
                    expectedCasesUrbanAreaRegion2: 0,
                    expectedCasesRuralAreaRegion2: 0,
                    expectedCasesRegion3: 0,
                    expectedCasesUrbanAreaRegion3: 0,
                    expectedCasesRuralAreaRegion3: 0,
                    expectedCasesRegion4: 0,
                    expectedCasesUrbanAreaRegion4: 0,
                    expectedCasesRuralAreaRegion4: 0,
                    expectedCasesRegion5: 0,
                    expectedCasesUrbanAreaRegion5: 0,
                    expectedCasesRuralAreaRegion5: 0,
                    expectedCasesRegion6: 0,
                    expectedCasesUrbanAreaRegion6: 0,
                    expectedCasesRuralAreaRegion6: 0,
                    expectedCasesRegion7: 0,
                    expectedCasesUrbanAreaRegion7: 0,
                    expectedCasesRuralAreaRegion7: 0,
                    expectedCasesRegion8: 0,
                    expectedCasesUrbanAreaRegion8: 0,
                    expectedCasesRuralAreaRegion8: 0,
                    expectedCasesRegion9: 0,
                    expectedCasesUrbanAreaRegion9: 0,
                    expectedCasesRuralAreaRegion9: 0,
                    expectedCasesRegion10: 0,
                    expectedCasesUrbanAreaRegion10: 0,
                    expectedCasesRuralAreaRegion10: 0,
                    expectedCasesRegion11: 0,
                    expectedCasesUrbanAreaRegion11: 0,
                    expectedCasesRuralAreaRegion11: 0,
                    expectedCasesRegion12: 0,
                    expectedCasesUrbanAreaRegion12: 0,
                    expectedCasesRuralAreaRegion12: 0,
                    expectedCasesRegion13: 0,
                    expectedCasesUrbanAreaRegion13: 0,
                    expectedCasesRuralAreaRegion13: 0,
                    expectedCasesRegion14: 0,
                    expectedCasesUrbanAreaRegion14: 0,
                    expectedCasesRuralAreaRegion14: 0,
                    expectedCasesRegion15: 0,
                    expectedCasesUrbanAreaRegion15: 0,
                    expectedCasesRuralAreaRegion15: 0,
                    expectedCasesRegion16: 0,
                    expectedCasesUrbanAreaRegion16: 0,
                    expectedCasesRuralAreaRegion16: 0
                };
            },
            openUpdateStudyModal(item) {
                this.nextStudyUpdateModal = true
                this.showStudyUpdateModal = true
                this.editedStudy = { ...item }
                if (item.status === "Activo") {
                    this.editedStudy.status = true;
                } else {
                    this.editedStudy.status = false;
                }
            },
            openCreateStudyModal() {
                this.resetStudy();
                this.nextStudyCreateModal = true;
                this.showStudyCreateModal = true;
            },
            closeUpdateStudyModal() {
                this.showStudyUpdateModal = false;
            },
            closeCreateStudyModal() {
                this.showStudyCreateModal = false;
            },
            closeDeleteStudyalert() {
                this.showStudyDeleteAlert = false;
            },
            openDeleteStudyAlert(item) {
                this.studyDeleted = { ...item };
                this.showStudyDeleteAlert = true;
            },
            getDataStudies() {
                GlobalService.getData("/study/list-studies")
                    .then((response) => {
                        console.log(response.studies)
                        this.rows = response.studies.map((study) => (                     
                        {
                            id: study.id,
                            surveyID: study.surveyID,
                            code: study.code,
                            name: study.name,
                            startDate:study.startDate,
                            expectedCases: study.expectedCases,
                            CorreoVarName:study.CorreoVarName,
                            DireccionVarName: study.DireccionVarName,
                            TelefonoVarName: study.TelefonoVarName,
                            RegionVarName: study.RegionVarName,
                            ComunaVarName: study.ComunaVarName,
                            UMPVarName: study.UMPVarName,
                            expectedCasesRegion1: study.expectedCasesRegion1,
                            expectedCasesUrbanAreaRegion1: study.expectedCasesUrbanAreaRegion1,
                            expectedCasesRuralAreaRegion1: study.expectedCasesRuralAreaRegion1,
                            expectedCasesRegion2: study.expectedCasesRegion2,
                            expectedCasesUrbanAreaRegion2: study.expectedCasesUrbanAreaRegion2,
                            expectedCasesRuralAreaRegion2: study.expectedCasesRuralAreaRegion2,
                            expectedCasesRegion3: study.expectedCasesRegion3,
                            expectedCasesUrbanAreaRegion3: study.expectedCasesUrbanAreaRegion3,
                            expectedCasesRuralAreaRegion3: study.expectedCasesRuralAreaRegion3,
                            expectedCasesRegion4: study.expectedCasesRegion4,
                            expectedCasesUrbanAreaRegion4: study.expectedCasesUrbanAreaRegion4,
                            expectedCasesRuralAreaRegion4: study.expectedCasesRuralAreaRegion4,
                            expectedCasesRegion5: study.expectedCasesRegion5,
                            expectedCasesUrbanAreaRegion5: study.expectedCasesUrbanAreaRegion5,
                            expectedCasesRuralAreaRegion5: study.expectedCasesRuralAreaRegion5,
                            expectedCasesRegion6: study.expectedCasesRegion6,
                            expectedCasesUrbanAreaRegion6: study.expectedCasesUrbanAreaRegion6,
                            expectedCasesRuralAreaRegion6: study.expectedCasesRuralAreaRegion6,
                            expectedCasesRegion7: study.expectedCasesRegion7,
                            expectedCasesUrbanAreaRegion7: study.expectedCasesUrbanAreaRegion7,
                            expectedCasesRuralAreaRegion7: study.expectedCasesRuralAreaRegion7,
                            expectedCasesRegion8: study.expectedCasesRegion8,
                            expectedCasesUrbanAreaRegion8: study.expectedCasesUrbanAreaRegion8,
                            expectedCasesRuralAreaRegion8: study.expectedCasesRuralAreaRegion8,
                            expectedCasesRegion9: study.expectedCasesRegion9,
                            expectedCasesUrbanAreaRegion9: study.expectedCasesUrbanAreaRegion9,
                            expectedCasesRuralAreaRegion9: study.expectedCasesRuralAreaRegion9,
                            expectedCasesRegion10: study.expectedCasesRegion10,
                            expectedCasesUrbanAreaRegion10: study.expectedCasesUrbanAreaRegion10,
                            expectedCasesRuralAreaRegion10: study.expectedCasesRuralAreaRegion10,
                            expectedCasesRegion11: study.expectedCasesRegion11,
                            expectedCasesUrbanAreaRegion11: study.expectedCasesUrbanAreaRegion11,
                            expectedCasesRuralAreaRegion11: study.expectedCasesRuralAreaRegion11,
                            expectedCasesRegion12: study.expectedCasesRegion12,
                            expectedCasesUrbanAreaRegion12: study.expectedCasesUrbanAreaRegion12,
                            expectedCasesRuralAreaRegion12: study.expectedCasesRuralAreaRegion12,
                            expectedCasesRegion13: study.expectedCasesRegion13,
                            expectedCasesUrbanAreaRegion13: study.expectedCasesUrbanAreaRegion13,
                            expectedCasesRuralAreaRegion13: study.expectedCasesRuralAreaRegion13,
                            expectedCasesRegion14: study.expectedCasesRegion14,
                            expectedCasesUrbanAreaRegion14: study.expectedCasesUrbanAreaRegion14,
                            expectedCasesRuralAreaRegion14: study.expectedCasesRuralAreaRegion14,
                            expectedCasesRegion15: study.expectedCasesRegion15,
                            expectedCasesUrbanAreaRegion15: study.expectedCasesUrbanAreaRegion15,
                            expectedCasesRuralAreaRegion15: study.expectedCasesRuralAreaRegion15,
                            expectedCasesRegion16: study.expectedCasesRegion16,
                            expectedCasesUrbanAreaRegion16: study.expectedCasesUrbanAreaRegion16,
                            expectedCasesRuralAreaRegion16: study.expectedCasesRuralAreaRegion16,
                            status: study.status ? "Activo" : "Inactivo",
                        }));
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            },
            createStudy(createdStudy) {
                GlobalService.createData("/study/create-study", createdStudy)
                    .then((response) => {
                        this.toast.success(response.data.msg);
                        this.rows = response.data.studies.map((study) => ({
                            id: study.id,
                            surveyID: study.surveyID,
                            code: study.code,
                            name: study.name,
                            startDate:study.startDate,
                            expectedCases: study.expectedCases,
                            CorreoVarName: study.CorreoVarName,
                            DireccionVarName: study.DireccionVarName,
                            TelefonoVarName: study.TelefonoVarName,
                            RegionVarName: study.RegionVarName,
                            ComunaVarName: study.ComunaVarName,
                            UMPVarName: study.UMPVarName,
                            expectedCasesRegion1: study.expectedCasesRegion1,
                            expectedCasesUrbanAreaRegion1: study.expectedCasesUrbanAreaRegion1,
                            expectedCasesRuralAreaRegion1: study.expectedCasesRuralAreaRegion1,
                            expectedCasesRegion2: study.expectedCasesRegion2,
                            expectedCasesUrbanAreaRegion2: study.expectedCasesUrbanAreaRegion2,
                            expectedCasesRuralAreaRegion2: study.expectedCasesRuralAreaRegion2,
                            expectedCasesRegion3: study.expectedCasesRegion3,
                            expectedCasesUrbanAreaRegion3: study.expectedCasesUrbanAreaRegion3,
                            expectedCasesRuralAreaRegion3: study.expectedCasesRuralAreaRegion3,
                            expectedCasesRegion4: study.expectedCasesRegion4,
                            expectedCasesUrbanAreaRegion4: study.expectedCasesUrbanAreaRegion4,
                            expectedCasesRuralAreaRegion4: study.expectedCasesRuralAreaRegion4,
                            expectedCasesRegion5: study.expectedCasesRegion5,
                            expectedCasesUrbanAreaRegion5: study.expectedCasesUrbanAreaRegion5,
                            expectedCasesRuralAreaRegion5: study.expectedCasesRuralAreaRegion5,
                            expectedCasesRegion6: study.expectedCasesRegion6,
                            expectedCasesUrbanAreaRegion6: study.expectedCasesUrbanAreaRegion6,
                            expectedCasesRuralAreaRegion6: study.expectedCasesRuralAreaRegion6,
                            expectedCasesRegion7: study.expectedCasesRegion7,
                            expectedCasesUrbanAreaRegion7: study.expectedCasesUrbanAreaRegion7,
                            expectedCasesRuralAreaRegion7: study.expectedCasesRuralAreaRegion7,
                            expectedCasesRegion8: study.expectedCasesRegion8,
                            expectedCasesUrbanAreaRegion8: study.expectedCasesUrbanAreaRegion8,
                            expectedCasesRuralAreaRegion8: study.expectedCasesRuralAreaRegion8,
                            expectedCasesRegion9: study.expectedCasesRegion9,
                            expectedCasesUrbanAreaRegion9: study.expectedCasesUrbanAreaRegion9,
                            expectedCasesRuralAreaRegion9: study.expectedCasesRuralAreaRegion9,
                            expectedCasesRegion10: study.expectedCasesRegion10,
                            expectedCasesUrbanAreaRegion10: study.expectedCasesUrbanAreaRegion10,
                            expectedCasesRuralAreaRegion10: study.expectedCasesRuralAreaRegion10,
                            expectedCasesRegion11: study.expectedCasesRegion11,
                            expectedCasesUrbanAreaRegion11: study.expectedCasesUrbanAreaRegion11,
                            expectedCasesRuralAreaRegion11: study.expectedCasesRuralAreaRegion11,
                            expectedCasesRegion12: study.expectedCasesRegion12,
                            expectedCasesUrbanAreaRegion12: study.expectedCasesUrbanAreaRegion12,
                            expectedCasesRuralAreaRegion12: study.expectedCasesRuralAreaRegion12,
                            expectedCasesRegion13: study.expectedCasesRegion13,
                            expectedCasesUrbanAreaRegion13: study.expectedCasesUrbanAreaRegion13,
                            expectedCasesRuralAreaRegion13: study.expectedCasesRuralAreaRegion13,
                            expectedCasesRegion14: study.expectedCasesRegion14,
                            expectedCasesUrbanAreaRegion14: study.expectedCasesUrbanAreaRegion14,
                            expectedCasesRuralAreaRegion14: study.expectedCasesRuralAreaRegion14,
                            expectedCasesRegion15: study.expectedCasesRegion15,
                            expectedCasesUrbanAreaRegion15: study.expectedCasesUrbanAreaRegion15,
                            expectedCasesRuralAreaRegion15: study.expectedCasesRuralAreaRegion15,
                            expectedCasesRegion16: study.expectedCasesRegion16,
                            expectedCasesUrbanAreaRegion16: study.expectedCasesUrbanAreaRegion16,
                            expectedCasesRuralAreaRegion16: study.expectedCasesRuralAreaRegion16,
                            status: study.status ? "Activo" : "Inactivo",
                        }));
                        this.closeCreateStudyModal();
                        this.resetStudy();
                    })
                    .catch((e) => {
                        let errors = e.response.data.errors;
                        let error = e.response.data.error;
                        console.log(errors);
                        if (errors) {
                            errors.forEach((error_element) => {
                                this.toast.error(error_element.msg);
                            });
                        } else {
                            this.toast.error(error);
                        }
                    });
            },
            updateStudy(studyId, editedStudy) {
                GlobalService.setData("/study/update-study", studyId, editedStudy)
                    .then((response) => {
                        this.toast.success(response.msg);
                        this.rows = response.studies.map((study) => ({
                            id: study.id,
                            surveyID: study.surveyID,
                            code: study.code,
                            name: study.name,
                            startDate:study.startDate,
                            expectedCases: study.expectedCases,
                            CorreoVarName: study.CorreoVarName,
                            DireccionVarName: study.DireccionVarName,
                            TelefonoVarName: study.TelefonoVarName,
                            RegionVarName: study.RegionVarName,
                            ComunaVarName: study.ComunaVarName,
                            UMPVarName: study.UMPVarName,
                            expectedCasesRegion1: study.expectedCasesRegion1,
                            expectedCasesUrbanAreaRegion1: study.expectedCasesUrbanAreaRegion1,
                            expectedCasesRuralAreaRegion1: study.expectedCasesRuralAreaRegion1,
                            expectedCasesRegion2: study.expectedCasesRegion2,
                            expectedCasesUrbanAreaRegion2: study.expectedCasesUrbanAreaRegion2,
                            expectedCasesRuralAreaRegion2: study.expectedCasesRuralAreaRegion2,
                            expectedCasesRegion3: study.expectedCasesRegion3,
                            expectedCasesUrbanAreaRegion3: study.expectedCasesUrbanAreaRegion3,
                            expectedCasesRuralAreaRegion3: study.expectedCasesRuralAreaRegion3,
                            expectedCasesRegion4: study.expectedCasesRegion4,
                            expectedCasesUrbanAreaRegion4: study.expectedCasesUrbanAreaRegion4,
                            expectedCasesRuralAreaRegion4: study.expectedCasesRuralAreaRegion4,
                            expectedCasesRegion5: study.expectedCasesRegion5,
                            expectedCasesUrbanAreaRegion5: study.expectedCasesUrbanAreaRegion5,
                            expectedCasesRuralAreaRegion5: study.expectedCasesRuralAreaRegion5,
                            expectedCasesRegion6: study.expectedCasesRegion6,
                            expectedCasesUrbanAreaRegion6: study.expectedCasesUrbanAreaRegion6,
                            expectedCasesRuralAreaRegion6: study.expectedCasesRuralAreaRegion6,
                            expectedCasesRegion7: study.expectedCasesRegion7,
                            expectedCasesUrbanAreaRegion7: study.expectedCasesUrbanAreaRegion7,
                            expectedCasesRuralAreaRegion7: study.expectedCasesRuralAreaRegion7,
                            expectedCasesRegion8: study.expectedCasesRegion8,
                            expectedCasesUrbanAreaRegion8: study.expectedCasesUrbanAreaRegion8,
                            expectedCasesRuralAreaRegion8: study.expectedCasesRuralAreaRegion8,
                            expectedCasesRegion9: study.expectedCasesRegion9,
                            expectedCasesUrbanAreaRegion9: study.expectedCasesUrbanAreaRegion9,
                            expectedCasesRuralAreaRegion9: study.expectedCasesRuralAreaRegion9,
                            expectedCasesRegion10: study.expectedCasesRegion10,
                            expectedCasesUrbanAreaRegion10: study.expectedCasesUrbanAreaRegion10,
                            expectedCasesRuralAreaRegion10: study.expectedCasesRuralAreaRegion10,
                            expectedCasesRegion11: study.expectedCasesRegion11,
                            expectedCasesUrbanAreaRegion11: study.expectedCasesUrbanAreaRegion11,
                            expectedCasesRuralAreaRegion11: study.expectedCasesRuralAreaRegion11,
                            expectedCasesRegion12: study.expectedCasesRegion12,
                            expectedCasesUrbanAreaRegion12: study.expectedCasesUrbanAreaRegion12,
                            expectedCasesRuralAreaRegion12: study.expectedCasesRuralAreaRegion12,
                            expectedCasesRegion13: study.expectedCasesRegion13,
                            expectedCasesUrbanAreaRegion13: study.expectedCasesUrbanAreaRegion13,
                            expectedCasesRuralAreaRegion13: study.expectedCasesRuralAreaRegion13,
                            expectedCasesRegion14: study.expectedCasesRegion14,
                            expectedCasesUrbanAreaRegion14: study.expectedCasesUrbanAreaRegion14,
                            expectedCasesRuralAreaRegion14: study.expectedCasesRuralAreaRegion14,
                            expectedCasesRegion15: study.expectedCasesRegion15,
                            expectedCasesUrbanAreaRegion15: study.expectedCasesUrbanAreaRegion15,
                            expectedCasesRuralAreaRegion15: study.expectedCasesRuralAreaRegion15,
                            expectedCasesRegion16: study.expectedCasesRegion16,
                            expectedCasesUrbanAreaRegion16: study.expectedCasesUrbanAreaRegion16,
                            expectedCasesRuralAreaRegion16: study.expectedCasesRuralAreaRegion16,
                            status: study.status ? "Activo" : "Inactivo",
                        }));
                        this.closeUpdateStudyModal();
                    })
                    .catch((e) => {
                        let errors = e.response.data.errors;
                        let error = e.response.data.error;
                        console.log(errors);
                        if (errors) {
                            errors.forEach((error_element) => {
                                this.toast.error(error_element.msg);
                            });
                        } else {
                            this.toast.error(error);
                        }
                    });
            },
            deleteStudy(studyId) {
                GlobalService.deleteDataById("/study/delete-study", studyId)
                    .then((response) => {
                        this.toast.success(response.msg);
                        this.rows = response.studies.map((study) => ({
                            id: study.id,
                            surveyID: study.surveyID,
                            code: study.code,
                            name: study.name,
                            startDate:study.startDate,
                            expectedCase: study.expectedCases,
                            CorreoVarName: study.CorreoVarName,
                            DireccionVarName: study.DireccionVarName,
                            TelefonoVarName: study.TelefonoVarName,
                            RegionVarName: study.RegionVarName,
                            ComunaVarName: study.ComunaVarName,
                            UMPVarName: study.UMPVarName,
                            expectedCasesRegion1: study.expectedCasesRegion1,
                            expectedCasesUrbanAreaRegion1: study.expectedCasesUrbanAreaRegion1,
                            expectedCasesRuralAreaRegion1: study.expectedCasesRuralAreaRegion1,
                            expectedCasesRegion2: study.expectedCasesRegion2,
                            expectedCasesUrbanAreaRegion2: study.expectedCasesUrbanAreaRegion2,
                            expectedCasesRuralAreaRegion2: study.expectedCasesRuralAreaRegion2,
                            expectedCasesRegion3: study.expectedCasesRegion3,
                            expectedCasesUrbanAreaRegion3: study.expectedCasesUrbanAreaRegion3,
                            expectedCasesRuralAreaRegion3: study.expectedCasesRuralAreaRegion3,
                            expectedCasesRegion4: study.expectedCasesRegion4,
                            expectedCasesUrbanAreaRegion4: study.expectedCasesUrbanAreaRegion4,
                            expectedCasesRuralAreaRegion4: study.expectedCasesRuralAreaRegion4,
                            expectedCasesRegion5: study.expectedCasesRegion5,
                            expectedCasesUrbanAreaRegion5: study.expectedCasesUrbanAreaRegion5,
                            expectedCasesRuralAreaRegion5: study.expectedCasesRuralAreaRegion5,
                            expectedCasesRegion6: study.expectedCasesRegion6,
                            expectedCasesUrbanAreaRegion6: study.expectedCasesUrbanAreaRegion6,
                            expectedCasesRuralAreaRegion6: study.expectedCasesRuralAreaRegion6,
                            expectedCasesRegion7: study.expectedCasesRegion7,
                            expectedCasesUrbanAreaRegion7: study.expectedCasesUrbanAreaRegion7,
                            expectedCasesRuralAreaRegion7: study.expectedCasesRuralAreaRegion7,
                            expectedCasesRegion8: study.expectedCasesRegion8,
                            expectedCasesUrbanAreaRegion8: study.expectedCasesUrbanAreaRegion8,
                            expectedCasesRuralAreaRegion8: study.expectedCasesRuralAreaRegion8,
                            expectedCasesRegion9: study.expectedCasesRegion9,
                            expectedCasesUrbanAreaRegion9: study.expectedCasesUrbanAreaRegion9,
                            expectedCasesRuralAreaRegion9: study.expectedCasesRuralAreaRegion9,
                            expectedCasesRegion10: study.expectedCasesRegion10,
                            expectedCasesUrbanAreaRegion10: study.expectedCasesUrbanAreaRegion10,
                            expectedCasesRuralAreaRegion10: study.expectedCasesRuralAreaRegion10,
                            expectedCasesRegion11: study.expectedCasesRegion11,
                            expectedCasesUrbanAreaRegion11: study.expectedCasesUrbanAreaRegion11,
                            expectedCasesRuralAreaRegion11: study.expectedCasesRuralAreaRegion11,
                            expectedCasesRegion12: study.expectedCasesRegion12,
                            expectedCasesUrbanAreaRegion12: study.expectedCasesUrbanAreaRegion12,
                            expectedCasesRuralAreaRegion12: study.expectedCasesRuralAreaRegion12,
                            expectedCasesRegion13: study.expectedCasesRegion13,
                            expectedCasesUrbanAreaRegion13: study.expectedCasesUrbanAreaRegion13,
                            expectedCasesRuralAreaRegion13: study.expectedCasesRuralAreaRegion13,
                            expectedCasesRegion14: study.expectedCasesRegion14,
                            expectedCasesUrbanAreaRegion14: study.expectedCasesUrbanAreaRegion14,
                            expectedCasesRuralAreaRegion14: study.expectedCasesRuralAreaRegion14,
                            expectedCasesRegion15: study.expectedCasesRegion15,
                            expectedCasesUrbanAreaRegion15: study.expectedCasesUrbanAreaRegion15,
                            expectedCasesRuralAreaRegion15: study.expectedCasesRuralAreaRegion15,
                            expectedCasesRegion16: study.expectedCasesRegion16,
                            expectedCasesUrbanAreaRegion16: study.expectedCasesUrbanAreaRegion16,
                            expectedCasesRuralAreaRegion16: study.expectedCasesRuralAreaRegion16,
                            status: study.status ? "Activo" : "Inactivo",
                        }));
                        this.closeDeleteStudyalert();
                    })
                    .catch((e) => {
                        let errors = e.response.data.errors;
                        let error = e.response.data.error;
                        if (errors) {
                            errors.forEach((error_element) => {
                                this.toast.error(error_element.msg);
                            });
                        } else {
                            this.toast.error(error);
                        }
                    });
            },
            nextCreateModal() {
                this.nextStudyCreateModal = false;
            },
            returnCreateModal() {
                this.nextStudyCreateModal = true;
            },
            nextUpdateModal() {
                this.nextStudyUpdateModal = false;
            },
            returnUpdateModal() {
                this.nextStudyUpdateModal = true;
            },
        },
        mounted() {
            this.getDataStudies();
        },
    };
</script>

<style>
.modal-content {
    padding: 15px;
    height: 800px;
    /* width: 800px; */
    overflow-y: auto;/* Permite el scroll vertical si es necesario */
}
</style>