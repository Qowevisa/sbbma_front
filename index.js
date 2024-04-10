const { app, BrowserWindow, ipcMain, nativeTheme } = require('electron/main')
const path = require('node:path')
const { Web3 } = require('web3');
const { getHandshakeContract } = require('./contracts');
const HandshakeListener = require('./listener')
const crypto = require("crypto")

const curve = crypto.createECDH('secp521r1');
const ganacheURL = "ws://127.0.0.1:8545"
const web3 = new Web3(ganacheURL)
const { abi: handshakeContractABI, address: handshakeContractAddress } = getHandshakeContract()
const handshakeContract = new web3.eth.Contract(handshakeContractABI, handshakeContractAddress);
let listener = null
let keyPair = null;
let connections = new Map();
let handshakes = new Map();
let sharedSecret = null;

let connectingPopup = null;
let mainWindow = null;
let connectedAddress = null;

function stripHexPrefix(hexString) {
  if (hexString.startsWith('0x')) {
    return hexString.slice(2);
  }
  return hexString;
}

function createConnectingPopup() {
  connectingPopup = new BrowserWindow({
    width: 400,
    height: 200,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  connectingPopup.loadFile('./popup/popup.html');
  // connectingPopup.webContents.openDevTools();

  // Handle cleanup
  connectingPopup.on('closed', () => {
    connectingPopup = null;
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 1024,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })
  mainWindow.loadFile('index.html')
  // mainWindow.webContents.openDevTools();
}

ipcMain.handle('web3:connect', (event, address) => {
  const account = web3.eth.accounts.wallet.add(address)
  if (connectingPopup) {
    connectingPopup.close()
  }
  connectedAddress = {
    Address: account[0].address,
    PrivKey: account[0].privateKey
  }
  console.log("connectedAddress = ", connectedAddress)
  mainWindow.webContents.send('update-address', connectedAddress.Address);
  //
  listener = new HandshakeListener(handshakeContract, connectedAddress.Address);
  listener.on('initiated', (data) => {
    // Bob part : 2
    // calculating shared secret under connections will be under acceptConnection function
    const otherKeyWithoutPrefix = stripHexPrefix(data.publicKeyInitiator)
    const obj = {
      pubKey: otherKeyWithoutPrefix
    }
    handshakes.set(data.initiator, obj)
    console.log("ADDED :2 to handshakes under ", data.initiator, " value = ", obj)
    mainWindow.webContents.send('handshake-initiated', data);
  });
  listener.on('accepted', (data) => {
    // Alice part : 4
    // calculating shared secret can be done now
    console.log("DATA::::4 = ", data)
    const otherKeyWithoutPrefix = stripHexPrefix(data.publicKeyRecipient)
    console.log("otherKeyWithoutPrefix:4 == ", otherKeyWithoutPrefix)
    const obj1 = {
      pubKey: otherKeyWithoutPrefix
    }
    handshakes.set(data.recipient, obj1)
    console.log("ADDED :4 to handshakes under ", data.recipient, " value = ", obj1);
    // shared secret
    const otherPart = handshakes.get(data.recipient)
    console.log("otherPart:4 = ", otherPart)
    console.log("otherPart.pubKey:4 = ", otherKeyWithoutPrefix)
    sharedSecret = curve.computeSecret(otherKeyWithoutPrefix, 'hex', 'hex')
    const obj = {
      myKey: keyPair.pubKey,
      otherKey: otherPart.pubKey,
      sharedSecret: sharedSecret,
    }
    connections.set(data.recipient, obj);
    console.log("sharedSecret = ", sharedSecret)
    console.log("ADDED :4 to connections under ", data.recipient, " value = ", obj);
    //
    mainWindow.webContents.send('handshake-accepted', data);
  });
  keyPair = genKeyPair()
  console.log('Keypair Generated:', keyPair);
})

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
  nativeTheme.themeSource = 'dark'
  createConnectingPopup()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})


ipcMain.on('open-popup', () => {
  if (!connectingPopup) {
    createConnectingPopup();
  }
});

ipcMain.on('close-popup', () => {
  if (connectingPopup) {
    connectingPopup.close()
  }
});

ipcMain.on('initiate-handshake', async (_event, recipientAddress) => {
  // Alice part : 1
  console.log(`ipcMain::Initiating:1 handshake with ${recipientAddress}...`);
  if (!connectedAddress) {
    console.log("ERROR: Can't init handshake: connectedAddress is undefined")
    return
  }
  const accepted = `0x${keyPair.pubKey}`
  await handshakeContract.methods.initiateHandshake(recipientAddress, accepted).send({ from: connectedAddress.Address });
});

ipcMain.on('accept-handshake', async (_event, initiatorAddress) => {
  // Bob part : 3
  console.log(`Accepting handshake from ${initiatorAddress}...`);
  if (!connectedAddress) {
    console.log("ERROR: Can't accept handshake: connectedAddress is undefined")
    return
  }
  const accepted = `0x${keyPair.pubKey}`
  await handshakeContract.methods.acceptHandshake(initiatorAddress, accepted).send({ from: connectedAddress.Address });
  const otherPart = handshakes.get(initiatorAddress)
  console.log("otherPart:3 = ", otherPart)
  console.log("otherPart.pubKey:3 = ", otherPart.pubKey)
  sharedSecret = curve.computeSecret(otherPart.pubKey, 'hex', 'hex')
  const obj = {
    myKey: keyPair.pubKey,
    otherKey: otherPart.pubKey,
    sharedSecret: sharedSecret,
  }
  connections.set(initiatorAddress, obj);
  console.log("sharedSecret = ", sharedSecret)
  console.log("ADDED :3 to connections under ", initiatorAddress, " value = ", obj);
  mainWindow.webContents.send('updateui-accept-handshake', initiatorAddress);
});

function genKeyPair() {
  const publicKey = curve.generateKeys().toString('hex');
  const privateKey = curve.getPrivateKey().toString('hex');
  return { pubKey: publicKey, privKey: privateKey }
}
