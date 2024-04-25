const crypto = require("crypto")

const cipherName = 'aes-256-gcm'

function encryptMessage(text, sharedSecret) {
  const hash = crypto.createHash('sha256');
  hash.update(sharedSecret);
  const secretKey = hash.digest();
  //
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(cipherName, Buffer.from(secretKey), iv);

  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');

  return {
    iv: iv.toString('hex'),
    message: encrypted.toString('hex'),
    authTag: authTag,
  };
}

function stripHexPrefix(hexString) {
  if (hexString.startsWith('0x')) {
    return hexString.slice(2);
  }
  return hexString;
}

function decryptMessage(ciphertext, sharedSecret) {
  try {
    const hash = crypto.createHash('sha256');
    hash.update(sharedSecret);
    const secretKey = hash.digest();
    //
    const ivWithoutPrefix = stripHexPrefix(ciphertext.iv)
    const iv = Buffer.from(ivWithoutPrefix, 'hex');
    const authTagWithoutPrefx = stripHexPrefix(ciphertext.authTag)
    const authTag = Buffer.from(authTagWithoutPrefx, 'hex');
    const messageWithoutPrefix = stripHexPrefix(ciphertext.message)
    const message = Buffer.from(messageWithoutPrefix, 'hex');


    const decipher = crypto.createDecipheriv(cipherName, Buffer.from(secretKey), iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(message, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return { message: decrypted.toString(), messageHex: decrypted.toString('hex') }
  } catch (error) {
    console.error(error.message)
    return { error: error }
  }
}

module.exports = { encryptMessage, decryptMessage }
