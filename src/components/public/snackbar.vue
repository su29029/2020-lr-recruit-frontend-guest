<template>
    <v-snackbar :value="show" :color="status" :timeout="-1" rounded="pill">
        {{ message }}
        <template v-slot:action="{ attrs }">
            <v-btn
                color="white"
                text
                v-bind="attrs"
                @click="close"
            >
                Close
            </v-btn>
        </template>
    </v-snackbar>
</template>

<script>
export default {
    name: 'snackbar',
    props: {
        show: {
            type: Boolean
        },
        status: {
            type: String
        },
        message: {
            type: String
        }
    },
    watch: {
        show:function(newVal, oldVal) {
            if (newVal == true) setTimeout(this.close, 4000);
        }
    },
    data: () => ({
        
    }),
    methods: {
        close: function(){
            this.show = false;
            this.$emit('closeSnackBar');
        }
    }
}
</script>

<style>

</style>
