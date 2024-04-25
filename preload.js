const { contextBridge, ipcRenderer } = require('electron/renderer');

contextBridge.exposeInMainWorld('darkMode', {
  toggle: () => ipcRenderer.invoke('dark-mode:toggle'),
  system: () => ipcRenderer.invoke('dark-mode:system')
})

contextBridge.exposeInMainWorld('web3', {
  connect: (address) => ipcRenderer.invoke('web3:connect', address)
})

contextBridge.exposeInMainWorld('popup', {
  close: () => ipcRenderer.invoke('close-popup')
})

contextBridge.exposeInMainWorld('api', {
  onUpdateAddress: (callback) => ipcRenderer.on('update-address', callback),
  onHandshakeInitEvent: (callback) => ipcRenderer.on('handshake-initiated', callback),
  onHandshakeAcceptEvent: (callback) => ipcRenderer.on('handshake-accepted', callback),
  debugSecret: (callback) => ipcRenderer.on('debug-secret', callback),
  initiateHandshake: (recipientAddress, publicKey) => ipcRenderer.send('initiate-handshake', recipientAddress, publicKey),
  acceptHandshake: (initiatorAddress, publicKeyRecipient) => ipcRenderer.send('accept-handshake', initiatorAddress, publicKeyRecipient),
  updateUIAcceptHandshake: (callback) => ipcRenderer.on('updateui-accept-handshake', callback),
  updateUIMessageAppend: (callback) => ipcRenderer.on('updateui-message-append', callback),
  updateUISetupMessageBox: (callback) => ipcRenderer.on('updateui-setup-message-box', callback),
  selectMessageBox: (address) => ipcRenderer.send('select-message-box', address),
  sendMessage: (plaintext) => ipcRenderer.send('send-message', plaintext)
});
