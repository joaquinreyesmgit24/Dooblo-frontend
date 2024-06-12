<template>
    <div class="grid grid-cols-1 gap-6 mb-6">
        <div class="bg-white rounded-md border border-gray-100 p-6 shadow-md shadow-black/5">
            <div class="flex justify-between mb-6">
                <div>
                    <div class="text-2xl font-semibold mb-1">Usuarios</div>
                        <VueGoodTable :columns="columns" :rows="rows" :search-options="searchOptions"
                            :pagination-options="paginationOptions" max-height="450px" :fixed-header="true">
                                <template v-slot:table-row="props">
                                    <span v-if="props.column.field == 'acciones'
                                    ">
                                    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalUpdateUser"
                                        @click="openModal(props.row)">
                                        Editar
                                    </button>
                                    </span>
                                    <span v-if="props.column.field == 'role'">
                                    {{ props.row.role.name }}
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
                        label: "Nombre de usuario",
                        field: "username",
                    },
                    {
                        label: "Rol",
                        field: "role",
                    },
                    {
                        label: "Fecha de creación",
                        field: "date",
                        type: "date",
                        dateInputFormat: "dd-MM-yyyy HH:mm:ss",
                        dateOutputFormat: "dd-MM-yyyy",
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
            };
        },
        mounted() {
            this.getDataUsers();
        },
        methods: {
            getDataUsers() {
                GlobalService.getData("/auth/listar-usuarios")
                    .then((response) => {
                        console.log(response.users);
                        this.rows = response.users.map((user) => ({
                            id: user.id,
                            username: user.username,
                            role: user.role,
                            date: dayjs(user.createdAt).format("DD-MM-YYYY HH:mm:ss"),
                            status: user.status ? "Activo" : "Inactivo",
                        }));
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            },
        },
    };
</script>

<style>

</style>