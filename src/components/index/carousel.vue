<template>
    <div id="carousel-component">
        <v-carousel cycle height="680px" hide-delimiter-background show-arrows-on-hover>
            <v-carousel-item>
                <img src="../../assets/1.jpg" style="min-width: 100%">
            </v-carousel-item>
            <v-carousel-item>
                <img src="../../assets/2.jpg" style="min-width: 100%">
            </v-carousel-item>
            <v-carousel-item>
                <img src="../../assets/3.jpg" style="min-width: 100%">
            </v-carousel-item>
            <v-carousel-item>
                <img src="../../assets/4.jpg" style="min-width: 100%">
            </v-carousel-item>
            <v-carousel-item>
                <img src="../../assets/5.jpg" style="min-width: 100%"> 
            </v-carousel-item>
            <v-carousel-item>
                <img src="../../assets/6.jpg" style="min-width: 100%">
            </v-carousel-item>
            <v-carousel-item>
                <img src="../../assets/7.jpg" style="min-width: 100%">
            </v-carousel-item>
            <v-carousel-item>
                <img src="../../assets/8.jpg" style="min-width: 100%">
            </v-carousel-item>
            <v-carousel-item>
                <img src="../../assets/9.jpg" style="min-width: 100%">
            </v-carousel-item>

        </v-carousel>
    </div>
</template>

<script>
export default {
    name: 'Carousel',
    data: () => ({
        
    }),
    created:function(){
        
    },
    methods:{

    }
}
</script>

<style scoped>
#carousel-component {
    margin-top:550px;
    width:100%; 
    height:700px; 
    position:relative;
    /*border:15px solid white;*/
    margin:0 auto;
}
</style>
