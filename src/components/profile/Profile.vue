<template>
    <div id="profile">
        <v-row justify="center" no-gutters>
            <v-col>
                <center><h1 id="title">{{ userData.userID }}<br>{{ userData.rank }}  place</h1></center>
                <center><img src="../../assets/6.png" style="z-index: 2;height:240px;max-width: 100%;"></center>
            </v-col>
        </v-row>
        <v-row justify="center">
            <v-col :cols="$store.state.navigator.miniScreen ? 12 : 9">
                <v-card>
                    <v-sparkline
                        :value="vSparkline.value"
                        :gradient="vSparkline.gradient"
                        :smooth="vSparkline.radius || false"
                        :padding="vSparkline.padding"
                        :line-width="vSparkline.width"
                        :stroke-linecap="vSparkline.lineCap"
                        :gradient-direction="vSparkline.gradientDirection"
                        :fill="vSparkline.fill"
                        :type="vSparkline.type"
                        :auto-line-width="vSparkline.autoLineWidth"
                        auto-draw
                    ></v-sparkline>
                </v-card>
            </v-col>
        </v-row>

        <v-row justify="center">
            <v-col :cols="$store.state.navigator.miniScreen ? 12 : 9">
                <v-card>
                    <v-card-title>
                        {{ userData.userID }}
                        <v-btn text @click="profileChange" v-if="userData.userID === $store.state.user">
                            修改资料
                        </v-btn>
                    </v-card-title>
                    <v-simple-table>
                        <template v-slot:default>
                            <tbody>
                                <tr v-for="item in userData.information" :key="item">
                                    <td>{{ Object.values(item)[0].description }}</td>
                                    <td>{{ Object.values(item)[0].value }}</td>
                                </tr>
                            </tbody>
                        </template>
                    </v-simple-table>
                </v-card>
            </v-col>
        </v-row>

        <v-row justify="center" v-if="userData.userID === $store.state.user">
            <v-col :cols="$store.state.navigator.miniScreen ? 12 : 9">
                <v-card>
                    <v-card-title style="padding-bottom: 0">
                        Uploads
                    </v-card-title>
                    <v-tabs v-model="userData.uploads.field" show-arrows>
                        <v-tab v-for="field in userData.uploads.fields" :key="field">
                            {{ field }}
                        </v-tab>
                    </v-tabs>
                    <v-row>
                        <v-col cols="2" style="text-align: center" v-for="problem in userData.uploads.problems" :key="problem.problemID">
                            <v-icon large style="cursor: pointer">mdi-file</v-icon>
                            <p>{{ problem.problemTitle }}</p>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>
        <v-row justify="center">
            <v-col :cols="$store.state.navigator.miniScreen ? 12 : 9">
                <v-card>
                    <v-card-title style="padding-bottom: 0;">
                        Solves
                    <v-spacer></v-spacer>
                    <v-select
                        v-model="userData.solves.search"
                        :items="userData.solves.fields"
                        chips
                        label="Select Field"
                        solo
                        dense
                    ></v-select>
                    </v-card-title>
                    <v-data-table
                        :headers="userData.solves.headers"
                        :items="userData.solves.items"
                        :search="userData.solves.search == 'all' ? '' : userData.solves.search"
                    ></v-data-table>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>

<script>
const gradients = [
    ['#222'],
    ['#42b3f4'],
    ['red', 'orange', 'yellow'],
    ['purple', 'violet'],
    ['#00c6ff', '#F0F', '#FF0'],
    ['#f72047', '#ffd200', '#1feaea'],
]
export default {
    name: 'Profile',
    data: () => ({
        vSnackBar: {
            snackbar: false,
            snackbarStatus: 'error',
            errorMessage: ''
        },
        vSparkline: {
            width: 2,
            radius: 10,
            padding: 8,
            lineCap: 'round',
            gradient: gradients[5],
            value: [0, 2, 5, 9, 11, 15, 16, 22, 36, 40, 43],
            gradientDirection: 'top',
            gradients,
            fill: false,
            type: 'trend',
            autoLineWidth: false,
        },
        userData: {
            information: [
                {"userID": { description: "我的ID", value: "user" }},
                {"score": { description: "总分", value: 0 }},
                {"totalSolves": { description: "解出题目总数", value: 0 }},
                {"rank": { description: "总排名", value: "0" }},
                {"web": { description: "web方向解出数", value: 0 }},
                {"ui": { description: "ui方向解出数", value: 0 }},
                {"ml": { description: "机器学习方向解出数", value: 0 }},
                {"android": { description: "移动应用方向解出数", value: 0 }},
                {"security": { description: "网络安全方向解出数", value: 0 }},
            ],
            solves: {
                search: '',
                headers: [
                    { text: '题目id', value: 'problemID', filterable: false },
                    { text: '题目名', value: 'problemTitle', filterable: false, sortable: false },
                    { text: '题目类别', value: 'problemField', sortable: false},
                    { text: '题目分数', value: 'problemScore', filterable: false, sortable: false },
                    { text: '倍率', value: 'magnification', filterable: false, sortable: false },
                    { text: '获得时间', value: 'solvedTime', filterable: false, sortable: false }
                ],
                items: [],
                fields: ['all', 'web', 'ui', 'ml', 'android', 'security']
            },
            uploads:{
                field: 0,
                problems: [],
                fields: ['web', 'ui', 'ml', 'android', 'security']
            },
            rank: "",
            userID: ""
        }
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
        },
        'userData.uploads.field': function(newVal, oldVal){
            let that = this;
            let field = newVal;
            console.log(newVal);

            that.$request.get('/api/guest/getuploads/' + field + '/' + that.$store.state.user).then( ret => {
                that.userData.uploads.problems = ret.data;
            }).catch( err => {
                that.$emit("showSnackBar", { status: "error", message: "Something error. Please check your network and try again." });
            })
        }
    },
    created:function(){
        let that = this;
        let url = '/api/guest/profile/userinformation/' + that.$route.params.userID;
        that.$request.get(url).then( ret => {
            for(let i = 0; i < that.userData.information.length; i++){
                let key = Object.keys(that.userData.information[i])[0];
                that.userData.information[i][key].value = ret.data[key];
            }
            that.userData.rank = ret.data['rank'];
            that.userData.userID = ret.data['userID'];
            switch (ret.data.rank % 10) {
            case 1:
                that.userData.rank += 'st';
                break;
            case 2:
                that.userData.rank += 'nd';
                break;
            case 3:
                that.userData.rank += 'rd';
                break;
            default:
                that.userData.rank += 'th';
                break;
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
            return;
        })
        url = "/api/guest/profile/solves/" + that.$route.params.userID;
        that.$request.get(url).then( ret => {
            if (ret.data) {
                that.userData.solves.items = ret.data;
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
        url = "/api/guest/getuploads/" + that.userData.uploads.field + "/" + that.$store.state.user;
        that.$request.get(url).then( ret => {
            that.userData.uploads.problems = ret.data;
        }).catch( err => {
            that.$emit("showSnackBar", { status: "error", message: "Something error. Please check your network and try again." })
        })
    },
    methods: {
        profileChange:function(){
            this.$router.push('/main/changeprofile');
        }
    },
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
