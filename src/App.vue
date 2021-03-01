<template>
  <v-app>
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'App',

  data: () => ({
    screenWidth: document.body.clientWidth
  }),
  created:function(){
    let that = this;
    if (that.screenWidth <= 580){
      that.$store.state.navigator.miniScreen = true;
      that.$store.state.navigator.smallScreen = true;
      that.$store.state.navigator.isShow = false;
    } else if (that.screenWidth <= 1000) {
      that.$store.state.navigator.miniScreen = false;
      that.$store.state.navigator.smallScreen = true;
      that.$store.state.navigator.isShow = false;
    } else {
      that.$store.state.navigator.miniScreen = false;
      that.$store.state.navigator.smallScreen = false;
      that.$store.state.navigator.isShow = true;
    }
  },
  mounted () {
    const that = this;
    window.onresize = () => {
      return (() => {
        window.screenWidth = document.body.clientWidth
        that.screenWidth = window.screenWidth
      })()
    }
  },
  watch: {
    screenWidth:function(newVal, oldVal){
      let that = this;
      if (newVal <= 580) {
        if (oldVal > 580) {
          that.$store.state.navigator.isShow = false;
          that.$store.state.navigator.smallScreen = true;
          that.$store.state.navigator.miniScreen = true;
        }
      } else if (newVal <= 1000) {
        that.$store.state.navigator.miniScreen = false;
        if (oldVal > 1000) {
          that.$store.state.navigator.isShow = false;
          that.$store.state.navigator.smallScreen = true;
        }  
      } else {
        that.$store.state.navigator.isShow = true;
        that.$store.state.navigator.smallScreen = false;
      }
    }
  },
};
</script>

<style>
html {
  width: 100%;
  overflow-x: hidden;
}

</style>
