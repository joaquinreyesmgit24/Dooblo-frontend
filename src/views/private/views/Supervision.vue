<template>
    <div class="grid grid-cols-1 gap-12 mb-12">
        <div class="bg-white rounded-md border border-gray-100 p-6 shadow-md shadow-black/5">
            <div class="text-2xl font-semibold mb-4">Supervisión</div>
            
            <form class="w-full max-w-lg ml-0">
                <div class="flex flex-wrap -mx-3 mb-6">
                    <div class="w-full px-3">
                        <label class="block tracking-wide text-gray-700 text-xs font-bold mb-2" for="supervision-percentage">
                            Ingrese Porcentaje a Supervisar:
                        </label>
                        <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="supervision-percentage" type="number" placeholder="Ingrese el porcentaje">
                    </div>
                </div>
                <div class="flex items-center justify-start">
                    <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="submit">
                        Aceptar
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
    import GlobalService from "../../../services/GlobalServices";
    export default {
        name: "supervision",
        components: {
            
        },
        data() {
            return {
                                
            };
        },
        mounted() {

        },
        methods: {
            
        },
    };
</script>

<style>
</style>