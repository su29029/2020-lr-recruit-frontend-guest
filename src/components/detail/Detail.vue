<template>
    <div id="detail">
        <v-row justify="center" no-gutters>
            <v-col>
                <center><h1 id="title">Challenges</h1></center>
                <center><img src="../../assets/6.png" style="z-index: 2;height:240px;max-width: 100%;"></center>
            </v-col>
        </v-row>
        <v-card style="margin: auto; left: 0; right: 0; top: -50px;" :style="{ width: $store.state.navigator.miniScreen ? '100%' : ($store.state.navigator.smallScreen ? '88%' : '70%')}" :elevation="$store.state.navigator.miniScreen ? 0 : 8">
            <div style="margin: 12px;">
                <v-row justify="center">
                    <v-col cols="12" xl="3" lg="3" md="3" sm="12" style="font-size: 18px;text-align: center; margin: 0">题目：{{ problem.problemTitle }}</v-col>
                    <v-col cols="12" xl="3" lg="3" md="3" sm="12" style="font-size: 18px;text-align: center; margin: 0">分值：{{ problem.currentScore }}</v-col>
                    <v-col cols="12" xl="3" lg="3" md="3" sm="12" style="font-size: 18px;text-align: center; margin: 0">已解出人数：{{ problem.problemSolved }}</v-col>
                </v-row>
            </div>
            <v-divider></v-divider>
            <MarkDown v-model="problem.problemContent" isPreview :bordered="false" min-height="200px"></MarkDown>
            <v-divider></v-divider>
            <v-card-text>提交区</v-card-text>
            <v-form v-model="isFileValid" ref="form" lazy-validation :disabled="isUploading">
                <v-row justify="center">
                    <v-col :cols="$store.state.navigator.miniScreen ? 9 : 10" align-self="center" v-if="problem.problemType === 'flag'">
                        <v-text-field v-model="flag" placeholder="在此处提交flag" outlined></v-text-field>
                    </v-col>
                    <v-col :cols="$store.state.navigator.miniScreen ? 3 : 2" v-if="problem.problemType === 'flag'">
                        <v-btn @click="submitFlag" :disabled="!isFileValid || isUploading" text :loading="isUploading">提交</v-btn>
                    </v-col>
                    
                    <v-col :cols="$store.state.navigator.miniScreen ? 9 : 10" align-self="center" v-if="problem.problemType === 'upload'">
                        <v-file-input
                            v-model="files"
                            :rules="rules"
                            color="success"
                            accept=".doc,.docx,.md,.zip,.rar,.tar.tz,.pdf"
                            placeholder="选择文件"
                            prepend-icon="mdi-paperclip"
                            outlined
                            counter
                            chips
                            dense
                            :show-size="1000"
                        ></v-file-input>  
                    </v-col>
                    <v-col :cols="$store.state.navigator.miniScreen ? 3 : 2" v-if="problem.problemType === 'upload'">
                        <v-btn @click="upload" :disabled="!isFileValid || isUploading" text :loading="isUploading">上传</v-btn>
                    </v-col>
                </v-row>
            </v-form>
        </v-card>
    </div>
</template>

<script>
import Navigator from '../public/navigator'
import MarkDown from 'vue-meditor'
export default {
    name: 'Detail',
    components: {
        Navigator,
        MarkDown
    },
    data: () => ({
        problem: {
            problemID: 0,
            problemTitle: "",
            problemContent: "",
            problemField: "",
            problemSolved: 0,
            problemScore: 0,
            currentScore: 0
        },
        files: null,
        rules: [
            value => {
                return true;
            },
        ],
        flag: "",
        isUploading: true,
        isFileValid: false
    }),
    props:{
        message: Object
    },
    watch: {
        message:function(newVal, oldVal){
            let that = this;
            switch (newVal.type) {
            case that.$store.state.messageType.NEW_FLAG_SUBMIT:
                break;
            case that.$store.state.messageType.CORRECT_ANSWER:
                break;
            default:
                break; 
            }
        }
    },
    created:function(){
        let that = this;
        that.isUploading = true;
        that.$request.get('/api/guest/problemDetail/' + that.$route.params.problemID).then( ret => {
            if (ret.data.problemID > 0 && ret.data.problemIsShow) {
                that.isUploading = false;
                that.problem = ret.data;
            } else {
                that.problem.problemContent = "题目维护中";
            }
        }).catch( err => {
            switch(err.response.data.msg) {
            case "session expired":
                that.$emit("showSnackBar", { status: "error", message: "登录过期，请重新登录。" });
                break;
            default:
                that.$emit("showSnackBar", { status: "error", message: "Something error. Please check your network and try again." })
                break;
            }
        })
    },
    methods:{
        upload:function(){
            let that = this;
            if (that.files){
                that.isUploading = true;    
                let formData = new FormData();
                formData.append("files", that.files, that.files.name);
                formData.append("user", that.$store.state.user);
                formData.append("problemID", that.$route.params.problemID);
                formData.append("problemTitle", that.problem.problemTitle);
                formData.append("problemField", that.problem.problemField);
                that.$request.post('/api/guest/upload', formData).then( ret => {
                    that.isUploading = false;
                    if (ret.data.msg == "succeed_upload") {
                        that.$emit("showSnackBar", { status: "success", message: "上传成功"});
                        that.files = null;
                    } else if (ret.data.msg == "suffix_false"){
                        that.$emit("showSnackBar", { status: "error", message: "文件格式错误" });
                    } else {
                        that.$emit("showSnackBar", { status: "error", message: "上传失败" });
                    }
                }).catch( err => {
                    that.isUploading = false;
                    that.$emit("showSnackBar", { status: "error", message: "Something error. Please check your network and try again." });
                })
            }
        },
        submitFlag: function(){
            let that = this;
            if(that.flag){
                that.$request.post("/api/guest/submit/checkflag", { userID: that.$store.state.user, problemID: that.problem.problemID, flag: that.flag }).then( ret => {
                    if (ret.data.msg === "success") {
                        that.$emit("showSnackBar", { status: "success", message: "恭喜你，flag正确！" });
                    } else {
                        that.$emit("showSnackBar", { status: "error", message: "flag错误" });
                    }
                }).catch( err => {
                    that.$emit("showSnackBar", { status: "error", message: "Something error. Please check your network and try again." });
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
    margin-top: 0px;
    margin-left: 0px;
    margin-right: 0px;
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
