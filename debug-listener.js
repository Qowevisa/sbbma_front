const { Web3 } = require('web3');
const { getHandshakeContract, getMessageContract } = require('./contracts');
const { HandshakeListener, MessageListener } = require('./dd-listener')

const ganacheURL = "ws://127.0.0.1:8545"
const web3 = new Web3(ganacheURL)
const { abi: handshakeContractABI, address: handshakeContractAddress } = getHandshakeContract()
const { abi: messageContractABI, address: messageContractAddress } = getMessageContract()
const handshakeContract = new web3.eth.Contract(handshakeContractABI, handshakeContractAddress);
const messageContract = new web3.eth.Contract(messageContractABI, messageContractAddress);

const handshakeListener = new HandshakeListener(handshakeContract);
handshakeListener.on('initiated', (event) => {
  console.log("handshakeListener.on.initiated event = ", event)
});
handshakeListener.on('accepted', (event) => {
  console.log("handshakeListener.on.accepted event = ", event)
});
const messageListener = new MessageListener(messageContract);
messageListener.on('message', (event) => {
  console.log("messageListener.on.message event = ", event)
})

