<template>
    <div class="py-2 px-6 bg-white flex items-center shadow-md shadow-black/5 sticky top-0 left-0 z-30">
            <button type="button" class="text-lg text-gray-600 sidebar-toggle">
                <i class="ri-menu-line"></i>
            </button>
            <ul class="flex items-center text-sm ml-4">
                <li class="mr-2">
                    <a href="#" class="text-gray-400 hover:text-gray-600 font-medium">Inicio</a>
                </li>
                <li class="text-gray-600 mr-2 font-medium">/</li>
                <li class="text-gray-600 mr-2 font-medium">Campaña</li>
            </ul>
            <ul class="ml-auto flex items-center">
                <li class="dropdown ml-3">
                    <button type="button" class="dropdown-toggle flex items-center">
                        <span class="mr-5  text-[14px] text-gray-600">{{ userName }}</span>
                        <img :src="imgUrl ? imgUrl : `https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1095249842.jpg`" alt="" class="w-8 h-8 rounded-full block object-cover align-middle">
                    </button>
                    <ul class="dropdown-menu shadow-md shadow-black/5 z-30 hidden py-1.5 rounded-md bg-white border border-gray-100 w-full max-w-[140px]">
                        <li>
                            <a href="#" class="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50">Ver perfil</a>
                        </li>
                        <li>
                            <a href="#" class="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50" @click="$emit('logout')">Cerrar sesión</a>
                        </li>
                    </ul>
                </li>
            </ul>
    </div>
</template>

<script>
export default {
    name:"navbar",
    props: {
        userName: { type: String, default: 'invitado' },
        imgUrl:  { type: String,},
    },
}
</script>

<style>

</style>