<template>
    <div class='ribbon-component' style="z-index: 2">
        <a href='#title1'><span>介绍</span></a>
        <a href='#title2'><span>实力展现</span></a>
        <a href='#title3'><span>技术方向</span></a>
        <a href='#title4'><span>工作室资源</span></a>
        <a href='#title5'><span>招新事项</span></a>
    </div>
</template>

<script>
export default {
    name: 'Ribbon',
    data: () => ({

    }),
    created:function(){

    },
    methods:{
        
    }
}
</script>

<style scoped>
body {
    width: 100%;
}

.ribbon-component {
    display:inline-block;
    position: absolute;
    right: -30px;
    top: 30px;
}

.ribbon-component:after, .ribbon-component:before {
    margin-top:0.5em;
    content: "";
    float:left;
    border:1.5em solid rgba(238,238,238,0.9);
}

.ribbon-component:after {
    border-right-color:transparent;
}

.ribbon-component:before {
    border-left-color:transparent;
}

.ribbon-component a:link, .ribbon-component a:visited {
    color:#000066;
    text-decoration:none;
    float:left;
    height:3.5em;
    overflow:hidden;
}

.ribbon-component span {
    font-family: "Comic Sans MS", Arial, sans-serif;
    font-weight: bold;
    letter-spacing: 2px;
    background:rgba(238,238,238,0.9);
    display:inline-block;
    line-height:3em;
    padding:0 1em;
    margin-top:0.5em;
    position:relative;

    -webkit-transition: background-color 0.2s, margin-top 0.2s;  /* Saf3.2+, Chrome */
    -moz-transition: background-color 0.2s, margin-top 0.2s;  /* FF4+ */
    -ms-transition: background-color 0.2s, margin-top 0.2s;  /* IE10 */
    -o-transition: background-color 0.2s, margin-top 0.2s;  /* Opera 10.5+ */
    transition: background-color 0.2s, margin-top 0.2s;
}

.ribbon-component a:hover span {
    background:#b4c8e4;
    margin-top:0;
}

.ribbon-component span:before {
    content: "";
    position:absolute;
    top:3em;
    left:0;
    border-right:0.5em solid #9B8651;
    border-bottom:0.5em solid rgba(238,238,238,0.9);
}

.ribbon-component span:after {
    content: "";
    position:absolute;
    top:3em;
    right:0;
    border-left:0.5em solid #9B8651;
    border-bottom:0.5em solid rgba(238,238,238,0.9);
}
</style>
