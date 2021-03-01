<template>
    <div id="register-component">
        <v-card class="mx-auto" outlined width="400" height="470" :disabled="vCard.isButtonLoading" style="opacity: 0.9">
            <v-progress-linear indeterminate color="green" absolute v-if="vCard.vProgressLinear.isShowProgress"></v-progress-linear>
        
            <v-card-text>
                <p class="text-center" style="margin-top: 20px;margin-bottom: 5px;font-size:22px;">注册</p>
            </v-card-text>

            <v-form ref="form" class="mx-auto" align="center" v-model="vCard.vForm.valid" lazy-validation>
                <v-col align="center" style="padding: 0">
                    <v-row align="center" style="width: 90%;margin: 0">
                        <v-text-field 
                            color="blue" 
                            label="请输入用户名" 
                            hint="3-20 characters" 
                            :rules="vCard.vForm.rules.username" 
                            v-model="vCard.vForm.username" 
                            @keyup.enter="register"
                            class="username" 
                            clearable
                            outlined
                            dense
                        ></v-text-field>
                    </v-row>
                    <v-row align="center" style="width: 90%;margin: 0;">
                        <v-text-field 
                            color="blue" 
                            label="请输入学号" 
                            hint="13 digits" 
                            :rules="vCard.vForm.rules.stuNumber" 
                            v-model="vCard.vForm.stuNumber" 
                            @keyup.enter="register"
                            class="stu-number" 
                            clearable
                            outlined
                            dense
                        ></v-text-field>
                    </v-row>
                    <v-row align="center" style="width: 90%;margin: 0;;">
                        <v-text-field 
                            color="blue" 
                            label="请输入密码" 
                            :append-icon="vCard.vForm.show1 ? 'mdi-eye' : 'mdi-eye-off'" 
                            :type="vCard.vForm.show1 ? 'text' : 'password'" 
                            hint="8-32 characters"
                            :rules="vCard.vForm.rules.password" 
                            @click:append="vCard.vForm.show1 = !vCard.vForm.show1" 
                            @keyup.enter="register"
                            v-model="vCard.vForm.password" 
                            class="password" 
                            clearable
                            outlined
                            dense
                        ></v-text-field>
                    </v-row>
                    <v-row align="center" style="width: 90%;margin: 0;" no-gutters>
                        <v-col cols="8">
                            <v-text-field 
                                color="blue" 
                                label="请输入手机号" 
                                hint="11 digits" 
                                :rules="vCard.vForm.rules.phoneNumber" 
                                v-model="vCard.vForm.phoneNumber" 
                                @keyup.enter="register"
                                class="phone-number" 
                                clearable
                                outlined
                                dense
                            ></v-text-field>
                        </v-col>
                        <v-col>
                            <v-btn text @click="getValidationCode" :disabled="isOnCountDown" width="95px" style="margin-bottom:25px" :loading="isSendingValidation">{{vCard.vForm.buttonText}}</v-btn>
                        </v-col>
                    </v-row>
                    <v-row align="center" style="width: 90%;margin: 0;;">
                        <v-text-field 
                            color="blue" 
                            label="请输入验证码" 
                            hint="6 digits" 
                            :rules="vCard.vForm.rules.validation" 
                            v-model="vCard.vForm.validation" 
                            @keyup.enter="register"
                            class="validation" 
                            clearable
                            outlined
                            dense
                        ></v-text-field>
                    </v-row>
                </v-col>
                <div style="text-align: center">
                    <v-btn color="success" @click="register" class="login" :disabled="!vCard.vForm.isRegisterEnabled && vCard.vForm.valid">注册</v-btn>
                    <v-btn @click="goLogin" text class="login" style="left: 10px;">
                        <span class="mr-2">使用已有账号登录</span>
                    </v-btn>
                </div>
            </v-form>
            
        </v-card>
    </div>
</template>

<script>
import SnackBar from '../public/snackbar'
export default {
    name: 'Register',
    components: {
        SnackBar
    },
    data: () => ({
        vSnackbar:{
            snackbar: false,
            status: "",
            loginResult:""
        },
        vCard: {
            isButtonLoading: false,
            vProgressLinear:{
                isShowProgress: false
            },
            vCardText: {

            },
            vForm: {
                valid: true,
                rules: {
                    username: [
                        value => !!value || 'Required.',
                        value => (value || '').length <= 20 || 'Max 20 characters.',
                        value => (value || '').length >= 3 || 'Min 3 characters.',
                        value => !/\s+/.test(value) || '用户名不能含有空格'
                    ],
                    stuNumber: [
                        value => !!value || 'Required.',
                        value => /^((2020\d{9})|(2019\d{9})|(2018\d{9}))$/.test(value) || '学号不合法或不支持该年级注册'
                    ],
                    password: [
                        value => !!value || 'Required.',
                        value => (value || '').length <= 32 || 'Max 32 characters.',
                        value => (value || '').length >= 8 || 'Min 8 characters.'
                    ],
                    phoneNumber: [
                        value => !!value || 'Required.',
                        value => /^((0\d{2,3}-\d{7,8})|(1[358479]\d{9}))$/.test(value) || 'Invalid.'
                    ],
                    validation: [
                        value => !!value || 'Required.',
                        value => value.length === 6 || 'Invalid.'
                    ]
                },
                username: '',
                stuNumber: '',
                password: '',
                phoneNumber: '',
                validation: '',
                show1: false,
                buttonText: "获取验证码",
                isRegisterEnabled: true
            }
        },
        validationTime: 60,
        isOnCountDown: false,
        isSendingValidation: false
    }),
    created:function(){
        
    },
    methods:{
        getValidationCode: function(){
            let that = this;
            let username = that.vCard.vForm.username;
            let phone = that.vCard.vForm.phoneNumber;
            let regex = /^((0\d{2,3}-\d{7,8})|(1[358479]\d{9}))$/;
            if (!phone) that.$emit('showSnackBar', { status: 'error', message: '请输入手机号' });
            else if (regex.test(phone)){
                that.isSendingValidation = true;
                that.$request.post('/api/guest/validation',{"userID": username, "tel": phone}).then( ret => {
                    that.isSendingValidation = false;
                    if (ret.data.msg === "success") {
                        that.$emit('showSnackBar', { status: 'success', message: '验证码已发送' });
                        that.isOnCountDown = true;
                        that.vCard.vForm.buttonText = that.validationTime-- + "秒后重发";
                        let expire = setInterval( () => {
                            that.vCard.vForm.buttonText = that.validationTime-- + "秒后重发";
                            if (that.validationTime == -1) {
                                clearInterval(expire);
                                that.isOnCountDown = false;
                                that.vCard.vForm.buttonText = "获取验证码";
                                that.validationTime = 60;
                            }
                        }, 1000);
                    } else {
                        that.$emit('showSnackBar', { status: 'error', message: '发送短信频率过高，请稍后再试' });
                    }
                }).catch( err => {
                    that.isSendingValidation = false;
                    that.$emit('showSnackBar', { status: 'error', message: 'Something error.Please check your network and try again.' });  
                })
            } else that.$emit('showSnackBar', {status: 'error', message: '手机号错误' });
        },
        register: function() {
            let that = this;
            let username = that.vCard.vForm.username;
            let password = that.vCard.vForm.password;
            let stuNumber = that.vCard.vForm.stuNumber;
            let phoneNumber = that.vCard.vForm.phoneNumber;
            let validation = that.vCard.vForm.validation;
            if (that.$refs.form.validate()){
                that.vCard.vProgressLinear.isShowProgress = true;
                that.vCard.isButtonLoading = true;
                that.$request.post('/api/guest/register', { "userID": username, "passwd": password, "studentID": stuNumber, "tel": phoneNumber, "validation": validation }).then ( ret => {
                    that.vCard.vProgressLinear.isShowProgress = false;
                    that.vCard.isButtonLoading = false;
                    if (ret.data.msg === "succeed_register") {
                        that.$emit('showSnackBar', {
                            status: 'success',
                            message: '注册成功'
                        })
                        that.goLogin();
                    } else if (ret.data.msg === "phone_number_is_registered") that.$emit('showSnackBar', { status: 'error', message: '该手机 号已被注册' });
                      else if (ret.data.msg === "stu_number_is_registered") that.$emit('showSnackBar', { status: 'error', message: '该学号已被注册' });
                      else if (ret.data.msg === "username_is_registered") that.$emit('showSnackBar', { status: 'error', message: '该用户名已被注册' });
                      else if (ret.data.msg === "wrong_code") that.$emit('showSnackBar', { status: 'error', message: '验证码错误' });
                      else that.$emit('showSnackBar', { status: 'error', message: 'Something error. Please check your network and try again.' });
                }).catch (err => {
                    that.vCard.vProgressLinear.isShowProgress = false;
                    that.vCard.isButtonLoading = false;
                    that.$emit('showSnackBar', { status: 'error', message: 'Something error. Please check your network and try again.' });
                })
            }
        },
        goLogin: function(){
            this.$parent.isShowLogin = true;
            this.$parent.isShowRegister = false;
        },
        cannotRegister: function(){
            alert("请联系招新群中管理员");
        },
        uuid: function(){
            let temp_url = URL.createObjectURL(new Blob());
            let uuid = temp_url.toString();
            URL.revokeObjectURL(temp_url);
            return uuid.substr(uuid.lastIndexOf("/") + 1);
        }
    }
}
</script>

<style scoped>

</style>



