import http from "../utils/http";
import configs from "../../public";

export function login(param) {
  // 登陆
  let url = `/api/iotAdmin/Authorize/Login`;
  return http.getToken(url, param, configs.baseURL).then((data) => {
    return data;
  });
}
