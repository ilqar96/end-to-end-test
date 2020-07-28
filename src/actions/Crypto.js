import CryptoJS from "crypto-js";

export function encrypte(msg,pass) {
    try {
        let salt = CryptoJS.lib.WordArray.random(16);
        let iv = CryptoJS.lib.WordArray.random(16);
        let key = CryptoJS.PBKDF2(pass, salt, {
            keySize: 256 / 32,
            iterations: 100
        });
        let options = {mode: CryptoJS.mode.CBC, iv: iv};
        let encrypted = CryptoJS.AES.encrypt(msg, key, options).toString();
        var parsedEncrypte = CryptoJS.enc.Base64.parse(encrypted);

        let transitmessage = salt.toString() + iv.toString() + parsedEncrypte.toString(CryptoJS.enc.Hex);

        return transitmessage;
    } catch (err) {
        console.error(err);
        return "";
    }
}

export function decrypte(transitmessage,pass) {

    try {
        let salt = CryptoJS.enc.Hex.parse(transitmessage.substr(0, 32));
        let iv = CryptoJS.enc.Hex.parse(transitmessage.substr(32, 32))
        let encryptedHex = transitmessage.substring(64);
        let encryptedWords = CryptoJS.enc.Hex.parse(encryptedHex);
        let encryptedBase64 = encryptedWords.toString(CryptoJS.enc.Base64);

        let key = CryptoJS.PBKDF2(pass, salt, {
            keySize: 256 / 32,
            iterations: 100
        });

        let options = {mode: CryptoJS.mode.CBC, iv: iv};
        let decrypted = CryptoJS.AES.decrypt(encryptedBase64, key, options);

        return decrypted.toString(CryptoJS.enc.Utf8);

    } catch (err) {
        console.error(err);
        return "";
    }
}
