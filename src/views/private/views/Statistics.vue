<template>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div class="bg-white rounded-md border border-gray-100 p-6 shadow-md shadow-black/5">
            <div class="flex justify-between mb-4">
                <div>
                    <div class="flex items-center mb-1">
                        <div class="text-2xl font-semibold">{{ totalUsers }}</div>
                    </div>
                    <div class="text-sm font-medium text-gray-400">
                        Cantidad de usuarios
                    </div>
                </div>
            </div>
            <div class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
                    <path
                        d="M2 22C2 17.5817 5.58172 14 10 14C14.4183 14 18 17.5817 18 22H16C16 18.6863 13.3137 16 10 16C6.68629 16 4 18.6863 4 22H2ZM10 13C6.685 13 4 10.315 4 7C4 3.685 6.685 1 10 1C13.315 1 16 3.685 16 7C16 10.315 13.315 13 10 13ZM10 11C12.21 11 14 9.21 14 7C14 4.79 12.21 3 10 3C7.79 3 6 4.79 6 7C6 9.21 7.79 11 10 11ZM18.2837 14.7028C21.0644 15.9561 23 18.752 23 22H21C21 19.564 19.5483 17.4671 17.4628 16.5271L18.2837 14.7028ZM17.5962 3.41321C19.5944 4.23703 21 6.20361 21 8.5C21 11.3702 18.8042 13.7252 16 13.9776V11.9646C17.6967 11.7222 19 10.264 19 8.5C19 7.11935 18.2016 5.92603 17.041 5.35635L17.5962 3.41321Z">
                    </path>
                </svg>
            </div>
        </div>
        <div class="bg-white rounded-md border border-gray-100 p-6 shadow-md shadow-black/5">
            <div class="flex justify-between mb-4">
                <div>
                    <div class="flex items-center mb-1">
                        <div class="text-2xl font-semibold">{{ totalStudies }}</div>
                    </div>
                    <div class="text-sm font-medium text-gray-400">
                        Cantidad de estudios
                    </div>
                </div>
            </div>
            <div class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
                    <path
                        d="M13 21V23H11V21H3C2.44772 21 2 20.5523 2 20V6H22V20C22 20.5523 21.5523 21 21 21H13ZM4 19H20V8H4V19ZM13 10H18V12H13V10ZM13 14H18V16H13V14ZM9 10V13H12C12 14.6569 10.6569 16 9 16C7.34315 16 6 14.6569 6 13C6 11.3431 7.34315 10 9 10ZM2 3H22V5H2V3Z">
                    </path>
                </svg>
            </div>
        </div>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div class="bg-white border border-gray-100 shadow-md shadow-black/5 p-6 rounded-md">
            <div class="flex justify-between mb-4 items-start">
                <apexchart type="pie" width="640px" :options="chartOptionsFirst"
                    :series="[activePercentageUsers, inactivePercentageUsers]" />
            </div>
        </div>
        <div class="bg-white border border-gray-100 shadow-md shadow-black/5 p-6 rounded-md">
            <div class="flex justify-between mb-4 items-start">
                <div>
                    <apexchart type="bar" :options="chartOptionsSecond" :series="chartSeries" width="100%"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import GlobalService from "../../../services/GlobalServices";
    import VueApexCharts from "vue3-apexcharts";
    export default {
        name: "home",
        components: {
            apexchart: VueApexCharts,
        },
        data() {
            return {
                chartOptionsFirst: {
                },
                chartOptionsSecond: {
                },
                totalUsers: 0,
                totalStudies:0,
                activePercentageUsers: 0,
                inactivePercentageUsers: 0,
                chartSeries: [],
            };
        },
        methods: {
            getDataUserReport() {
                GlobalService.getData("/auth/user-report")
                    .then((response) => {
                        this.chartOptionsFirst = {
                            labels: ["Usuarios activos", "Usuarios inactivos"],
                            title: {
                                text: "Gráfico circular sobre la cantidad de usuarios activos e inactivos", // Aquí pones el título del gráfico
                                align: "center", // Puedes ajustar la alineación del título
                                margin: 50, // Espaciado alrededor del título
                                offsetY: 0, // Ajusta la posición vertical del título
                                style: {
                                    fontSize: "14px", // Tamaño de fuente del título
                                    fontWeight: "bold", // Peso de fuente del título
                                },
                            },
                            legend: {
                                position: "bottom",
                            },
                            tooltip: {
                                y: {
                                    formatter: function (value) {
                                        return value + "%";
                                    },
                                },
                            },
                        }
                        this.totalUsers = response.totalUsers;
                        this.activePercentageUsers = response.activePercentageUsers;
                        this.inactivePercentageUsers = response.inactivePercentageUsers;
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            },
            getDataStudyReport() {
                GlobalService.getData("/study/study-report")
                    .then((response) => {
                        const data = response;
                        this.totalStudies =data.totalStudies
                        this.chartOptionsSecond = {
                            chart: {
                                type: "bar",
                                height: 500,
                                width:600,
                                toolbar: {
                                    show: false
                                }
                            },
                            title: {
                                text: `Número de estudios que se han realizado en los últimos 5 años`, // Aquí defines el título del gráfico
                                align: "center", // Alineación del título
                                margin: 50, // Espacio alrededor del título
                                style: {
                                    fontSize: "14px", // Tamaño de la fuente
                                    fontWeight: "bold", // Peso de la fuente
                                    color: "#333", // Color del texto
                                },
                            },
                            plotOptions: {
                                bar: {
                                    horizontal: false,
                                    endingShape: "rounded",
                                    distributed: true,
                                },
                            },
                            dataLabels: {
                                enabled: false,
                            },
                            stroke: {
                                show: true,
                                width: 2,
                                colors: ["transparent"],
                            },
                            xaxis: {
                                categories: data.studiesByYear.map((d) => d.year),
                            },
                            yaxis: {
                                title: {
                                    text: "Cantidad de estudios",
                                },
                            },
                            fill: {
                                opacity: 1,
                            },
                            tooltip: {
                                y: {
                                    formatter: function (val) {
                                        return val;
                                    },
                                },
                            },
                            colors: ['#ff7562', '#b2e981', '#3357FF', '#FF33A1', '#FFAA33'],
                        };
                        this.chartSeries = [
                            {
                                name: "Número de estudios",
                                data: data.studiesByYear.map((d) => d.count),
                            },
                        ];
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            },
        },
        mounted() {
            this.getDataUserReport();
            this.getDataStudyReport();
        },
    };
</script>

<style>
</style>