<template>
    <div class="fixed left-0 top-0 w-64 h-full bg-violet-700 p-4 z-50 sidebar-menu transition-transform">
        <a href="#" class="flex items-center pb-4 border-b border-b-gray-800">
            <span class="text-lg font-bold text-white ml-3">Dooblo</span>
        </a>
        <ul class="mt-4">
            <li class="mb-1" v-if="userRol=='Administrador'">
                <router-link to="/select" class="flex items-center py-2 px-4 text-gray-300 hover:bg-violet-950 hover:text-gray-100 rounded-md">
                    <i class="ri-file-check-line mr-3 text-lg"></i>
                    <span class="text-sm">Seleccionar</span>
                </router-link>
            </li>
            <li class="mb-1" v-if="userRol=='Administrador'">
                <router-link to="/" class="flex items-center py-2 px-4 text-gray-300 hover:bg-violet-950 hover:text-gray-100 rounded-md">
                    <i class="ri-bar-chart-2-line mr-3 text-lg"></i>
                    <span class="text-sm">Estadística</span>
                </router-link>
            </li>
            <li class="mb-1" v-if="userRol=='Administrador'">
                <router-link to="/users" class="flex items-center py-2 px-4 text-gray-300 hover:bg-violet-950 hover:text-gray-100 rounded-md">
                    <i class="ri-user-line mr-3 text-lg"></i>
                    <span class="text-sm">Usuarios</span>
                </router-link>
            </li>
            <li class="mb-1" v-if="userRol=='Administrador'">
                <router-link to="/studies" class="flex items-center py-2 px-4 text-gray-300 hover:bg-violet-950 hover:text-gray-100 rounded-md">
                    <i class="ri-file-ppt-2-fill mr-3 text-lg"></i>
                    <span class="text-sm">Estudios</span>
                </router-link>
            </li>
            <li class="mb-1">
                <router-link to="/reports" class="flex items-center py-2 px-4 text-gray-300 hover:bg-violet-950 hover:text-gray-100 rounded-md">
                    <i class="ri-file-chart-line mr-3 text-lg"></i>
                    <span class="text-sm">Reportes</span>
                </router-link>
            </li>
            <li class="mb-1">
                <router-link to="/supervision" class="flex items-center py-2 px-4 text-gray-300 hover:bg-violet-950 hover:text-gray-100 rounded-md">
                    <i class="ri-survey-line mr-3 text-lg"></i>
                    <span class="text-sm">Supervisión</span>
                </router-link>
            </li>
        </ul>
    </div>
    <div class="fixed top-0 left-0 w-full h-full bg-black/50 z-40 md:hidden sidebar-overlay"></div>
</template>

<script>
export default {
    name:"sidebar",
    props: {
        userRol: { type: String, default: 'No posee permisos' },
    },
}
</script>

<style>

</style>