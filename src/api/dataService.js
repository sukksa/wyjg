import http from "../utils/http";
import modeUrlObj from "../../public";

export function Login(param) {
  // 登陆
  let url = `/common/user`
  return http.post(url, param, modeUrlObj.loginURL).then(data => {
    return data
  })
}
export function getAllChildrenRegionTree(param) {
  // 获取某个区域下的所有子集树形(带区域中心点)
  let url = `/bigdata/getAllChildrenRegionTree`
  return http.get(url, param, modeUrlObj.centerUrl).then(data => {
    return data
  })
}

export function getData(param) {
  // 通用数据获取
  let url = `/bigdata/common/search`
  return http.post(url, param, modeUrlObj.fillUrl).then(data => {
    return data
  })
}
export function getMainList(param) {
  // 查询主体列表
  let url = `/bigdata/getMainList`
  return http.post(url, param, modeUrlObj.centerUrl).then(data => {
    return data
  })
}
export function getMainExtById(param) {
  // 查询主体扩展信息
  let url = `/app/bigData/getMainExtById`
  return http.post(url, param, modeUrlObj.commUrl).then(data => {
    return data
  })
}
export function getMainNList(param) {
  // 查询主体列表
  let url = `/app/bigData/getMainList`
  return http.post(url, param, modeUrlObj.commUrl).then(data => {
    return data
  })
}
export function getMainById(param) {
  // 查询主体信息
  let url = `/bigdata/getMainById`
  return http.get(url, param, modeUrlObj.centerUrl).then(data => {
    return data
  })
}