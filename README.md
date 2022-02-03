# Twofac

is a 2FA implementation for Node.js.

Inspired by [node-2fa](https://github.com/jeremyscalpello/node-2fa) & [notp](https://github.com/guyht/notp)

### Usage

`npm install twofac --save`

```javascript
const twofac = require("twofac");

const { secret, secret_b32, uri, qr } = twofac.generateSecret("Unicorn company", "username");

console.log(
  "Secret:", secret,
  "\nSecret BASE32:", secret_b32,
  "\nURI:", uri,
  "\nQR:", qr
);
/*
 * Secret: mFbYJHWtwVh_TWDJra-hAaLSsouZnrA6yD42hPXNhzh79X7QMTVdNV7AR4iOLlcUDtTUAuG6wTVqNuQKB_6IFQ
 * URI: otpauth://totp/Unicorn%20company:reeg?secret=<secret_b32>&issuer=Unicorn%20company&algorithm=SHA1&digits=6&period=30
 * QR: https://chart.googleapis.com/chart?chs=166x166&chld=L|0&cht=qr&chl=otpauth%3A%2F%2Ftotp%2FUnicorn%20company%3Areeg%3Fsecret%3D<secret_b32>%26issuer%3DUnicorn%20company%26algorithm%3DSHA1%26digits%3D6%26period%3D30
 */

token = twofac.generateToken(secret);

console.log(token);
// 123456

const is_valid = twofac.verifyToken(token, secret);

console.log("Is token valid?", is_valid);
// true / false
```

### API

```javascript
/**
 * Generate secret with crypto package of selected length (default to 64)
 * @param {String} name
 * @param {String} account
 * @param {Array<{ secret_length: Number, algorithm: String, digits: Number, period: Number }>} [opts]
 * @returns {Array<{ secret: String, secret_b32: String, uri: String, qr: String }}
 */
generateSecret(name, account, opts);
```

```javascript
/**
 * Generate token for current or selected time
 * @param {String} secret
 * @param {Array<{ time: Date, period: Number, digits: Number, algorithm: String, counter: Number }>} [opts]
 * @returns {String|null}
 */
generateToken(secret, opts);
```

```javascript
/**
 * Verifies if supplied token is valid
 * @param {String} token
 * @param {String} secret
 * @param {Array<{time: Date, period: Number, window: Number, digits: Number, algorithm: String}>} [opts]
 * @returns {Boolean} true if token is valid
 */
verifyToken(token, secret, opts);
```

### License

Twofac is licensed under [MIT License](./LICENSE).
