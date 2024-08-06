<template>
    <div class="relative overflow-x-auto">
        <table class="w-full text-sm border text-left rtl:text-right">
            <thead class="text-white uppercase bg-violet-700">
                <tr>
                    <th scope="col" class="px-6 py-3">
                        Número de la región
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Nombre de la región
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Casos a lograr
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Estado de avance
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Faltantes
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Realizadas el día de hoy
                    </th>
                    <th scope="col" class="px-6 py-3">
                        % de avance
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="regionInfo in regionCounts" :key="regionInfo.number" class="bg-white border-b">
                    <td class="px-6 py-3">
                        {{ regionInfo.number }}
                    </td>
                    <td class="px-6 py-3">
                        {{regionInfo.name}}
                    </td>
                    <td class="px-6 py-3">
                        {{ regionInfo.total_reg }}
                    </td>
                    <td class="px-6 py-3">
                        {{regionInfo.total || 0}}
                    </td>
                    <td class="px-6 py-3">
                        {{ Math.max(regionInfo.total_reg - regionInfo.total, 0) }}
                    </td>
                    <td class="px-6 py-3">
                        {{regionInfo.today}}
                    </td>
                    <td class="px-6 py-3">
                        <div class="relative h-4 bg-neutral-400 rounded-full">
                            <div class="absolute inset-y-0 left-0 flex items-center rounded-full" :class="{
                                                'bg-green-500': regionInfo.total / regionInfo.total_reg >= 1,
                                                'bg-orange-500': regionInfo.total / regionInfo.total_reg >= 0.5 && regionInfo.total / regionInfo.total_reg < 1,
                                                'bg-red-500': regionInfo.total / regionInfo.total_reg < 0.5
                                            }"
                                :style="{ width: `${Math.min((regionInfo.total / regionInfo.total_reg) * 100, 100)}%`}">
                                <span class="text-xs text-white px-2">
                                    {{ Math.min(Math.round((regionInfo.total / regionInfo.total_reg) * 100), 100) }}%
                                </span>
                            </div>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    export default {
        name: "reportregion",
        props: {
            regionCounts: { type: Array, default: [] },
        }
    }
</script>

<style>

</style>