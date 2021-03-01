<template>
    <div id="main">
        <Navigator v-on:showSnackBar="showSnackBar" v-on:sendMessage="webSocketSend" :message="wsMessage"></Navigator>
        <div style="padding-bottom: 30px;">
            <router-view 
                v-on:showSnackBar="showSnackBar" 
                v-on:sendMessage="webSocketSend" 
                v-on:showMessageCard="showMessageCard" 
                :message="wsMessage"
            ></router-view>
        </div>
        <Footer></Footer>
        <SnackBar v-on:closeSnackBar="closeSnackBar" :show="snackbar.show" :status="snackbar.status" :message="snackbar.message"></SnackBar>
        <MessageCard v-on:closeMessageCard="closeMessageCard" :show="message.show" :message="message.message"></MessageCard>
    </div>
</template>

<script>
import Navigator from './navigator'
import Footer from './footer'
import SnackBar from './snackbar'
import MessageCard from './messageCard'
export default {
    name: 'Main',
    components: {
        Navigator,
        Footer,
        SnackBar,
        MessageCard
    },
    data: () => ({
        snackbar:{
            show: false,
            status: '',
            message: ''
        },
        message:{
            show: false,
            status: '',
            message: ''
        },
        ws: null,
        wsMessage: {},
    }), 
    created:function(){
        this.createWebSocket();
    },
    methods: {
        showSnackBar: function(value) {
            this.snackbar.show = true;
            this.snackbar.status = value.status;
            this.snackbar.message = value.message;
        },
        closeSnackBar: function(){
            this.snackbar.show = false;
            this.snackbar.status = "";
            this.snackbar.message = "";
        },
        showMessageCard: function(value){
            this.message.show = true;
            this.message.message = value.content;
        },
        closeMessageCard: function(){
            this.message.show = false;
            this.message.message = "";
        },
        createWebSocket: function(){
            this.ws = new WebSocket("wss://lr.guest.su29029.xyz/api/ws/connect/" + this.$store.state.user);
            this.ws.onopen = this.webSocketOnOpen;
            this.ws.onerror = this.webSocketOnError;
            this.ws.onmessage = this.webSocketOnMessage;
            this.ws.onclose = this.webSocketOnClose;
        },
        webSocketOnOpen: function(){
            setInterval(this.webSocketPing, 20000);
        },
        webSocketOnMessage: function(e){
            // data type:
            // {
                // type: 'messageType.NEW_UPLOAD' [提交] || 'messageType.NEW_FLAG_SUBMIT' [flag正确提交] || 'messageType:CORRECT_ANSWER' [提交赋分] || 'messageType.NEW_PROBLEM' [新题目/题目更新] ||"messageType.HEART_BEAT" [心跳包] || "messageType.ERROR" [错误]
                // messageData:{
                    // userID?: string
                    // message: string
                    // problemStatus?: {
                        // problemID: int
                        // originScore: int
                        // magnification: float64
                        // isFirstBlood: boolean
                    // }
                // }
            // }
            console.log(e);
            if (e.data.type == this.$store.state.messageType.ERROR) this.ws.close();
            else if (e.data.type != this.$store.state.messageType.HEART_BEAT) this.wsMessage = e.data;
        },
        webSocketOnError: function(){
            setTimeout(this.createWebSocket, 5000);
        },
        webSocketOnClose: function(){
            console.log("disconnect");
        },
        webSocketSend: function(msg) {
            if(msg.type >= -1 && msg.type <= 4) this.ws.send(msg);
        },
        webSocketPing: function(){
            let that = this;
            let msg = {
                type: that.$store.state.messageType.HEART_BEAT,
                messageData: {
                    msg: "ping"
                }
            }
            this.ws.send(JSON.stringify(msg));
        }
    },
}
</script>

<style>

</style>
