<template>
    <div id="rank">
        <v-row justify="center" no-gutters>
            <v-col>
                <center><h1 id="title">Rank</h1></center>
                <center><img src="../../assets/6.png" style="z-index: 2;height:240px;max-width: 100%;"></center>
            </v-col>
        </v-row>
        <v-row justify="center">
            <v-col :cols="$store.state.navigator.miniScreen ? 12 : 9">
                <v-tabs v-model="tab" background-color="white" show-arrows>
                    <v-tab v-for="item in tabs" :key="item.tab" @click="getRank(item.field)">
                        {{ item.tab }}
                    </v-tab>
                </v-tabs>
                <v-tabs-items v-model="tab">
                    <v-data-table
                        :headers="headers"
                        :items="contents"
                        :search="search"
                        :loading="isLoading"
                        loading-text="Loading... Please wait"
                        class="elevation-1"
                    >
                        <template v-slot:top>
                            <v-toolbar flat color="white">
                            <v-toolbar-title>{{ tabs[tab].tab }}</v-toolbar-title>
                            <v-divider
                                class="mx-4"
                                inset
                                vertical
                            ></v-divider>
                            <v-spacer></v-spacer>
                            <v-text-field
                                v-model="search"
                                append-icon="search"
                                label="Search"
                                single-line
                                outlined
                                hide-details
                            ></v-text-field>
                            </v-toolbar>
                        </template>
                        <template v-slot:body="{ items }" v-if="contents.length > 0">
                            <tbody>
                                <tr v-for="(item, i) of items" :key="item">
                                    <td>{{ i + 1 }}</td>
                                    <td @click="$router.push('/main/profile/' + item.userID)" style="cursor: pointer;">{{ item.userID }}</td>
                                    <td>{{ item.problemScore }}</td>
                                    <td>{{ item.problemNumber }}</td>
                                </tr>
                            </tbody>
                        </template>
                    </v-data-table>
                </v-tabs-items>
            </v-col>
        </v-row>
    </div>
</template>

<script>
export default {
    name: 'Rank',
    data: () => ({
        tab: 6,
        tabs: [
            { tab: 'web', field: 0 },
            { tab: 'ui', field: 1 },
            { tab: '机器学习', field: 2 },
            { tab: '移动应用', field: 3 },
            { tab: '网络安全', field: 4 },
            { tab: '基础', field: 5 },
            { tab: '总分', field: 6 }
        ],
        isLoading: true,
        headers: [
            { text: '排名', value: 'rank', filterable: false },
            { text: 'userID', value: 'userID', sortable: false },
            { text: '分数', value: 'problemScore', filterable: false },
            { text: '该方向完成题目数', value: 'problemNumber', filterable: false }
        ],
        contents: [],
        search: '',
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
            console.log(newVal);
        }
    },
    created: function(){
        let that = this;
        that.$request.get('/api/guest/rank/6').then( ret => {
            that.isLoading = false;
            if(ret.data) that.contents = ret.data;
        }).catch( err => {
            switch(err.response.data.msg) {
            case "session expired":
                that.$emit("showSnackBar", { status: "error", message: "登录过期，请重新登录。" });
                break;
            default:
                that.$emit("showSnackBar", { status: "error", message: "Something error. Please check your network and try again." })
                break;
            }
            that.isLoading = false;
        })
    },
    methods: {
        getRank:function(field){
            let that = this;
            if (field != that.tabs[that.tab].field) {
                that.isLoading = true;
                that.contents = [];
                that.$request.get('/api/guest/rank/' + field).then( ret => {
                    that.isLoading = false;
                    if(ret.data) that.contents = ret.data;
                }).catch( err => {
                    switch(err.response.data.msg) {
                    case "session expired":
                        that.$emit("showSnackBar", { status: "error", message: "登录过期，请重新登录。" });
                        break;
                    default:
                        that.$emit("showSnackBar", { status: "error", message: "Something error. Please check your network and try again." })
                        break;
                    }
                    that.isLoading = false;
                    
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
