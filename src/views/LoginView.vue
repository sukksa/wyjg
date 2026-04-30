<template>
  <div class="login" id="login">
    <div>
      威远县秸秆资源数字化系统
      <!-- <img src="../assets/interTitle.png" alt="" /> -->
    </div>
    <div class="tool-menu">
      <img src="@/assets/refresh.png" alt="" class="refresh" @click="$router.go(0)" />
      <img
        class="full"
        v-if="!isfull"
        style="cursor: pointer"
        src="@/assets/full.png"
        @click="handleFullScreen"
        alt="" />
      <img class="full" v-else style="cursor: pointer" src="@/assets/nofull.png" @click="handleFullScreen" alt="" />
    </div>
    <div>
      <p>欢迎登录</p>
      <div class="uname">
        <img src="../assets/mine.png" alt="" />
        <p>账号</p>
        <input type="text" name="" id="" v-model="username" />
      </div>
      <div class="pwd">
        <img src="../assets/pwd.png" alt="" />
        <p>密码</p>
        <input type="password" name="" id="" v-model="password" />
      </div>
      <div class="forGet">
        <input type="checkbox" name="" id="" :checked="checked" @change="onChange" />
        <p>记住密码</p>
      </div>
      <div class="loginBtn" @click="sureLogin">登录</div>
    </div>
  </div>
</template>
<script>
import { Login, iotLogin } from '../api/dataService'
import common from '@/utils/utils'
import screenfull from 'screenfull'
export default {
  data() {
    return {
      checked: true,
      username: '',
      password: '',
      edition: 1,
      isfull: false,
    }
  },
  methods: {
    handleFullScreen() {
      if (!screenfull.isEnabled) {
        ElMessage.warning('您的浏览器不支持全屏功能')
        return
      }
      screenfull.toggle()
    },
    changeIcon() {
      this.isfull = screenfull.isFullscreen
    },
    keydownF11(event) {
      if (event.code === 'F11') {
        event.preventDefault() // 阻止F11原生全屏
        screenfull.toggle()
      }
    },
    onChange(e) {
      this.checked = e.target.checked
    },
    sureLogin() {
      let param = {
        name: this.username,
        password: this.password,
      }
      Login(param).then(res => {
        console.log(res)

        if (res.isSuccess) {
          this.$message({
            showClose: true,
            message: '登录成功',
            type: 'success',
          })
          // this.iotLogin();
          // console.log(res, "------------------------");
          let userInfo = common.parseToke(res.data.token)
          console.log(userInfo)
          sessionStorage.setItem('userInfo', JSON.stringify(userInfo))
          sessionStorage.setItem('Token', res.data.token)
          localStorage.setItem('loginRe', this.checked)
          // sessionStorage.setItem('Id', res.Data.user.uid)
          // sessionStorage.setItem('tenantInfo', JSON.stringify(res.Data.Tenant))
          // sessionStorage.setItem('userInfo', JSON.stringify(res.Data.user))
          // sessionStorage.setItem('Lng', res.Data.Tenant.lng)
          // sessionStorage.setItem('Lat', res.Data.Tenant.lat)
          // sessionStorage.setItem("MapZoom", res.data.tenant.MapZoom);
          if (this.checked) {
            // localStorage.setItem("username", name);
            // localStorage.setItem("userpwd", password);

            localStorage.setItem('userName', this.username)
            localStorage.setItem('userPwd', this.password)
          }
          this.$router.push({ path: '/home' })
        } else {
          this.$message({
            showClose: true,
            message: '账号或密码错误',
            type: 'error',
          })
        }
      })
    },
  },
  mounted() {
    if (screenfull.isEnabled) {
      screenfull.on('change', this.changeIcon)
      this.isfull = screenfull.isFullscreen
    }
    window.addEventListener('keydown', event => this.keydownF11(event))

    this.checked = localStorage.getItem('loginRe') == 'true'
    if (this.checked) {
      var name = localStorage.getItem('userName')
      var pwd = localStorage.getItem('userPwd')
      if (name) {
        this.username = name
      }
      if (pwd) {
        this.password = pwd
      }
    }
    // this.loadMapData();
  },
  beforeMount() {
    window.removeEventListener('keydown', event => this.keydownF11(event))
  },
}
</script>
<style lang="scss">
.login {
  width: 100%;
  height: calc(100vh / var(--screen-scale-y, 1));

  background: url('../assets/loginBg.png') no-repeat;
  background-size: 100% 100%;
  display: flex;
  justify-content: center;
  align-content: flex-start;
  flex-wrap: wrap;
}
.login > img {
  width: 1028px;
  height: 77px;
}
.login > div:first-child {
  font-weight: bold;
  font-size: 38px;
  color: #ffffff;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 120px;
}
.login > div:last-child {
  width: 700px;
  height: 500px;
  background: url('../assets/loginBox.png') no-repeat;
  background-size: 100% 100%;
  margin-top: 8vh;
  display: flex;
  justify-content: center;
  align-content: flex-start;
  flex-wrap: wrap;
}
.login > div:last-child > p {
  width: 90%;
  text-align: center;
  font-size: 32px;
  font-family: Source Han Sans CN;
  font-weight: bold;
  color: #ffffff;
  margin-top: 50px;
}
.uname {
  width: 70%;
  height: 50px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background: rgba(3, 44, 127, 0.4);
  border: 2px solid #ffffff;
  margin-top: 48px;
  border-radius: 12px;
}
.pwd {
  width: 70%;
  height: 50px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background: rgba(3, 44, 127, 0.4);
  border: 2px solid #ffffff;
  margin-top: 48px;
  border-radius: 12px;
}
.login > div:last-child > div > p {
  font-size: 20px;
  font-family: Source Han Sans CN;
  font-weight: 300;
  color: #ffffff;
  margin-left: 10px;
}
.login > div:last-child > div > img {
  margin-left: 14px;
}
.login > div:last-child > div > input {
  width: 70%;
  height: 100%;
  border: none;
  outline: none;
  background-color: rgba(3, 44, 127, 0.4);
  padding-left: 15px;
  font-size: 20px;
  font-family: Source Han Sans CN;
  font-weight: 300;
  color: #ffffff;
}
.forGet {
  width: 70%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-top: 13px;
}
.forGet > p {
  font-size: 16px !important;
  font-family: Source Han Sans CN;
  font-weight: 400;
  color: #ffffff;
}
.forGet > input {
  width: 16px !important;
  height: 16px !important;
  margin-right: 12px !important;
}
.loginBtn {
  width: 70%;
  height: 60px;
  background: url('../assets/loginbtnBg.png') no-repeat;
  background-size: 100% 100%;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 36px;
  font-weight: bold;
  color: #ffffff;
  margin-top: 50px;
  text-shadow: 0px 4px 8px #020bcc;
}
</style>
<style lang="scss" scoped>
.tool-menu {
  position: absolute;
  top: 48px;
  right: 48px;
  width: 90px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
