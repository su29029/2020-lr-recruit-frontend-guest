<template>
    <div id="message-card">
        <v-card height="150" width="360" class="rounded-pill" v-if="show" transition="scale-transition" origin="center center"> 
            <div style="margin: 5%">
                <h3>{{ message.title }}</h3>
                <v-divider></v-divider>
                {{ message.content }}
                <br>
                <v-btn text style="float: right;right: 10px;" @click="show = false">关闭</v-btn>
            </div>
        
        </v-card>
    </div>
</template>

<script>
export default {
    name: 'MessageCard',
    data: () => ({
        
    }),
    props:{
        show: Boolean,
        message: Object
    },
    created:{

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
            this.$emit('closeMessageCard');
        }
    }
}
</script>

<style>

</style>
