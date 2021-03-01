<template>
    <div id="information-component">
        <v-card outlined class="mx-auto" width="400" height="400" style="opacity: 0.9">
            <v-row justify="center" no-gutters>
                <v-col>
                    <p>欢迎你，{{information.username}}</p>
                    <v-btn>前往主页</v-btn>
                </v-col>
            </v-row>
        </v-card>
    </div>
</template>

<script>
export default {
    name: "Information",
    data: () => ({

    }),
    props:{
        information: Object
    },
    methods:{

    }
}
</script>

<style>

</style>
