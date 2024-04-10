const crypto = require("crypto")

// TODO: extract it to a storage of some sort
function getKeyPair() {
  const curve = crypto.createECDH('secp256k1')
  const pubKey = curve.generateKeys().toString('hex')
  const privKey = curve.getPrivateKey().toString('hex')
  return { pubKey, privKey }
}

module.exports = { getKeyPair }
