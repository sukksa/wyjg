// let common = {
//     dataLocalStorage: {
//       Save: function (key, value) {
//         window.localStorage.setItem(key, value);
//       },
//       Get: function (key) {
//         return window.localStorage.getItem(key);
//       },
//       Remove: function (key) {
//         window.localStorage.removeItem(key);
//       },
//       Clear: function () {
//         window.localStorage.clear();
//       }
//     },

//     //dataStorage
//     dataSessionStorage: {
//       Save: function (key, value) {
//         window.sessionStorage.setItem(key, value);
//       },
//       Get: function (key) {
//         return window.sessionStorage.getItem(key);
//       },
//       Remove: function (key) {
//         window.sessionStorage.removeItem(key);
//       },
//       Clear: function () {
//         window.sessionStorage.clear();
//       }
//     },
//     dateToYMD(date) {
//       let year = date.getFullYear();
//       let month = date.getMonth() + 1;
//       let day = date.getDate();
//       if (month < 10) {
//         month = '0' + month;
//       }
//       if (day < 10) {
//         day = '0' + day;
//       }
//       return year + '-' + month + '-' + day;
//     },
//     dateToYM(date) {
//       let n_date = ''
//       if (date.indexOf(".") > -1) {
//         n_date = date.split(".")[0]
//       } else {
//         n_date = date;
//       }
//       let m_date = new Date(Date.parse(n_date.replace(/-/g, "/")));
//       let year = m_date.getFullYear();
//       let month = m_date.getMonth() + 1;
//       if (month < 10) {
//         month = '0' + month;
//       }
//       return year + '-' + month;
//     },
//     dateToYMD2(date) {
//       let n_date = ''
//       if (date.indexOf(".") > -1) {
//         n_date = date.split(".")[0]
//       } else {
//         n_date = date;
//       }
//       let m_date = new Date(Date.parse(n_date.replace(/-/g, "/")));
//       let year = m_date.getFullYear();
//       let month = m_date.getMonth() + 1;
//       let day = m_date.getDate();
//       if (month < 10) {
//         month = '0' + month;
//       }
//       if (day < 10) {
//         day = '0' + day;
//       }
//       return year + '-' + month + '-' + day;
//     },
//     getDateHour(date) {
//       let m_date = new Date(Date.parse(date.replace(/-/g, "/")));
//       let hour = m_date.getHours();
//       if (hour < 10) {
//         hour = '0' + hour;
//       }
//       return hour;
//     },
//     dateToWord(date) {
//       let year = date.getFullYear();
//       let month = date.getMonth() + 1;
//       let day = date.getDate();
//       return year + '年' + month + '月' + day + '日';
//     },
//     getLastDate(date) {
//       let m_date = new Date(date);
//       let new_date = new Date(m_date.getFullYear(), m_date.getMonth() + 1, 1); //取当年当月中的第一天
//       let end_day = new Date(new_date.getTime() - 1000 * 60 * 60 * 24).getDate();
//       let Bdate = m_date.getFullYear() + '-' + (m_date.getMonth() + 1 < 10 ? '0' : '') + (m_date.getMonth() + 1) + '-01';
//       let Edate = m_date.getFullYear() + '-' + (m_date.getMonth() + 1 < 10 ? '0' : '') + (m_date.getMonth() + 1) + '-' + (end_day < 10 ? '0' : '') + end_day;
//       let param = {
//         Bdate: Bdate,
//         Edate: Edate
//       }
//       return param; //获取当月最后一天日期
//     },
//     getDay(day) {
//       let today = new Date();
//       let targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;
//       today.setTime(targetday_milliseconds); //注意，这行是关键代码
//       let tYear = today.getFullYear();
//       let tMonth = today.getMonth();
//       let tDate = today.getDate();
//       tMonth = this.doHandleMonth(tMonth + 1);
//       tDate = this.doHandleMonth(tDate);
//       return tYear + "-" + tMonth + "-" + tDate;
//     },
//     doHandleMonth(month) {
//       let m = month;
//       if (month.toString().length == 1) {
//         m = "0" + month;
//       }
//       return m;
//     },
//     dateToMD(date) {
//       let n_date = ''
//       if (date.indexOf(".") > -1) {
//         n_date = date.split(".")[0]
//       } else {
//         n_date = date;
//       }
//       let m_date = new Date(Date.parse(n_date.replace(/-/g, "/")));
//       let month = m_date.getMonth() + 1;
//       let day = m_date.getDate();
//       if (month < 10) {
//         month = '0' + month;
//       }
//       if (day < 10) {
//         day = '0' + day;
//       }
//       return month + '-' + day;
//     },
//     dateToHMS() {
//       let m_date = new Date();
//       let hour = m_date.getHours();
//       let min = m_date.getMinutes();
//       let second = m_date.getSeconds();
//       if (hour < 10) {
//         hour = '0' + hour;
//       }
//       if (min < 10) {
//         min = '0' + min;
//       }
//       if (second < 10) {
//         second = '0' + second;
//       }
//       return hour + ':' + min + ':' + second;
//     },
//     dateToDH(date) {
//       let m_date = new Date(Date.parse(date.replace(/-/g, "/")));
//       let day = m_date.getDate();
//       let hour = m_date.getHours();
//       return day + "-" + hour;
//     },
//     dateToBig() {
//       let today = new Date();
//       let chinese = ['〇', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
//       let chineseWeek = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
//       let y = today.getFullYear().toString();
//       let m = (today.getMonth() + 1).toString();
//       let d = today.getDate().toString();
//       let day = today.getDay().toString();
//       let result = "";
//       for (let i = 0; i < y.length; i++) {
//         result += chinese[y.charAt(i)];
//       }
//       result += "年";
//       if (m.length == 2) {
//         if (m.charAt(0) == "1") {
//           result += ("十" + chinese[m.charAt(1)] + "月");
//         }
//       } else {
//         result += (chinese[m.charAt(0)] + "月");
//       }
//       if (d.length == 2) {
//         result += (chinese[d.charAt(0)] + "十" + chinese[d.charAt(1)] + "日");
//       } else {
//         result += (chinese[d.charAt(0)] + "日");
//       }
//       for (let i = 0; i < day.length; i++) {
//         result += chineseWeek[day.charAt(i)];
//       }
//       return result;
//     },
//     getYM() {
//       let m_date = new Date();
//       let year = m_date.getFullYear();
//       let month = m_date.getMonth() + 1;
//       return year + "-" + month + "-";
//     },
//     chartsColor: ["#FA8A8A", "#0C8FED", "#A7C3F6", "#00C821", "#5EDBD5"],
//     getSizeNum() {
//       return document.body.clientWidth / 1920
//       // return (document.body.clientWidth/3)/ 1920
//     },
//     getSizeNum4() {
//       return (document.body.clientWidth / 4) / 1920
//       // return (document.body.clientWidth/3)/ 1920
//     },
//     getSizeNum2() {
//       return (document.body.clientWidth / 2) / 1920;
//       // return (document.body.clientWidth /  3 * 2) / 1920;
//     },
//     pieColorList: [
//       [{
//           type: "linear",
//           x: 0,
//           y: 0,
//           x2: 1,
//           y2: 1,
//           colorStops: [{
//               offset: 0,
//               color: "#4C8BFF", // 0% 处的颜色
//             },
//             {
//               offset: 1,
//               color: "#0036BE", // 100% 处的颜色
//             },
//           ],
//           global: false, // 缺省为 false
//         },
//         "rgba(0, 84, 255, 0.3)"
//       ],
//       [{
//           type: "linear",
//           x: 0,
//           y: 0,
//           x2: 1,
//           y2: 1,
//           colorStops: [{
//               offset: 0,
//               color: "#FEDC45", // 0% 处的颜色
//             },
//             {
//               offset: 1,
//               color: "#FB7099", // 100% 处的颜色
//             },
//           ],
//           global: false, // 缺省为 false
//         },
//         "rgba(0, 84, 255, 0.3)"
//       ],
//       [{
//           type: "linear",
//           x: 0,
//           y: 0,
//           x2: 1,
//           y2: 1,
//           colorStops: [{
//               offset: 0,
//               color: "#209CFF", // 0% 处的颜色
//             },
//             {
//               offset: 1,
//               color: "#68E0CF", // 100% 处的颜色
//             },
//           ],
//           global: false, // 缺省为 false
//         },
//         "rgba(0, 84, 255, 0.3)"
//       ],
//       [{
//           type: "linear",
//           x: 0,
//           y: 0,
//           x2: 1,
//           y2: 1,
//           colorStops: [{
//               offset: 0,
//               color: "#4BE6CF", // 0% 处的颜色
//             },
//             {
//               offset: 1,
//               color: "#D4F8AE", // 100% 处的颜色
//             },
//           ],
//           global: false, // 缺省为 false
//         },
//         "rgba(0, 84, 255, 0.3)"
//       ],
//       [{
//           type: "linear",
//           x: 0,
//           y: 0,
//           x2: 1,
//           y2: 1,
//           colorStops: [{
//               offset: 0,
//               color: "#29F19C", // 0% 处的颜色
//             },
//             {
//               offset: 1,
//               color: "#02A1F9", // 100% 处的颜色
//             },
//           ],
//           global: false, // 缺省为 false
//         },
//         "rgba(0, 84, 255, 0.3)"
//       ]
//     ]
//   }
//   export default common;
import { Loading, MessageBox } from "element-ui";

let loading;

let common = {
  showLoading() {
    loading = Loading.service({
      lock: true,
      text: "Loading",
      spinner: "el-icon-loading",
      fullscreen: true,
      background: "rgba(0, 0, 0, 0)"
    });
  },
  closeLoading() {
    if (loading) {
      loading.close();
    }
  },
  dataLocalStorage: {
    Save: function (key, value) {
      window.localStorage.setItem(key, value);
    },
    Get: function (key) {
      return window.localStorage.getItem(key);
    },
    Remove: function (key) {
      window.localStorage.removeItem(key);
    },
    Clear: function () {
      window.localStorage.clear();
    }
  },

  parseQueryString(param) {
    // 搜索条件 queryString 对象 转化 字符串
    let peddingString = "";
    for (let key in param) {
      if (param[key] || param[key] === 0) {
        peddingString += key + "=" + param[key] + "&";
      }
    }
    if (peddingString.length > 0) {
      peddingString = peddingString.substring(0, peddingString.length - 1);
    }
    return peddingString;
  },
  formatDate: {
    format: function (date, pattern) {
      pattern = pattern || DEFAULT_PATTERN;
      return pattern.replace(SIGN_REGEXP, function ($0) {
        switch ($0.charAt(0)) {
          case "y":
            return padding(date.getFullYear(), $0.length);
          case "M":
            return padding(date.getMonth() + 1, $0.length);
          case "d":
            return padding(date.getDate(), $0.length);
          case "w":
            return date.getDay() + 1;
          case "h":
            return padding(date.getHours(), $0.length);
          case "m":
            return padding(date.getMinutes(), $0.length);
          case "s":
            return padding(date.getSeconds(), $0.length);
        }
      });
    },
    parse: function (dateString, pattern) {
      let matchs1 = pattern.match(SIGN_REGEXP);
      let matchs2 = dateString.match(/(\d)+/g);
      if (matchs1.length == matchs2.length) {
        let _date = new Date(1970, 0, 1);
        for (let i = 0; i < matchs1.length; i++) {
          let _int = parseInt(matchs2[i]);
          let sign = matchs1[i];
          switch (sign.charAt(0)) {
            case "y":
              _date.setFullYear(_int);
              break;
            case "M":
              _date.setMonth(_int - 1);
              break;
            case "d":
              _date.setDate(_int);
              break;
            case "h":
              _date.setHours(_int);
              break;
            case "m":
              _date.setMinutes(_int);
              break;
            case "s":
              _date.setSeconds(_int);
              break;
          }
        }
        return _date;
      }
      return null;
    }
  },

  //dataStorage
  dataSessionStorage: {
    Save: function (key, value) {
      window.sessionStorage.setItem(key, value);
    },
    Get: function (key) {
      return window.sessionStorage.getItem(key);
    },
    Remove: function (key) {
      window.sessionStorage.removeItem(key);
    },
    Clear: function () {
      window.sessionStorage.clear();
    }
  },
  dateToYMD(m_date) {
    let date = new Date(m_date);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    if (month < 10) {
      month = "0" + month;
    }
    if (day < 10) {
      day = "0" + day;
    }
    return year + "-" + month + "-" + day;
  },
  dateToYM(m_date) {
    let date = new Date(m_date);
    let year = date.getFullYear().toString().slice(-2);
    let month = date.getMonth() + 1;
    let day = date.getDate();
    if (month < 10) {
      month = "0" + month;
    }
    if (day < 10) {
      day = "0" + day;
    }
    return year + "/" + month;
  },
  dateToMD(m_date) {
    let date = new Date(m_date);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    if (month < 10) {
      month = "0" + month;
    }
    if (day < 10) {
      day = "0" + day;
    }
    return month + "-" + day;
  },
  dateToWord(date) {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    return year + "年" + month + "月" + day + "日";
  },
  getLastDate(date) {
    let m_date = new Date(date);
    let new_date = new Date(m_date.getFullYear(), m_date.getMonth() + 1, 1); //取当年当月中的第一天
    let end_day = new Date(new_date.getTime() - 1000 * 60 * 60 * 24).getDate();
    let Bdate =
      m_date.getFullYear() +
      "-" +
      (m_date.getMonth() + 1 < 10 ? "0" : "") +
      (m_date.getMonth() + 1) +
      "-01";
    let Edate =
      m_date.getFullYear() +
      "-" +
      (m_date.getMonth() + 1 < 10 ? "0" : "") +
      (m_date.getMonth() + 1) +
      "-" +
      (end_day < 10 ? "0" : "") +
      end_day;
    let param = {
      Bdate: Bdate,
      Edate: Edate
    };
    return param; //获取当月最后一天日期
  },
  getSizeNum() {
    return document.body.clientWidth / 1920;
    // return (document.body.clientWidth/3)/ 1920
  },
  getSizeNum4() {
    return document.body.clientWidth / 3 / 1920;
  },
  getSizeNum2() {
    return ((document.body.clientWidth / 3) * 2) / 1920;
  },
  getDay(day) {
    let today = new Date();
    let targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;
    today.setTime(targetday_milliseconds); //注意，这行是关键代码
    let tYear = today.getFullYear();
    let tMonth = today.getMonth();
    let tDate = today.getDate();
    tMonth = this.doHandleMonth(tMonth + 1);
    tDate = this.doHandleMonth(tDate);
    return tYear + "-" + tMonth + "-" + tDate;
  },
  doHandleMonth(month) {
    let m = month;
    if (month.toString().length == 1) {
      m = "0" + month;
    }
    return m;
  },
  dateToDH(date) {
    let m_date = new Date(Date.parse(date.replace(/-/g, "/")));
    let day = m_date.getDate();
    let hour = m_date.getHours();
    return day + "-" + hour;
  },
  getYM() {
    let m_date = new Date();
    let year = m_date.getFullYear();
    let month = m_date.getMonth() + 1;
    return year + "-" + month + "-";
  },
  //时间格式转换
  dateFormatTZ(fmt, datetime) {
    //author: meizz
    let date = new Date(datetime);
    let o = {
      "M+": date.getMonth() + 1, //月份
      "d+": date.getDate(), //日
      "h+": date.getHours(), //小时
      "m+": date.getMinutes(), //分
      "s+": date.getSeconds(), //秒
      "q+": Math.floor((date.getMonth() + 3) / 3), //季度
      S: date.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        (date.getFullYear() + "").substr(4 - RegExp.$1.length)
      );
    for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt))
        fmt = fmt.replace(
          RegExp.$1,
          RegExp.$1.length == 1
            ? o[k]
            : ("00" + o[k]).substr(("" + o[k]).length)
        );
    return fmt;
  },
  dateToMD(date) {
    let n_date = "";
    if (date.indexOf(".") > -1) {
      n_date = date.split(".")[0];
    } else {
      n_date = date;
    }
    let m_date = new Date(Date.parse(n_date.replace(/-/g, "/")));
    let month = m_date.getMonth() + 1;
    let day = m_date.getDate();
    if (month < 10) {
      month = "0" + month;
    }
    if (day < 10) {
      day = "0" + day;
    }
    return month + "-" + day;
  },
  dateToHMS() {
    let m_date = new Date();
    let hour = m_date.getHours();
    let min = m_date.getMinutes();
    let second = m_date.getSeconds();
    if (hour < 10) {
      hour = "0" + hour;
    }
    if (min < 10) {
      min = "0" + min;
    }
    if (second < 10) {
      second = "0" + second;
    }
    return hour + ":" + min + ":" + second;
  },
  dateToBig() {
    let today = new Date();
    let chinese = ["〇", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
    let chineseWeek = [
      "星期日",
      "星期一",
      "星期二",
      "星期三",
      "星期四",
      "星期五",
      "星期六"
    ];
    let y = today.getFullYear().toString();
    let m = (today.getMonth() + 1).toString();
    let d = today.getDate().toString();
    let day = today.getDay().toString();
    let result = "";
    for (let i = 0; i < y.length; i++) {
      result += chinese[y.charAt(i)];
    }
    result += "年";
    if (m.length == 2) {
      if (m.charAt(0) == "1") {
        result += "十" + chinese[m.charAt(1)] + "月";
      }
    } else {
      result += chinese[m.charAt(0)] + "月";
    }
    if (d.length == 2) {
      result += chinese[d.charAt(0)] + "十" + chinese[d.charAt(1)] + "日";
    } else {
      result += chinese[d.charAt(0)] + "日";
    }
    for (let i = 0; i < day.length; i++) {
      result += chineseWeek[day.charAt(i)];
    }
    return result;
  },
  dateToWeek() {
    let today = new Date();
    let chineseWeek = [
      "星期日",
      "星期一",
      "星期二",
      "星期三",
      "星期四",
      "星期五",
      "星期六"
    ];
    let day = today.getDay().toString();
    let result = "";
    for (let i = 0; i < day.length; i++) {
      result = chineseWeek[day.charAt(i)];
    }
    return result;
  },
  dateToDay() {
    let today = new Date();
    return today.Format("yyyy/M/d");
  },
  getCenterDay(bDay, eDay) {
    let begin = new Date(bDay).getTime();
    let end = new Date(eDay).getTime();
    let num = (end - begin) / 2;
    return this.dateToYMD(begin + num);
  },
  encode(str) {
    // 首先，我们使用 encodeURIComponent 来获得百分比编码的UTF-8，然后我们将百分比编码转换为原始字节，最后存储到btoa里面
    return btoa(
      encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function toSolidBytes(match, p1) {
        return String.fromCharCode(Number('0x' + p1))
      })
    )
  },
  decode(str) {
    // 过程：从字节流到百分比编码，再到原始字符串
    return decodeURIComponent(
      atob(str)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        })
        .join('')
    )
  },
  parseToke(str) {
    const token = str // 分割JWT的三个部分
    let base64Url = token.split('.')[1] // 将Base64Url编码的载荷解码
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/') // 获取pad的长度 // let pad = '='.repeat((4 - (base64.length % 4)) % 4) // 解码载荷
    let payload = JSON.parse(common.decode(base64))
    return payload
  },
};
export default common;
