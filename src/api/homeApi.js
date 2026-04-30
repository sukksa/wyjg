import http from '../utils/http'
import modeUrlObj from '../../public'

export function districtGetDistrictList(param) {
  let url = `/bigdata/district/getDistrictList`
  return http.get(url, param, modeUrlObj.commUrl).then(data => {
    return data
  })
}
export function districtGetDistrictById(param) {
  let url = `/bigdata/district/getDistrictById`
  return http.get(url, param, modeUrlObj.commUrl).then(data => {
    return data
  })
}
