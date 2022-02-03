import crypto from 'crypto';
import base32Encode from 'base32-encode';


const intToBytes = (num) => {
  const bytes = [];
  for (let i = 7; i >= 0; --i) {
    bytes[i] = num & (255);
    num = num >> 8;
  }
  return bytes;
}

const hexToBytes = (hex) => {
  const bytes = [];
  for (let c = 0, C = hex.length; c < C; c += 2) {
    bytes.push(parseInt(hex.substr(c, 2), 16));
  }
  return bytes;
}

/**
 * Generate secret with crypto package of selected length (default to 64)
 * @param {String} name
 * @param {String} account
 * @param {Array<{ secret_length: Number, algorithm: String, digits: Number, period: Number }>} [opts]
 * @returns {Array<{ secret: String, secret_b32: String, uri: String, qr: String }}
 */
const generateSecret = (name, account, opts) => {
  const config = {
    name: encodeURIComponent(name || 'App'),
    account: encodeURIComponent(account || ''),
    secret_length: Number(opts?.secret_length) || 64,
    algorithm: opts?.algorithm || 'SHA1',
    digits: Number(opts?.digits) || 6,
    period: Number(opts?.period) || 30,
  }

  const secret = crypto.randomBytes(config.secret_length).toString('base64url');
  const secret_b32 = base32Encode(Buffer.from(secret), 'RFC4648', { padding: false });

  const uri = `otpauth://totp/${config.name}:${config.account}?secret=${secret_b32}&issuer=${config.name}&algorithm=${config.algorithm}&digits=${config.digits}&period=${config.period}`;

  return {
    secret,
    secret_b32,
    uri,
    qr: `https://chart.googleapis.com/chart?chs=166x166&chld=L|0&cht=qr&chl=${encodeURIComponent(uri)}`,
  }
}

/**
 * Generate token for current or selected time
 * @param {String} secret 
 * @param {Array<{ time: Date, period: Number, digits: Number, algorithm: String, counter: Number }>} [opts] 
 * @returns {String|null}
 */
const generateToken = (secret, opts) => {
  if (!secret || typeof secret !== 'string') return null;

  const config = {
    time: opts?.time || Date.now(),
    period: Number(opts?.period) || 30,
    digits: Number(opts?.digits) || 6,
    algorithm: opts?.algorithm || 'SHA1',
  }

  const counter = opts?.counter || Math.floor((config.time / 1000) / config.period);

  const b = Buffer.from(intToBytes(counter));
  const hmac = crypto.createHmac(config.algorithm, Buffer.from(secret));

  const digest = hmac.update(b).digest('hex');

  let digest_length = 19;
  switch (config.algorithm.toUpperCase()) {
    case 'SHA1':
      digest_length = 19;
      break;
    case 'SHA256':
      digest_length = 31;
      break;
    case 'SHA512':
      digest_length = 63;
      break;
    default:
      console.warn('Are you using valid algorithm? Only SHA1, SHA256 & SHA512 are supported!');
      break;
  }

  const h = hexToBytes(digest);

  const offset = h[digest_length] & 0xf;

  let v = (h[offset] & 0x7f) << 24 |
    (h[offset + 1] & 0xff) << 16 |
    (h[offset + 2] & 0xff) << 8 |
    (h[offset + 3] & 0xff);

  v = String(v % Math.pow(10, config.digits));
  return new Array((config.digits + 1) - v.length).join('0') + v;
}

/**
 * Verifies if supplied token is valid
 * @param {String} token
 * @param {String} secret 
 * @param {Array<{time: Date, period: Number, window: Number, digits: Number, algorithm: String}>} [opts] 
 * @returns {Boolean} true if token is valid
 */
const verifyToken = (token, secret, opts) => {
  if (!token || typeof token !== 'string') return false;
  if (!secret || typeof secret !== 'string') return false;

  const config = {
    time: opts?.time || Date.now(),
    period: Number(opts?.period) || 30,
    window: Number(opts?.window) || 2,
  }

  let counter = Math.floor((config.time / 1000) / config.period);
  for (let i = counter - config.window; i <= counter + config.window; ++i) {
    if ((generateToken(secret, { ...opts, counter: i }) ^ token) === 0) {
      return true;
    }
  }

  return false;
}

export default {
  generateSecret,
  generateToken,
  verifyToken
}
