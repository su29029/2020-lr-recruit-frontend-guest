<template>
    <div id="profile-change">
        <v-row justify="center" no-gutters>
            <v-col>
                <center><h1 id="title">修改信息</h1></center>
                <center><img src="../../assets/6.png" style="z-index: 2;height:240px;max-width: 100%;"></center>
            </v-col>
        </v-row>
        <v-row justify="center">
            <v-col :cols="$store.state.navigator.miniScreen ? 12 : 9">
                <v-card>
                    <div style="margin: 9px;">
                        <p><strong>修改须知：</strong></p>
                        <p>请参加招新的同学注册账号后尽快修改以下个人信息，以方便我们后续的招新工作。</p>
                        <p><strong>信息修改注意事项：</strong></p>
                        <p>1.修改信息需要验证手机号（以你更改的手机号为准），由于一个手机号接收验证码每天次数有限制，故每天最多只能修改7次信息，请大家不要频繁修改信息。</p>
                        <p>2.请尽量不要使用中文用户名，用户名是作为一个id来使用，不是真实姓名，如果有在用户名处写了真实姓名的同学尽快修改。</p>
                        <p>3.用户名不要频繁更改，<strong>每次更改用户名都需要重新登录。</strong></p>
                        <p><strong>4.每次更改需要填写旧密码，否则会修改失败。</strong></p>
                        <p>5.如果需要修改密码，请将旧密码，新密码，以及再次输入密码栏全部填写，如果不修改，最后两栏空出即可。</p>
                    </div>
                </v-card>
                <v-card :disabled="isUpdatingProfile">
                    <v-data-table :items="profile" :headers="headers" hide-default-header hide-default-footer>
                        <template v-slot:[`item.value`]="{ item }">
                            <v-form :ref="'profile_' + item.key" v-model="item.isValid">
                                <v-text-field 
                                    v-if="item.isEditing" 
                                    v-model="item.value" 
                                    :rules="item.rules" 
                                    @blur="item.isEditing = false"
                                    :type="item.key.indexOf('Password') > -1 ? 'password' : 'text'"
                                ></v-text-field>
                            </v-form>
                            <div v-if="!item.isEditing" style="height: 60px;font-size: 16px;line-height: 60px;">{{ item.value }}</div>
                        </template>
                        <template v-slot:[`item.modifiable`]="{ item }">
                            <div v-if="item.modifiable">
                                <v-icon
                                    small
                                    class="mr-2"
                                    @click="item.isEditing = true"
                                    v-if="!item.isEditing"
                                >
                                    mdi-pencil
                                </v-icon>
                                <v-icon
                                    small
                                    class="mr-2"
                                    @click="item.isEditing = false"
                                    v-if="item.isEditing"
                                >
                                    mdi-check
                                </v-icon>
                            </div>
                        </template>
                        <template v-slot:top>
                            <v-dialog v-model="confirmChanges.isShowDialog" max-width="350px" v-if="confirmChanges.isShowDialog">
                                <v-progress-linear indeterminate color="green" v-if="confirmChanges.isShowProgress"></v-progress-linear>
                                <v-card>
                                    <v-card-title>
                                        <span class="headline">保存修改</span>
                                    </v-card-title>

                                    <v-card-text>
                                        <p><strong>请验证手机号以完成修改</strong></p>
                                        <p>您的手机号：{{ profile[1].value }}</p>
                                        <v-btn text @click="getValidationCode" :disabled="confirmChanges.isOnCountDown" width="95px" style="margin-bottom:25px" :loading="confirmChanges.isSendingValidation">{{confirmChanges.buttonText}}</v-btn>
                                        <v-text-field 
                                            v-model="confirmChanges.validationCode"
                                            color="blue" 
                                            label="请输入验证码" 
                                            hint="6 digits"
                                            :rules="[value => !!value || 'Required', value => value.length == 6 || '6 digits']"
                                            clearable
                                            outlined
                                            dense
                                        ></v-text-field>
                                    </v-card-text>
                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn color="blue darken-1" text @click="closeSaveDialog">取消</v-btn>
                                        <v-btn color="blue darken-1" text @click="saveChanges">确定</v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>
                        </template>
                    </v-data-table>
                </v-card>
            </v-col>
            <v-col :cols="$store.state.navigator.miniScreen ? 12 : 9">
            	<v-btn @click="showSaveDialog" color="blue" width="100%">保存修改</v-btn>
        	</v-col>
        </v-row>
    </div>
</template>

<script>
export default {
    name: 'ChangeProfile',
    data: () => ({
        textOfKey:{
            'userID': '用户名',
            'tel': '手机号',
            'QQnumber': 'QQ',
            'name': '姓名',
            'studentID': '学号',
            'email': 'email',
            'oldPassword': '原密码',
            'newPassword': '新密码',
            'repeatPassword': '再次输入新密码'
        },
        profileItemRules: {
            'userID': [
                value => !!value || 'Required.',
                value => (value || '').length <= 20 || 'Max 20 characters.',
                value => (value || '').length >= 3 || 'Min 3 characters.'
            ],
            'tel': [
                value => !!value || 'Required.',
                value => /^((0\d{2,3}-\d{7,8})|(1[358479]\d{9}))$/.test(value) || '电话号码无效.'
            ],
            'qq_number': [
                value =>/^[1-9]\d{4,10}$/.test(value) || 'QQ号无效'
            ],
            'name': [
                value => (value || '').length <= 16 || 'Max 16 characters.',
                value => (value || '').length >= 2 || 'Min 2 characters.'
            ],
            'student_id': [
                value => !!value || 'Required.',
                value => /^((2020\d{9})|(2019\d{9})|(2018\d{9}))$/.test(value) || '学号不合法或不支持该年级'
            ],
            'email': [
                value => /^([A-Za-z0-9_\-\.\u4e00-\u9fa5])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,8})$/.test(value) || '邮箱不合法或无效'
            ],
            'old_password': [
                value => (value || '').length <= 32 || 'Max 32 characters.',
                value => (value || '').length >= 8 || 'Min 8 characters.'
            ],
            'new_password': [
                value => (value || '').length <= 32 || 'Max 32 characters.',
                value => (value || '').length >= 8 || 'Min 8 characters.'
            ],
            'repeat_password': [
                value => (value || '').length <= 32 || 'Max 32 characters.',
                value => (value || '').length >= 8 || 'Min 8 characters.'
            ]
        },
        profile: [],
        prevProfile: [],
        headers: [
            { text: 'key', value: 'key' },
            { text: 'value', value: 'value' },
            { text: 'modifiable', value: 'modifiable' }
        ],
        confirmChanges:{
            isShowDialog: false,
            isShowProgress: false,
            validationCode: "",
            isSendingValidation: false,
            isOnCountDown: false,
            buttonText: "获取验证码",
            validationTime: 60
        },
        isUpdatingProfile: false,
        isEditing: false
    }),
    created: function(){
        let that = this;
        if(!that.$store.state.user) {
            that.$emit("showSnackBar", { status: 'error', message: '未知错误，请刷新页面后重试。'});
            return;
        }
        that.$request.get('/api/guest/allprofile/' + that.$store.state.user).then( ret => {
            ret.data.push({ key: 'oldPassword', value: '', modifiable: true, isEditing: false});
            ret.data.push({ key: 'newPassword', value: '', modifiable: true, isEditing: false});
            ret.data.push({ key: 'repeatPassword', value: '', modifiable: true, isEditing: false});
            for(let item in ret.data) {
                ret.data[item].isValid = true;
                ret.data[item].isEditing = false;
                ret.data[item].rules = that.profileItemRules[ret.data[item].key];
                ret.data[item].key = that.textOfKey[ret.data[item].key];
                if (ret.data[item].value == null) {
                    ret.data[item].value = "";
                } else {
                    ret.data[item].value = decodeURIComponent(escape(window.atob(ret.data[item].value)));
                }
            }
            that.profile = ret.data;
            that.prevProfile = JSON.parse(JSON.stringify(that.profile));
        }).catch( err => {
            console.log(err);
            that.$emit('showSnackBar', { status: 'error', message: 'Something error.Please check your network and try again.' });  
        });
    },
    methods: {
        showSaveDialog: function(){
            if (this.checkProfileValid()) this.confirmChanges.isShowDialog = true;
        },
        closeSaveDialog: function(){
            this.confirmChanges.isShowDialog = false;
        },
        getValidationCode: function(){
            let that = this;
            let phone = that.profile[1].value;
            that.confirmChanges.isSendingValidation = true;
            that.$request.post('/api/guest/validation',{tel: phone}).then( ret => {
                that.confirmChanges.isSendingValidation = false;
                if (ret.data.msg === "success") {
                    that.$emit('showSnackBar', { status: 'success', message: '验证码已发送' });
                    that.confirmChanges.isOnCountDown = true;
                    that.confirmChanges.buttonText = that.confirmChanges.validationTime-- + "秒后重发";
                    let expire = setInterval( () => {
                        that.confirmChanges.buttonText = that.confirmChanges.validationTime-- + "秒后重发";
                        if (that.confirmChanges.validationTime == -1) {
                            clearInterval(expire);
                            that.confirmChanges.isOnCountDown = false;
                            that.confirmChanges.buttonText = "获取验证码";
                            that.confirmChanges.validationTime = 60;
                        }
                    }, 1000);
                } else {
                    that.$emit('showSnackBar', { status: 'error', message: '发送短信频率过高，请稍后再试' });
                }
            }).catch( err => {
                that.confirmChanges.isSendingValidation = false;
                that.$emit('showSnackBar', { status: 'error', message: 'Something error.Please check your network and try again.' });  
            })
        },
        checkProfileValid: function(){
            let that = this;
            let isProfileValid = 1;
            for(let item of that.profile) {
                let ref = that.$refs['profile_' + item.key];
                item.isEditing = true;
                // 验证问题
                ref.validate();
                if (ref.validate()){
                    item.isEditing = false;
                } else {
                    isProfileValid = 0;
                }
            }
            return isProfileValid;
        },
        saveChanges: function(){
            let that = this;
            let phone = that.profile[1].value;
            that.confirmChanges.isShowProgress = true;
            that.$request.post("/api/guest/checkvalidation", { tel: phone, validation: that.confirmChanges.validationCode }).then( ret => {
                that.confirmChanges.isShowProgress = false;
                if (ret.data.msg == "success") {
                    console.log("validation pass");
                    that.closeSaveDialog(); // 检查验证码之后关闭
                    that.isUpdatingProfile = true;

                    let currentProfile = {}, prevProfile = {};
                    let keyOfText = Object.keys(that.textOfKey).reduce((acc, key) => {
                        acc[that.textOfKey[key]] = key;
                        return acc;
                    },{}); // 反转键值
                    for(let item in that.profile) {
                        let profileItemName = keyOfText[that.profile[item].key];
                        currentProfile[profileItemName] = that.profile[item].value;
                    }
                    for(let item in that.prevProfile) {
                        let prevProfileItemName = keyOfText[that.prevProfile[item].key];
                        prevProfile[prevProfileItemName] = that.prevProfile[item].value;
                    }
                    that.$request.post("/api/guest/profile/savechanges", { prevProfile: prevProfile, currentProfile: currentProfile }).then( ret => {
                        that.isUpdatingProfile = false;
                        if (ret.data.msg == "success"){
                            that.$emit("showSnackBar", { status: "success", message: "修改成功"});
                            that.$store.state.user = currentProfile.userID;
                            that.$router.go(-1);
                        } else {
                            that.$emit("showSnackBar", { status: "error", message: "信息有误或不完整，更新失败"});
                        }
                    }).catch( err => {
                        that.isUpdatingProfile = false;
                        that.$emit('showSnackBar', {status: 'error', message: 'Something error.Please check your network and try again.'});  
                    })
                } else if (ret.data.msg == "auth_error") {
                    that.$emit('showSnackBar', {status: 'error', message: '验证码错误'});
                }
            }).catch( err => {
                that.confirmChanges.isShowProgress = false;
                that.$emit('showSnackBar', { status: 'error', message: 'Something error.Please check your network and try again.' });  
            })       
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
