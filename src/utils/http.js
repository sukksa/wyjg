import axios from "axios";
import router from "../router";
import { Message } from "element-ui";
import store from "../store";
import modeUrlObj from "../../public";
// axios 全局参数设置
axios.defaults.headers.post["Content-Type"] = "application/json; charset=utf-8";

// axios.interceptors.request.use((config) => {
//   //为请求头对象，添加token 验证的 Authorization 字段
//   config.headers.Authorization =
//     "Bearer " + window.localStorage.getItem("Token");
//   //在最后必须 return config

//   return config;
// });

axios.interceptors.response.use(
  (response) => {
    if (response.data.isSuccess === true) {
      return response;
    } else if (
      response.data.Code == "400" ||
      response.data.Code == "401" ||
      response.data.Code == "403" ||
      // response.data.code == "400" ||
      response.data.code == "401" ||
      response.data.code == "403"
    ) {
      // store.commit("save_show_loading", false);
      // Message.error(response.data.Msg);
      router.push("/");
      return Promise.reject(response);
    } else if (response.data.Code == "500" || response.data.code == "500") {
      // store.commit("save_show_loading", false);
      return response;
    } else {
      // store.commit("save_show_loading", false)

      return response;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);
axios.interceptors.request.use(
  (config) => {
    let token = sessionStorage.getItem("Token")
        ? sessionStorage.getItem("Token")
        : null;
      if (token) {
        config.headers["Authorization"] = "Bearer " + token;
      }
      return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);
// axios.interceptors.request.use((config) => {
//   let timestamp = new Date().getTime(); //当前的时间戳
//   if (sessionStorage.getItem("ReLoadTime") && sessionStorage.getItem("ReLoadTime") > timestamp) {
//     store.commit("save_show_loading", false);
//     utils.dataSessionStorage.Clear();
//     store.commit("save_user_info", {});
//     Message.error('登录已过期，请重新登录');
//     router.push('/login');
//     return config;
//   } else {
//     return config;
//   }
//   },
//   function (error) {
//     return Promise.reject(error);
//   });

/**
 * 返回值说明：
 *
 *  code : 0[成功]，其他失败
 *  msg ：请求成功/请求失败
 *  json : response中的data属性
 */

export default {
  /**
   * 封装get方法
   * @param url
   * @param data
   * @returns {Promise}
   */

  get: function (url, params = {}, baseUrl) {
    return new Promise((resolve, reject) => {
      axios.defaults.baseURL = baseUrl;
      console.log(baseUrl, url);
      axios
        .get(url, {
          params: params
        })
        .then((response) => {
          resolve(response.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  /**
   * 封装post请求
   * @param url
   * @param data
   * @returns {Promise}
   */

  post: async function (url, data = {}, baseUrl) {
    if (data.Token) {
      let checkTokenRes = await this.checkToken();

      console.log(checkTokenRes);
      //axios.defaults.headers.post['Authorization'] = sessionStorage.getItem('token');
      if (checkTokenRes != "") {
        //data包含token 且 token过期
        data.Token = JSON.parse(sessionStorage.getItem("userInfo")).Token;
        return new Promise((resolve, reject) => {
          axios.defaults.baseURL = baseUrl;
          axios
            .post(url, data)
            .then(
              (response) => {
                resolve(response.data);
              },
              (err) => {
                reject(err);
              }
            )
            .catch((err) => {
              reject(err);
            });
        });
      } else {
        return new Promise((resolve, reject) => {
          axios.defaults.baseURL = baseUrl;
          axios
            .post(url, data)
            .then(
              (response) => {
                resolve(response.data);
              },
              (err) => {
                reject(err);
              }
            )
            .catch((err) => {
              reject(err);
            });
        });
      }
    } else {
      return new Promise((resolve, reject) => {
        axios.defaults.baseURL = baseUrl;
        axios
          .post(url, data)
          .then(
            (response) => {
              resolve(response.data);
            },
            (err) => {
              reject(err);
            }
          )
          .catch((err) => {
            reject(err);
          });
      });
    }
  },

  /**
   * 封装put请求
   * @param url
   * @param data
   * @returns {Promise}
   */

  put: function (url, data = {}, baseUrl) {
    return new Promise((resolve, reject) => {
      axios.defaults.baseURL = baseUrl;
      axios.put(url, data).then(
        (response) => {
          resolve(response.data);
        },
        (err) => {
          reject(err);
        }
      );
    });
  },

  /**
   * 封装Delete请求
   * @param url
   * @param data
   * @returns {Promise}
   */

  delete: function (url, data = {}, baseUrl) {
    return new Promise((resolve, reject) => {
      axios.defaults.baseURL = baseUrl;
      axios.delete(url, data).then(
        (response) => {
          resolve(response.data);
        },
        (err) => {
          reject(err);
        }
      );
    });
  },
  patch: function (url, data = {}) {
    return new Promise((resolve, reject) => {
      axios.patch(url, data).then(
        (response) => {
          resolve(response.data);
        },
        (err) => {
          reject(err);
        }
      );
    });
  },
  getToken: function (url, data = {}, baseUrl) {
    return new Promise((resolve, reject) => {
      axios.defaults.baseURL = baseUrl;
      axios
        .post(url, data)
        .then(
          (response) => {
            resolve(response.data);
          },
          (err) => {
            reject(err);
          }
        )
        .catch((err) => {
          reject(err);
        });
    });
  },
  checkToken: async function () {
    // console.log(sessionStorage.getItem("ReLoadTime"))
    if (
      sessionStorage.getItem("ReLoadTime") &&
      new Date().getTime() > sessionStorage.getItem("ReLoadTime")
    ) {
      store.commit("save_show_loading", false);
      sessionStorage.clear();
      store.commit("save_common_info", {});
      store.commit("save_user_info", {});
      Message.error("登录已过期，请重新登录");
      router.push("/");
    } else {
      let expiredTime = sessionStorage.getItem("ExpiredTime");
      let userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
      let url = "/api/TokenService/GetToken";
      let param = {
        ProjId: userInfo.Tenant.TenantId
      };
      let nowDate = new Date();
      let min = nowDate.getMinutes();
      nowDate.setMinutes(min + 5);
      if (nowDate >= new Date(expiredTime)) {
        await this.getToken(url, param, modeUrlObj.baseURL).then((data) => {
          userInfo.Token = data.Data.Token;
          sessionStorage.setItem("userInfo", JSON.stringify(userInfo));
          store.commit("save_user_info", userInfo);
          sessionStorage.setItem("token", data.Data.Token);
          sessionStorage.setItem("dev_token", data.Data.Token);
          sessionStorage.setItem("ExpiredTime", data.Data.ExpiredTime);
          return data.Data.Token;
        });
      } else {
        return "";
      }
    }
  }
};
