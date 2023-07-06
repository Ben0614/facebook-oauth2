<script setup lang="ts">
import { ref } from 'vue'

// 1.先到vite.config做設定 (啟動網址、https)
// 2.到index.html設定script

/*
參考網站
https://developers.facebook.com/docs/facebook-login/web
到Facebook 開發人員帳號 > 有應用程式就直接用 沒有就建立 > 應用程式編號填到下面的appId (index.html也要)
version也會更新 要去確認

https://developers.facebook.com/docs/facebook-login/web/js-example
https://penueling.com/%E7%B7%9A%E4%B8%8A%E5%AD%B8%E7%BF%92/vue3-%E4%BD%BF%E7%94%A8-facebook-login-api/
https://tools.wingzero.tw/article/sn/126
*/

// 類型
declare global {
  interface Window {
    fbAsyncInit: () => void;
    FB: any;
  }
}

const isLogined = ref(false)
const message = ref('請登入FB')

const appId = ''
const version = 'v17.0'

const btnRef = ref<HTMLButtonElement>()





// 初始化
window.fbAsyncInit = function () {
  window.FB.init({
    appId: appId,
    cookie: true,  // enable cookies to allow the server to access 
    // the session
    xfbml: true,  // parse social plugins on this page
    version: version // Specify the Graph API version to use
  });

  // 確認狀態 改變isLogined和message
  checkLoginState()
};



// 登入
const login = () => {
  window.FB.login(function (response:any) {
    console.log('response', response);
    // {
    //   "authResponse": {
    //     "accessToken":"",
    //     "userID": "",
    //     "expiresIn": 0,
    //     "signedRequest": "",
    //     "graphDomain": "facebook",
    //     "data_access_expiration_time": 0
    //   },
    //   "status": "connected"
    // }

    // 登入成功
    if (response.authResponse) {
      //這邊可以做登入成功後要做的事 例如:將使用者登入狀態存到 session 去
      console.log('登入成功');
      
      // 確認狀態 改變isLogined和message
      checkLoginState()
    } else {
      console.log('User cancelled login or did not fully authorize.');
    }
  });
}

// 獲取個人資料
const getProfile = () => {
  window.FB.api('/me', function (response: any) {
    message.value = `歡迎回來,${response.name}`
    console.log('response', response);
    // {
    //   "name": "",
    //   "id": ""
    // }
  });
}

// 登出
const logout = ()=>{
  window.FB.logout(function () {
    // 確認狀態 改變isLogined和message
    checkLoginState()
  });
}

// 確認狀態 改變isLogined和message
function checkLoginState() {
  window.FB.getLoginStatus(function (response: any) {
    console.log('response', response);
    // {
    //   "authResponse": {
    //     "accessToken":"",
    //     "userID": "",
    //     "expiresIn": 0,
    //     "signedRequest": "",
    //     "graphDomain": "facebook",
    //     "data_access_expiration_time": 0
    //   },
    //   "status": "connected"
    // }

    // 已登入
    if (response.status === 'connected') {
      isLogined.value = true

      // 個人資料
      getProfile()
    }
    // 未登入
    if (response.status !== 'connected') {
      isLogined.value = false
      message.value = '請登入FB'
    }
  });
}

</script>

<template>
  <h2>{{ message }}</h2>
  <div v-if="!isLogined">
    <button scope="public_profile,email" @click="login" class="border mb">
      FB登入
    </button>
  </div>
  <div v-if="isLogined">
    <button scope="public_profile,email" @click="logout" class="border mb">
      FB登出
    </button>
  </div>
  <div>
    <button ref="btnRef" scope="public_profile,email" @click="checkLoginState" class="border">
      獲取登入狀態
    </button>
  </div>
</template>

<style scoped>
.border{
  border:1px solid black
}
.mb{
  margin-bottom: 12px;
}
</style>
