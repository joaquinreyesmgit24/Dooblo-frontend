<template>
    <div class="grid grid-cols-1 gap-6 mb-6">
        <div class="bg-white rounded-md border border-gray-100 p-6 shadow-md shadow-black/5">
            <div class="text-2xl font-semibold mb-4">Selecciona un estudio</div>
            <div class="flex flex-auto flex-col items-start justify-start space-y-4">
                <select id="countries"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                    v-model="selectedStudy">
                    <option value="" disabled selected>Seleccione un estudio</option>
                    <option v-for="study in studies" :key="study.id" :value="study">
                        {{ study.name }}
                    </option>
                </select>
                <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" @click="handleButtonClick()">
                    Aceptar
                </button>
            </div>
        </div>
    </div>

    <!-- Modal de cargando -->
    <div v-if="loading" class="fixed z-10 inset-0 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div class="fixed inset-0 transition-opacity" aria-hidden="true">
                <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
                <div>
                    <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
                        <svg class="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div class="mt-3 text-center sm:mt-5">
                        <h3 class="text-lg leading-6 font-medium text-gray-900 sm:mt-6">
                            Obteniendo los datos...
                        </h3>
                        <span class="text-sm text-gray-500">Por favor, no cierre esta ventana hasta que se complete el proceso.</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import GlobalService from "../../../services/GlobalServices";
    export default {
        name: "select-study",
        components: {
            
        },
        data() {
            return {
                selectedStudy: "",
                studies: [],
                loading: false,     
            };
        },        
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
            handleButtonClick() {
                this.loading = true;
                setTimeout(() => {
                    this.loading = false;
                }, 3000);
            }
        },
        mounted() {
            this.getDataStudies();
        },
    };
</script>

<style>
</style>