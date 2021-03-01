<template>
    <div id="footer">
        <br>
        <v-footer padless style="position: fixed; bottom: 0; width: 100%">
            <v-col cols="12" class="text-center">
                {{ new Date().getFullYear() }} — <strong>凌睿工作室</strong>
            </v-col>
        </v-footer>
    </div>
</template>

<script>
export default {
    name: 'Footer',
    data: () => ({

    }),
    methods: {

    }
}
</script>

<style>

</style>
