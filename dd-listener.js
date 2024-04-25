const EventEmitter = require('events');

class HandshakeListener extends EventEmitter {
  constructor(handshakeContract) {
    super();
    this.handshakeContract = handshakeContract;

    // HandshakeInitiated event
    const initEv = this.handshakeContract.events.HandshakeInitiated()
    initEv.on('data', (event) => {
      console.log(`Listener:Handshake initiated event. I return : `, event.returnValues);
      this.emit('initiated', event.returnValues);
    })
    initEv.on('error', console.error);

    // HandshakeAccepted event
    const accpetEv = this.handshakeContract.events.HandshakeAccepted()
    accpetEv.on('data', (event) => {
      console.log(`Listener:Handshake accepted event. I return : `, event.returnValues);
      this.emit('accepted', event.returnValues);
    })
    accpetEv.on('error', console.error);
  }
}

class MessageListener extends EventEmitter {
  constructor(messageContract) {
    super();
    this.messageContract = messageContract;

    // MessageSent event
    const msgEv = this.messageContract.events.MessageSent()
    msgEv.on('data', (event) => {
      console.log(`Listener:Message messageSent event. I return : `, event.returnValues);
      this.emit('message', event.returnValues);
    })
    msgEv.on('error', console.error);
  }
}


module.exports = { HandshakeListener, MessageListener };
