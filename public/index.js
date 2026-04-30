// 一些全局的config配置
const modeUrlObj = {
  // 生产环境
  production: {
    baseURL: 'https://micro.sjrt.net',
    loginURL: 'http://micro.scsztf.com:8100/api/login',
    centerUrl: 'http://micro.scsztf.com:8101/api/center',
    // thirdUrl:"common/map/getBoundary",
    fillUrl: 'http://micro.scsztf.com:8121/api/industrydata',
    commUrl: 'http://micro.scsztf.com:8102/api/comm',
  },
  // 开发环境
  development: {
    baseURL: 'http://api.agiot.sjrt.net',
    loginURL: 'http://micro.scsztf.com:8100/api/login',
    centerUrl: 'http://micro.scsztf.com:8101/api/center',
    // thirdUrl:"common/map/getBoundary",
    fillUrl: 'http://micro.scsztf.com:8121/api/industrydata',
    commUrl: 'http://micro.scsztf.com:8102/api/comm',
  },
  // 测试环境
  test: {
    baseURL: 'http://api.agiot.sjrt.net',
    loginURL: 'http://micro.scsztf.com:8100/api/login',
    centerUrl: 'http://micro.scsztf.com:8101/api/center',
    // thirdUrl:"common/map/getBoundary",
    fillUrl: 'http://micro.scsztf.com:8121/api/industrydata',
    commUrl: 'http://micro.scsztf.com:8102/api/comm',
  },
}
export default modeUrlObj[process.env.NODE_ENV]
