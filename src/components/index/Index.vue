<template>
    <div id="index">
        <v-row no-gutters>
            <v-col cols="12">
                <img src="../../assets/logo.png" id="background" style="z-index: 1;max-width: 100%; height: 80px; width: 80px">
                <p id="title">凌睿工作室</p>
                <Ribbon v-if="$store.state.navigator.isShow && !$store.state.navigator.smallScreen"></Ribbon> <!-- 保留 导航栏 -->
                <Carousel></Carousel> <!-- 保留 轮播图 -->
            
                <!-- 轮播图上的标题 登录注册组件 -->
                <div id="screen">
                    <div v-if="isShowMain">
                        <p id="title-word-1-big-screen" v-if="!$store.state.navigator.smallScreen">凌睿工作室招新平台</p>
                        <p id="title-word-1-small-screen" v-if="$store.state.navigator.smallScreen">凌睿工作室招新平台</p>
                        <p id="title-word-2-big-screen" v-if="!$store.state.navigator.smallScreen">Welcome to Ling Rui Studio</p>
                        <p id="title-word-2-small-screen" v-if="$store.state.navigator.smallScreen">Welcome to Ling Rui Studio</p>
                        <input type="button" name="login" id="login" value="登录 Login" @click="isShowMain = false; isShowLogin = true; isShowRegister = false" v-if="!isShowInformation">
                        <br>
                        <input type="button" name="register" id="register" value="注册 Register" @click="isShowMain = false; isShowLogin = false; isShowRegister = true" v-if="!isShowInformation">
                    </div>
                </div>
            </v-col>
            <Login v-on:showSnackBar="showSnackBar" v-if="isShowLogin" :isLogin="isLogin" style="position:absolute; margin: 0 auto;left: 0; right: 0; top: 150px;"></Login>
            <Register v-on:showSnackBar="showSnackBar" v-if="isShowRegister" style="position:absolute; margin: 0 auto;left: 0; right: 0; top: 150px;"></Register>
        </v-row>
        <v-row justify="center">
            <v-col cols="9">
                <!-- 工作室介绍开始 -->
                <div class="content">
                    <div>
                        <p class="content-title" id="title1">工作室介绍</p>
                        <div class="link"></div>
                    </div>
                    <div class="word">
                        <p>凌睿工作室始于2013 年，由傅翀老师，钱伟中老师，李巧勤老师及学长杨文元、暴鹏飞等一行人联合创建，是信软学院规模最大的工作室，也是学院最老的一批工作室之一。成立七年以来，凌睿始终秉承<strong>“凌厉出鞘，睿意进取”</strong>的宗旨，兼顾“安全”这一特色。现如今凌睿工作室已有web开发、机器学习、安卓开发、网络安全等多个方向供工作室成员选择并为其发展助力。工作室也同几位优秀的指导老师有着密切合作，工作室成员也经常参与到各种项目中，在实践中学习，在实践中成长，为工作室成员的读研，读博，工作等打下了坚实的基础。</p>
                    </div>
                    <br>
                    <div>
                        <p class="content-title" id="title2">实力展现</p>
                        <div class="link"></div>
                    </div>
                    <div class="word">
                        <p>不论是个人获奖情况、工作室承接项目还是工作室外包项目，都非常多，难以一一列举。个人获奖有美国大学生数学建模大赛 M奖、2017四川省大学生程序设计竞赛金牌、华为杯智能设计大赛一等奖，专项奖、美国国际大学生数学建模竞赛荣誉奖等；工作室承接项目有基于同态加密的多关键词跨语言加密检索、基于空间众包的隐私保护机制、基于消息传递预防屏蔽的代理服务器（傅翀老师指导）等；工作室外包项目有特种芯片上位机开发、加密通讯协议设计、数据挖掘舆论管控（刘岗博士提出，钱伟忠、傅翀、李巧勤老师指导）等。</p>
                        <p>毕业学长学姐的走向也非常好，凌睿工作室毕业学长学姐累计超15人被清华北大录取（在创新工坊中位列第一），超40人被C9类高校录取，每年均有超15人进入阿里、腾讯、字节跳动、华为等公司就业。</p>
                        <p style="font-size: 24px;"><strong>竞赛成果</strong></p>
                        <img src="../../assets/7.png" style="width: 100%;">
                        <p style="font-size: 24px;"><strong>内部项目</strong></p>
                        <img src="../../assets/8.png" style="width: 100%;">
                        <p style="font-size: 24px;"><strong>承接项目</strong></p>
                        <img src="../../assets/9.png" style="width: 100%;">           
                    </div>
                    <br>
                    <div>
                        <p class="content-title" id="title3">技术方向</p>
                        <div class="link"></div>
                    </div>
                    <div class="word">
                        <p>经过多年的不断发展，凌睿工作室目前主要有网络安全、机器学习、Web开发、安卓开发、UI五大方向，工作室会对成员们进行分方向培养。凌睿是一个看重个人发展的大家庭，不管你做如何选择，我们希望的是大家共同进步！</p>
                    </div>
                    <br>
                    <div>
                        <p class="content-title" id="title4">工作室资源</p>
                        <div class="link"></div>
                    </div>
                    <div class="word">
                        <p>在凌睿，我们有技术书籍、学习路线文档、学习资料等干货等你获取，保研经验分析、大厂内推资讯、出国交流分享、就业指导、竞赛信息、科研项目等内部资源这里应有尽有。</p>
                    </div>
                    <div>
                        <p class="content-title" id="title5">招新事项</p>
                        <div class="link"></div>
                    </div>
                    <div class="word">
                        <p>我们衷心欢迎同学们的加入，无论你是零基础⼩⽩萌新抑或是浸淫计算机领域多年的大佬，只要通过自身的努力与坚持加入了凌睿大家庭，都能在工作室里找到合适你的发展道路。你是萌新小白？没关系，工作室对小白十分友好，只要肯学习，能坚持，都能最终加入我们，还有学⻓学姐⼿把⼿带你打怪升级哟；你是大佬？工作室也有各类项目和竞赛期待着你的加入,助你更上一层楼。选择一个自己感兴趣的技术方向，在两轮考核中努力并坚持下去，就能加入凌睿大家族啦！</p>
                    </div>
                </div>
            </v-col>
        </v-row>
            <!-- 页脚 -->
        <v-footer color="primary lighten-1" padless>
            <v-row justify="center" no-gutters style="width: 100%">
                <v-btn
                    v-for="(link, i) in links"
                    :key="i"
                    color="white"
                    text
                    rounded
                    class="my-2"
                    :href="link.href"
                >
                    {{ link.content }}
                </v-btn>
                <v-col
                    class="primary lighten-2 py-4 text-center white--text"
                    cols="12"
                >
                    {{ new Date().getFullYear() }} — <strong>凌睿工作室</strong>
                </v-col>
            </v-row>
        </v-footer>
        <SnackBar v-on:closeSnackBar="closeSnackBar" :show="show" :status="status" :message="message"></SnackBar>
    </div>
</template>

<script>
import Ribbon from './ribbon'
import Carousel from './carousel'
import Login from './login'
import Register from './register'
import SnackBar from '../public/snackbar'
export default {
    name: 'Index',
    data: () => {
        return {
            isShowMain: true,
            isShowLogin: false,
            isShowRegister: false,
            isShowInformation: false,
            links: [
                { content:'工作室介绍', href: '#title1' },
                { content:'实力展现', href: '#title2' },
                { content:'技术方向', href: '#title3' },
                { content:'工作室资源', href: '#title4' },
                { content:'招新事项', href: '#title5' },
                { content:'回顶部', href: '#' }
            ],
            isLogin: false,
            show: false,
            status: '',
            message: ''
        
        }
    },
    components:{
        Ribbon,
        Carousel,
        Login,
        Register,
        SnackBar
    },
    created:function(){
        let that = this;
        if (that.$store.state.login){
            that.isShowMain = false;
            that.isLogin = true;
        } else {
            that.$request.get('/api/guest/islogin').then( ret => {
                if (ret.data.msg === "pass") {
                    that.isShowInformation = true;
                    that.isShowLogin = true;
                    that.isLogin = true;
                    that.$store.state.user = ret.data.user;
                }
            }).catch( err => {
                
            });
        }
    },
    methods:{
        showSnackBar: function(value) {
            this.show = true;
            this.status = value.status;
            this.message = value.message;
        },
        closeSnackBar: function(value){
            this.show = false;
            this.status = "";
            this.message = "";
        }
    }
}
</script>

<style scoped>
body {
    width: 100%;
}

#background{
    position: absolute;
    left: 23px;
    top: 20px;
}

#title{
    font-family: Impact, Charcoal, sans-serif;
    font-size: 2em;
    font-weight: 700;
    color: rgba(34,34,34,0.8);
    position: absolute;
    left: 140px;
    top: 32px;
    z-index: 2;
}

.content .content-title{
    text-align: center;
    font-family: Impact, Charcoal, sans-serif;
    font-size: 2.4em;
    font-weight: 700;
    color: rgba(34,34,34,0.8);
    margin: 0;
}

.word {
    font-family: Verdana, Geneva, sans-serif;
    font-size: 1.3em;
    word-spacing: 5px;
    text-indent: 2em;
    color: #666666;
}
.link {
    width: 15%;
    position: relative;
    left: 42.5%;
    height: 20px;
    border-top: solid #ACC0D8 5px;
}
#screen{
    position: absolute;
    top:230px;
    margin: 0 auto;
    left: 0;
    right: 0;
    color: white;

}
#title-word-1-big-screen{
    font-family: Arial Black, Gadget, sans-serif;
    font-size: 2.5em;
    font-weight: 700;
    letter-spacing:30px;
    text-align: center;
}
#title-word-1-small-screen {
    font-family: Arial Black, Gadget, sans-serif;
    font-size: 1.5em;
    font-weight: 700;
    letter-spacing:10px;
    text-align: center;
}
#title-word-2-big-screen {
    font-family: "Palatino Linotype", "Book Antiqua", Palatino, serif;
    font-size: 1.3em;
    font-weight: 700;
    margin-top: 10px;
    letter-spacing:20px;
    text-align: center;
}
#title-word-2-small-screen {
    font-family: "Palatino Linotype", "Book Antiqua", Palatino, serif;
    font-size: 1.1em;
    font-weight: 700;
    margin-top: 10px;
    text-align: center;
}
#login{
    margin: 0 auto;
    position: absolute;
    left: 0;
    right: 0;
    height: 45px;
    top: 140px;
    background: rgba(125,182,235,0.4);
    color: white;
    font-weight: bold;
    font-size: 20px;
    width: 253px;
    border-radius:3px;
    border:3px solid white;
}
#register{
    margin: 0 auto;
    position: absolute;
    left: 0;
    right: 0;
    top: 200px;
    height: 45px;
    background: rgba(125,182,235,0.4);
    color: white;
    font-weight: bold;
    font-size: 20px;
    width: 253px;
    border-radius:3px;
    border:3px solid white;
}  

</style>
