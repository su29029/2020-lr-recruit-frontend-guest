<template>
    <div id="question">
        <v-row justify="center" no-gutters>
            <v-col>
                <center><h1 id="title">Challenges</h1></center>
                <center><img src="../../assets/6.png" style="z-index: 2;height:240px;max-width: 100%;"></center>
            </v-col>
        </v-row>
        <v-row justify="center">
            <v-col :cols="$store.state.navigator.miniScreen ? 12 : 10" :xl="9" :lg="9" :xs="10">
                <v-row>
                    <v-col cols="4" :xl="3" :lg="3" :md="3" :xs="4">
                        <v-card class="mx-auto" max-width="340" min-width="100" tile flat :disabled="isProblemLoading">
                            <v-list>
                                <v-subheader>FIELDS</v-subheader>
                                <v-list-item-group v-model="field" color="primary" mandatory>
                                    <v-list-item
                                    v-for="(field, i) in fields"
                                    :key="i"
                                    @click="getProblem(i)"
                                    >
                                    <v-list-item-content>
                                        <v-list-item-title v-text="field.text"></v-list-item-title>
                                    </v-list-item-content>
                                    </v-list-item>
                                </v-list-item-group>
                            </v-list>
                        </v-card>
                    </v-col>
                    <v-col cols="8" :xl="9" :lg="9" :md="9" :xs="8">
                        <v-row>
                            <p v-if="questions.length == 0">
                                {{errorMessage}}
                            </p>
                            <v-col v-for="question in questions" :key="question.problemTitle" cols="12" :xl="3" :lg="3" :md="4" :sm="6">
                                <v-card height="180" width="180" style="box-shadow: 4px 3px 3px rgba(85,85,85,0.3);font-size:15px;word-wrap:break-word;color:white;display:table-cell;vertical-align: middle;left: 5px;" :to="'/main/question/detail/' + question.problemID" v-bind:style="{ backgroundColor: question.hasSolved ? questionBlockBackgroundFinished : questionBlockBackground }">
                                    <strong>
                                        <center><p style="margin: 0; margin-bottom: 16px;">{{ question.problemTitle }}</p></center>
                                        <center><p style="margin: 0">{{ question.problemSolved }} Solves</p></center>
                                        <center><p style="margin: 0">{{ question.currentScore }} points</p></center>
                                    </strong>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row> 
            </v-col>
        </v-row>
    </div>
</template>

<script>
import Navigator from '../public/navigator'
export default {
    name: 'Question',
    components: {
        Navigator
    },
    data: () => ({
        field: 0,
        fields: [
            { text: 'Web' },
            { text: 'UI' },
            { text: '机器学习' },
            { text: '移动应用' },
            { text: '网络安全' },
            { text: '基础' }
        ],
        questions: [],
        questionBlockBackground: "rgba(0,51,112,0.7)",
        questionBlockBackgroundFinished: "rgba(246,115,193,1)",
        isProblemLoading: true
    }),
    props:{
        message: Object
    },
    watch: {
        message:function(newVal, oldVal){
            let that = this;
            switch (newVal.type) {
            case that.$store.state.messageType.NEW_PROBLEM:
                break;
            case that.$store.state.messageType.NEW_FLAG_SUBMIT:
                break;
            case that.$store.state.messageType.CORRECT_ANSWER:
                break;
            default:
                break; 
            }
        }
    },
    created: function(){
        let that = this;
        that.questions = [];
        that.errorMessage = "Loading... Please wait";
        that.$request.get('/api/guest/getProblem/' + that.field).then( ret => {
            that.isProblemLoading = false;
            if(ret.data){
                for(let question of ret.data) {
                    if (question.problemField == that.field) that.questions.push(question);
                }
            } else that.errorMessage = "No questions found.";
        }).catch( err => {
            that.isProblemLoading = false;
            
            switch(err.response.data.msg) {
            case "session expired":
                that.$emit("showSnackBar", { status: "error", message: "登录过期，请重新登录。" });
                that.errorMessage = "Something error.";
                break;
            default:
                that.$emit("showSnackBar", { status: "error", message: "Something error. Please check your network and try again." });
                break;
            }        
        })
    },
    methods: {
        getProblem:function(field){
            let that = this;
            if (field != that.field){
                that.isProblemLoading = true;
                that.questions = [];
                that.errorMessage = "Loading... Please wait";
                that.$request.get('/api/guest/getProblem/' + field, {withCredentials: true}).then( ret => {
                    that.isProblemLoading = false;
                    if (ret.data) {
                        for(let question of ret.data) {
                            if (question.problemField == field) that.questions.push(question);
                        }
                    } else that.errorMessage = "No questions found.";
                }).catch( err => {
                    that.isProblemLoading = false;
                    that.errorMessage = "Something error.";
                    switch(err.response.data.msg) {
                    case "session expired":
                        that.$emit("showSnackBar", { status: "error", message: "登录过期，请重新登录。" });
                        break;
                    default:
                        that.$emit("showSnackBar", { status: "error", message: "Something error. Please check your network and try again." })
                        break;
                    }
                })
            }
        }
    }
}
</script>

<style scoped>
body {
    background-color: rgba(231,231,231,0.6);
    background-position: top;
    background-repeat: no-repeat;
    margin-top:0px;
    margin-left: 0px;
    margin-right:0px;
    overflow-x:hidden;
}
#title {
    z-index: 1;
    color: rgba(255,255,255,0.9);
    position: absolute;
    
    margin: 0 auto;
    left: 0;
    right: 0;
    top: 130px;
    font-family: "Raleway", "RalewayOffline", sans-serif;
    font-weight: 500;
    letter-spacing: 2px;
}
</style>

