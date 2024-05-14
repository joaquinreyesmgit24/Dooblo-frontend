<template>
  <div class="text-gray-800 font-inter">
    <Sidebar />
    <main class="w-full md:w-[calc(100%-256px)] md:ml-64 bg-gray-50 min-h-screen transition-all main">
        <Navbar />
        <div class="p-6">
            <router-view></router-view>
        </div>
    </main>
</div>
</template>

<script>
import Sidebar from "../../components/Sidebar.vue";
import Navbar from "../../components/Navbar.vue"
export default {
    components: { Sidebar, Navbar },
};
</script>

<style>
</style>