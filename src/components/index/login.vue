<template>
    <div id="login-component">
        <v-card v-if="vCard1.isShowInformationForm || isLogin" outlined class="mx-auto" width="300" height="100" style="opacity: 0.7;top: 210px;" id="card-1">
            <v-row justify="center" no-gutters>
                <v-col style="text-align: center;">
                    <p style="top: 15px; font-size: 18px; word-spacing: 5px;">欢迎你，{{ $store.state.user }}</p>
                    <v-btn @click="$router.push('/main')">前往主页</v-btn>
                </v-col>
            </v-row>
        </v-card>
        <v-card v-if="vCard2.isShowLoginForm && !isLogin" class="mx-auto" outlined width="400" height="470" :disabled="vCard2.isButtonLoading" style="opacity: 0.9" id="card-2">
            <v-progress-linear indeterminate color="green" absolute v-if="vCard2.vProgressLinear.isShowProgress"></v-progress-linear>
        
            <v-card-text>
                <p class="text-center" style="margin-top:30px;font-size:22px;">登录</p>
            </v-card-text>

            <v-form ref="form" class="mx-auto" align="center" v-model="vCard2.vForm.valid" lazy-validation>
                <v-col align="center">
                    <v-row align="center" style="width: 90%;margin-top:10px;">
                        <v-text-field 
                            color="blue" 
                            label="请输入用户名" 
                            hint="3-20 characters" 
                            :rules="vCard2.vForm.rules.username" 
                            v-model="vCard2.vForm.username" 
                            @keyup.enter="login"
                            class="username" 
                            clearable
                            outlined
                            dense
                        ></v-text-field>
                    </v-row>
                    <v-row align="center" style="width: 90%;margin-top:10px;margin-bottom:10px">
                        <v-text-field 
                            color="blue" 
                            label="请输入密码" 
                            :append-icon="vCard2.vForm.show1 ? 'mdi-eye' : 'mdi-eye-off'" 
                            :type="vCard2.vForm.show1 ? 'text' : 'password'" 
                            hint="8-32 characters"
                            :rules="vCard2.vForm.rules.password" 
                            @click:append="vCard2.vForm.show1 = !vCard2.vForm.show1" 
                            @keyup.enter="login"
                            v-model="vCard2.vForm.password" 
                            class="password" 
                            clearable
                            outlined
                            dense
                        ></v-text-field>
                    </v-row>
                    
                    <v-row align="center" style="width: 90%;margin-top:10px;margin-bottom:10px">
                        <div id="grecaptcha"></div>
                    </v-row>
                </v-col>
                <div style="margin: 0 auto; left: 0; right: 0; text-align: center">
                    <v-btn color="success" @click="login" class="login" :disabled="!vCard2.vForm.isLoginEnabled && vCard2.vForm.valid">登录</v-btn>
                    <v-btn @click="goRegister" text class="register" style="left: 10px;">
                        <span class="mr-2">注册新账号</span>
                    </v-btn>
                    <span style="cursor: pointer;font-size: 13px;left: 7px" @click="forgotPassword">忘记密码?</span>
                </div>
            </v-form>
        </v-card>
    </div>
</template>

<script>
import SnackBar from '../public/snackbar'
export default {
    name: 'Login',
    props:{
        isLogin: Boolean
    },
    components: {
        SnackBar
    },
    data: () => ({
        vCard1: {
            isShowInformationForm: false,
            information: {
                username: ""
            }
        },
        vCard2: {
            isShowLoginForm: true,
            isButtonLoading: false,
            vProgressLinear: {
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
                        value => (value || '').length >= 3 || 'Min 3 characters.'
                    ],
                    password: [
                        value => !!value || 'Required.',
                        value => (value || '').length <= 32 || 'Max 32 characters.',
                        value => (value || '').length >= 8 || 'Min 8 characters.'
                    ]
                },
                username: '',
                password: '',
                show1: false,
                isLoginEnabled: true,
            }
        },
        sitekey: '6LchkscZAAAAAJ92xk9py9sh19QMcBJ9Ct7AzN92',
        token: ''
    }),
    mounted: function(){
        this.loadCaptcha();
    },
    methods: {
        captchaPass: function(token) {
            this.token = token;
        },
        captchaExpired: function(token) {
            this.$emit('showSnackBar', { status: 'error', message: '验证已过期，请重新验证' });
        },
        captchaError: function(token) {
            this.$emit('showSnackBar', { status: 'error', message: 'Something error. Please check your network and try again.' });  
        },
        loadCaptcha: function(){
            if(!this.$store.state.user) {
                window.grecaptcha.render("grecaptcha", {
                    'size': 'normal',
                    'sitekey': this.sitekey,
                    'callback': this.captchaPass,
                    'expired-callback': this.captchaExpired,
                    'error-callback': this.captchaError
                });
            }
        },
        resetCaptcha: function(){
            window.grecaptcha.reset();
        },
        login:function(){
            let that = this;
            let username = that.vCard2.vForm.username;
            let password = that.vCard2.vForm.password;
            if(!that.token) {
                that.$emit('showSnackBar', { status: 'error', message: '请完成人机身份验证'});
            } else if (that.$refs.form.validate()){
                that.vCard2.vProgressLinear.isShowProgress = true;
                that.vCard2.isButtonLoading = true;
                that.$request.post('/api/guest/login', {"userID": username, "passwd": password, "token": that.token}).then ( ret => {
                    that.vCard2.vProgressLinear.isShowProgress = false;
                    that.vCard2.isButtonLoading = false;
                    if (ret.data.msg == "succeed_login") {
                        that.$emit('showSnackBar', { status: 'success', message: '登录成功' });
                        that.vCard2.isShowLoginForm = false;
                        that.isLogin = true;

                        that.vCard1.isShowInformationForm = true;
                        that.vCard1.information.username = username;

                        that.$parent.isShowInformation = true;
                        that.$parent.isShowMain = true;
                        
                        that.$store.state.user = username;
                    } 
                    else if (ret.data.msg == "fail_login") that.$emit('showSnackBar', { status: 'error', message: '用户名或密码错误' });
                    else if (ret.data.msg == "auth_error") that.$emit('showSnackBar', { status: 'error', message: '人机验证失败，请重试' });
                    else that.$emit('showSnackBar', { status: 'error', message: 'Something wrong. Please check your information.' });
                    
                }).catch( err => {
                    that.vCard2.vProgressLinear.isShowProgress = false;
                    that.vCard2.isButtonLoading = false;
                    that.$emit('showSnackBar', { status: 'error', message: 'Something error. Please check your network and try again.' });  
                })
                if(!this.$store.state.user) that.resetCaptcha();
            }
        },
        goRegister:function(){
            let that = this;
            that.$parent.isShowLogin = false;
            that.$parent.isShowRegister = true;
        },
        forgotPassword:function(){
			this.$emit('showSnackBar', { status: 'primary', message: '请联系招新群内管理员' });
        }
    }
    
}
</script>

<style scoped>

</style>
