# Twofac

is a simple 2FA implementation for Node.js.
Time-Based One-Time Password Algorithm - [RFC-6238](https://datatracker.ietf.org/doc/html/rfc6238).
This project is based on [node-2fa](https://github.com/jeremyscalpello/node-2fa) & [notp](https://github.com/guyht/notp).

### Installation
```bash
npm install twofac --save
```

### Usage
```javascript
const twofac = require("twofac");

const generated_secret = twofac.generateSecret("Unicorn company", "username");
console.log(generated_secret);
/*
{
  secret: 'MN1daU6PyEHU7gUu7m8POIZUCC723Y4zsSp0xGnc4BfZREBHJhBHTPdGCrZgi3Bg98n_TuoYsjgESS9MNsmA0g',
  secret_b32: 'JVHDCZDBKU3FA6KFJBKTOZ2VOU3W2OCQJ5EVUVKDIM3TEM2ZGR5HGU3QGB4EO3TDGRBGMWSSIVBEQSTIIJEFIUDEI5BXEWTHNEZUEZZZHBXF6VDVN5MXG2THIVJVGOKNJZZW2QJQM4',
  uri: 'otpauth://totp/Unicorn%20company:username?secret=JVHDCZDBKU3FA6KFJBKTOZ2VOU3W2OCQJ5EVUVKDIM3TEM2ZGR5HGU3QGB4EO3TDGRBGMWSSIVBEQSTIIJEFIUDEI5BXEWTHNEZUEZZZHBXF6VDVN5MXG2THIVJVGOKNJZZW2QJQM4&issuer=Unicorn%20company&algorithm=SHA1&digits=6&period=30',
  qr: 'https://chart.googleapis.com/chart?chs=166x166&chld=L|0&cht=qr&chl=otpauth%3A%2F%2Ftotp%2FUnicorn%2520company%3Ausername%3Fsecret%3DJVHDCZDBKU3FA6KFJBKTOZ2VOU3W2OCQJ5EVUVKDIM3TEM2ZGR5HGU3QGB4EO3TDGRBGMWSSIVBEQSTIIJEFIUDEI5BXEWTHNEZUEZZZHBXF6VDVN5MXG2THIVJVGOKNJZZW2QJQM4%26issuer%3DUnicorn%2520company%26algorithm%3DSHA1%26digits%3D6%26period%3D30'
}
 */

token = twofac.generateToken(secret);
console.log(token);
// 654321

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


| opts          | type     | default | description                                          |
| ------------- | -------- | :-----: | ---------------------------------------------------- |
| secret_length | `number` | `64`    | Length of generated secret                           |
| algorithm     | `string` | `SHA1`  | Hash algorithm (`SHA1`, `SHA256` or `SHA512`)        |
| digits        | `number` | `6`     | The number of digits for OTP                         |
| period        | `number` | `30`    | Time in seconds for how long is OTP valid            |
| window        | `number` | `2`     | How many counter in past and future should check too |

### License

Twofac is licensed under [MIT License](./LICENSE).
