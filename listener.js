const EventEmitter = require('events');

class HandshakeListener extends EventEmitter {
  constructor(handshakeContract, publicAddress) {
    super();
    this.handshakeContract = handshakeContract;

    // HandshakeInitiated event
    const initEv = this.handshakeContract.events.HandshakeInitiated({
      filter: { recipient: publicAddress }
    })
    initEv.on('data', (event) => {
      console.log(`Listener:Handshake initiated event. I return : `, event.returnValues);
      this.emit('initiated', event.returnValues);
    })
    initEv.on('error', console.error);

    // HandshakeAccepted event
    const accpetEv = this.handshakeContract.events.HandshakeAccepted({
      filter: { initiator: publicAddress }
    })
    accpetEv.on('data', (event) => {
      console.log(`Listener:Handshake accepted event. I return : `, event.returnValues);
      this.emit('accepted', event.returnValues);
    })
    accpetEv.on('error', console.error);
  }
}

module.exports = HandshakeListener;
