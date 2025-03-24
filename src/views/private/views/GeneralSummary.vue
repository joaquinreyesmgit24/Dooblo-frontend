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
                    <!-- <div class="text-xl font-medium">{{surveyID.length}}</div> -->
                    <div class="text-xl font-medium">{{surveyID.length+this.expiredcanceledSurveyID.length}}</div>
                </div>
            </div>
        </div>
        <div class="bg-white rounded-md border border-gray-100 p-6 shadow-md shadow-black/5">
            <div class="flex justify-between mb-6">
                <div>
                    <div class="text-2xl font-semibold mb-1">Encuestas correctas</div>
                    <!-- <div class="text-xl font-medium">{{(this.surveyID.length-this.expiredcanceledSurveyID.length)}}</div> -->
                    <div class="text-xl font-medium">{{(this.surveyID.length)}}</div>
                </div>
            </div>
        </div>
        <div class="bg-white rounded-md border border-gray-100 p-6 shadow-md shadow-black/5">
            <div class="flex justify-between mb-6">
                <div>
                    <div class="text-2xl font-semibold mb-1">Encuestas expiradas y canceladas</div>
                    <div class="text-xl font-medium">{{this.expiredcanceledSurveyID.length}}</div>
                </div>
            </div>
        </div>
    </div>
    <div class="grid grid-cols-1 gap-6 mb-6">
        <div class="bg-white border border-gray-100 shadow-md shadow-black/5 p-6 rounded-md ">
            <div class="flex flex-col-2 items-center gap-6 justify-center">
                    <apexchart type="pie" width="500px" :options="chartOptionsFirst"
                        :series="[percentageCompletedSurvey, percentageExpiredcanceledSurvey]" />
            </div>
        </div>
    </div>
</template>

<script>
    import VueApexCharts from "vue3-apexcharts";
    export default {
        name: "reportregion",
        components: {
            apexchart: VueApexCharts,
        },
        props: {
            regionCounts: { type: Array, default: [] },
            selectedStudy: { type: Object, default: {} },
            surveyID: { type: Array, default: [] },
            expiredcanceledSurveyID: { type: Array, default: [] },
        },
        data() {
            return {
                chartOptionsFirst: {
                    labels: ["Encuestas correctas", "Encuestas expiradas y canceladas"],
                    title: {
                    text: 'Porcentaje de encuestas correctas y incorrectas', // Aquí pones el título del gráfico
                    align: 'center', // Puedes ajustar la alineación del título
                    margin: 10, // Espaciado alrededor del título
                    offsetY: 0, // Ajusta la posición vertical del título
                    style: {
                        fontSize: '18px', // Tamaño de fuente del título
                        fontWeight: 'bold', // Peso de fuente del título
                        },
                    },
                    legend: {
                            position: 'bottom',
                    },
                    
                },
                /* percentageCompletedSurvey: ((this.surveyID.length-this.expiredcanceledSurveyID.length)/this.surveyID.length)*100,
                percentageExpiredcanceledSurvey:  (this.expiredcanceledSurveyID.length/this.surveyID.length)*100, */

                /* percentageCompletedSurvey: Math.round(((this.surveyID.length - this.expiredcanceledSurveyID.length) / this.surveyID.length) * 100),
                percentageExpiredcanceledSurvey: Math.round((this.expiredcanceledSurveyID.length / this.surveyID.length) * 100), */

                percentageCompletedSurvey: this.surveyID.length ,
                percentageExpiredcanceledSurvey: this.expiredcanceledSurveyID.length,

            };
        }, 
    };
</script>

<style>
</style>