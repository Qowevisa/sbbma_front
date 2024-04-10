const fs = require('fs');
const path = require('path');
const crypto = require('crypto')

function storeNewKeyPair(filename) {
  const pathToFile = path.join(__dirname, 'storage', filename + '.json')
  const ecdh = crypto.createECDH('secp256k1');
  const publicKey = ecdh.generateKeys();
  const privateKey = ecdh.getPrivateKey();
  const keyObject = {
    publicKey: publicKey.toString('hex'),
    privateKey: privateKey.toString('hex'),
  };
  fs.writeFile(pathToFile, JSON.stringify(keyObject, null, 2), 'utf8', (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
  });
}

function findKeyPair(filename) {
  const pathToFile = path.join(__dirname, 'storage', filename + '.json');
  return new Promise((resolve, reject) => {
    fs.access(pathToFile, fs.constants.F_OK, (err) => {
      if (err) {
        // file not found
        resolve(null);
        return;
      }
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          reject(err);
          return;
        }
        try {
          const keyObject = JSON.parse(data);
          resolve(keyObject);
        } catch (parseErr) {
          reject(parseErr);
        }
      });
    });
  });
}

module.exports = { storeNewKeyPair, findKeyPair }
