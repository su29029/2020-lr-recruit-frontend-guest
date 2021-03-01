<template>
  <div id="navigator">
    <v-app-bar color="primary" elevate-on-scroll fixed style="max-width: 100%;color: white">
      <v-app-bar-nav-icon v-if="!$store.state.navigator.isShow && $store.state.navigator.smallScreen" @click="drawer = true"></v-app-bar-nav-icon>

      <v-toolbar-title style="margin-right: 15px;cursor: pointer" @click="$router.push('/')">凌睿招新平台</v-toolbar-title>

      <v-btn text color="white" @click="$router.push('/main/question');group = 0;" v-if="!$store.state.navigator.smallScreen">
        <v-icon left>mdi-home</v-icon>题目
      </v-btn>

      <v-btn text color="white" @click="$router.push('/main/rank');group = 1;" v-if="!$store.state.navigator.smallScreen">
        <v-icon left>mdi-chart-box</v-icon>排行榜
      </v-btn>

      <v-btn text color="white" @click="$router.push('/main/profile/' + $store.state.user);group = 2;" v-if="!$store.state.navigator.smallScreen">
        <v-icon left>mdi-account</v-icon>个人信息
      </v-btn>

      <v-spacer></v-spacer>
      <v-menu v-model="menu" :close-on-content-click="false" max-width="210" offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            text
            color="white"
            v-bind="attrs"
            v-on="on"
            :width="$store.state.navigator.miniScreen ? 100 : 200"
            class="custom-transform-class text-none"
            style="margin: auto"
          >
            <v-icon left>mdi-account</v-icon>
            {{ profile.username }}
          </v-btn>
        </template>

        <v-card>
          <v-list>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>{{ $store.state.user || profile.userID }}</v-list-item-title>
                <v-list-item-subtitle>{{ profile.rank + " place" }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn text @click="$router.push('/main/profile/' + $store.state.user);group = 2">查看个人信息</v-btn>
            <v-btn color="primary" text @click="logout">退出登录</v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
    </v-app-bar>
    <v-navigation-drawer
      v-model="drawer"
      fixed
      temporary
      clipped
      style="height: 100vh;"
    >
      <v-list
        nav
        dense
      >
        <v-list-item-group
          v-model="group"
          active-class="deep-purple--text text--accent-4"
          mandatory
        >
          <v-list-item @click="$router.push('/main/question')">
            <v-list-item-icon>
              <v-icon>mdi-home</v-icon>
            </v-list-item-icon>
            <v-list-item-title>题目</v-list-item-title>
          </v-list-item>

          <v-list-item @click="$router.push('/main/rank')">
            <v-list-item-icon>
              <v-icon>mdi-chart-box</v-icon>
            </v-list-item-icon>
            <v-list-item-title>排行榜</v-list-item-title>
          </v-list-item>

          <v-list-item @click="$router.push('/main/profile/' + $store.state.user)">
            <v-list-item-icon>
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>
            <v-list-item-title>个人信息</v-list-item-title>
          </v-list-item>

        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    
  </div>
  
</template>

<script>
export default {
  name: "Navigator",
  data: () => ({
    profile: {
      userId: "",
      rank: "",
    },
    menu: '',
    drawer: false,
    group: -1
  }),
  props:{
    message: Object
  },
  watch:{
    message: function(newVal, oldVal){
      let that = this;
      let content = {};
      switch (newVal.type) {
      case that.$store.state.messageType.NEW_UPLOAD:
        content.title = "新提交";
        content.message = "用户 " + newVal.messageData.userID + " 提交了题目 " + newVal.messageData.problemStatus.problemTitle + "。";
        that.$emit('showMessageCard', { content: content });
        break;
      case that.$store.state.messageType.NEW_PROBLEM:
        break;
      case that.$store.state.messageType.NEW_FLAG_SUBMIT:
        content.title = "新提交";
        if (newVal.messageData.problemStatus.isFirstBlood){
            content.message = "恭喜用户 " + newVal.messageData.userID + " 获得" + that.$store.state.field[newVal.messageData.problemStatus.problemField] + "类题目 " + newVal.messageData.problemStatus.problemTitle + "一血！";
        } else {
            content.message = "恭喜用户 " + newVal.messageData.userID + " 完成" + that.$store.state.field[newVal.messageData.problemStatus.problemField] + "类题目 " + newVal.messageData.problemStatus.problemTitle + "。";
        }
        that.$emit('showMessageCard', { content: content });
        break;
      case that.$store.state.messageType.CORRECT_ANSWER:
        content.title = "新提交";
        content.message = "恭喜用户 " + newVal.messageData.userID + " 完成" + that.$store.state.field[newVal.messageData.problemStatus.problemField] + "类题目 " + newVal.messageData.problemStatus.problemTitle + "。";
        that.$emit('showMessageCard', { content: content });
        break;
      case that.$store.state.messageType.ERROR:
        that.$emit('showSnackBar', { status: 'error', message: '有些不对劲。' });
        break;
      default:
        break; 
      }
    }
  },
  created:function(){
    let that = this;
    let currentChoice = that.$route.name;
    if (currentChoice == "Question" || currentChoice == "Detail") that.group = 0;
    else if (currentChoice == "Rank") that.group = 1;
    else that.group = 2;
    let url = "/api/guest/profile/userinformation/" + that.$store.state.user;
    that.$request.get(url).then( ret => {
      that.profile.userID = ret.data.userID;
      that.profile.rank = ret.data.rank;
      switch (ret.data.rank % 10) {
        case 1:
          that.profile.rank += 'st';
          break;
        case 2:
          that.profile.rank += 'nd';
          break;
        case 3:
          that.profile.rank += 'rd';
          break;
        default:
          that.profile.rank += 'th';
          break;
      }
    }).catch( err => {
      that.$emit("showSnackBar", { status: "error", message: "Something error. Please check your network and try again." })
    });
    
  },
  methods: {
    logout:function(){
      let that = this;
      that.$request.post('/api/guest/logout', {"userID": that.$store.state.user}).then( ret => {
        if (ret.data.msg === "success"){
          that.$store.state.user = "";
          alert("您已成功退出登录！");
          that.$router.push('/index');
        }
      }).catch( err => {
        that.$emit("showSnackBar", { status: "error", message: "Something error. Please check your network and try again." })
      })
    }
  },
};
</script>

<style scoped>

</style>
