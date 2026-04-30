import CryptoJS from 'crypto-js'
// 加密
export function encrypt(word, keyStr) {
    keyStr = keyStr || 'www.sjrt.net'
    let key = CryptoJS.enc.Utf8.parse(keyStr) // Latin1 w8m31+Yy/Nw6thPsMpO5fg==
    let srcs = CryptoJS.enc.Utf8.parse(word)
    let encrypted = CryptoJS.AES.encrypt(srcs, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 })

    console.log(encrypted.ciphertext.toString())
    return encrypted.toString()
}

// 加密
export function encryptStr(word, keyStr) {
    keyStr = keyStr || 'www.sjrt.net'
    let key = CryptoJS.enc.Utf8.parse(keyStr)
    let srcs = CryptoJS.enc.Utf8.parse(word)
    let encrypted = CryptoJS.AES.encrypt(srcs, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 })
    return encrypted.ciphertext.toString()
}



// 解密
export function decrypt(word, keyStr) {
    keyStr = keyStr || 'www.sjrt.net'
    var key = CryptoJS.enc.Utf8.parse(keyStr) // Latin1 w8m31+Yy/Nw6thPsMpO5fg==
    var decrypt = CryptoJS.AES.decrypt(word, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 })
    return CryptoJS.enc.Utf8.stringify(decrypt).toString()
}

// 解密
export function decryptStr(word) {

    let encryptedHexStr = CryptoJS.enc.Hex.parse(word);
    let srcStr = CryptoJS.enc.Base64.stringify(encryptedHexStr);
    return decrypt(srcStr);
}

export default {
    encrypt,
    encryptStr,
    decrypt,
    decryptStr
}
