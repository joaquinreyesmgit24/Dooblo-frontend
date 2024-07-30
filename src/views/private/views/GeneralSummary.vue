<template>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div class="bg-white rounded-md border border-gray-100 p-6 shadow-md shadow-black/5">
            <div class="flex justify-between mb-6">
                <div>
                    <div class="text-2xl font-semibold mb-1">Encuestas a lograr</div>
                    <div class="text-xl font-medium">{{ selectedStudy.expectedCases }}</div>
                </div>
            </div>
        </div>
        <div class="bg-white rounded-md border border-gray-100 p-6 shadow-md shadow-black/5">
            <div class="flex justify-between mb-6">
                <div>
                    <div class="text-2xl font-semibold mb-1">Encuestas realizadas</div>
                    <div class="text-xl font-medium">100</div>
                </div>
            </div>
        </div>
        <div class="bg-white rounded-md border border-gray-100 p-6 shadow-md shadow-black/5">
            <div class="flex justify-between mb-6">
                <div>
                    <div class="text-2xl font-semibold mb-1">Encuestas correctas</div>
                    <div class="text-xl font-medium">100</div>
                </div>
            </div>
        </div>
        <div class="bg-white rounded-md border border-gray-100 p-6 shadow-md shadow-black/5">
            <div class="flex justify-between mb-6">
                <div>
                    <div class="text-2xl font-semibold mb-1">Encuestas incorrectas</div>
                    <div class="text-xl font-medium">100</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "reportregion",
        props: {
            regionCounts: { type: Array, default: [] },
            selectedStudy: { type: Object, default: [] },
        }
    }
</script>

<style>

</style>