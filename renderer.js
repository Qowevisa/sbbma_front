window.api.onUpdateAddress((_, address) => {
  document.getElementById('address-header').innerHTML = `Hello, ${address}`;
});

function initiateHandshake(recipientAddress) {
  console.log(`Initiating handshake with address = ${recipientAddress} and  `);
  window.api.initiateHandshake(recipientAddress);
}

window.api.onHandshakeInitEvent((_, data) => {
  console.log("onHandshakeInitEvent = ", data)
  const potentialConnectionsElement = document.getElementById('potential-connections');
  const li = document.createElement('li');
  li.innerHTML = `${data.initiator} <button class="accept-handshake-btn" data-initiator="${data.initiator}">Accept Connection</button>`;
  potentialConnectionsElement.appendChild(li);
})

function addButtonForMessageBox(address) {
  const buttonContainer = document.querySelector('.message-action-buttons');
  if (!buttonContainer.querySelector(`[data-address='${address}']`)) {
    const button = document.createElement('button');
    button.textContent = `Chat with ${address}`;
    button.dataset.address = address;
    button.onclick = () => {
      window.api.selectMessageBox(address);
    };
    buttonContainer.appendChild(button);
  }
}

window.api.onHandshakeAcceptEvent((_, data) => {
  console.log("onHandshakeAcceptEvent = ", data)
  const establishedConnectionsElement = document.getElementById('established-connections');
  const li = document.createElement('li');
  li.textContent = `Connection with ${data.recipient} established.`;
  establishedConnectionsElement.appendChild(li);
  addButtonForMessageBox(data.recipient)
})

window.api.debugSecret((_, secret) => {
  console.log("Shared secret = ", secret)
})

window.api.updateUIAcceptHandshake((_, address) => {
  console.log("updateUIAcceptHandshake = ", address)
  const establishedConnectionsElement = document.getElementById('established-connections');
  const li = document.createElement('li');
  li.textContent = `Connection with ${address} established.`;
  establishedConnectionsElement.appendChild(li);

  // Optionally, remove the initiator from potential connections
  Array.from(document.getElementById('potential-connections').children).forEach((child) => {
    if (child.textContent.includes(address)) {
      child.remove();
    }
  });
  addButtonForMessageBox(address)
})

window.api.updateUIMessageAppend((_, obj) => {
  const address = obj.address
  const fromOtherSide = obj.fromOtherSide
  const message = obj.message
  const messageDisplay = document.querySelector(`#messages-${address}`);
  if (messageDisplay) {
    const messageElement = document.createElement('div');
    messageElement.classList.add(fromOtherSide ? 'recipient-message' : 'my-message');
    messageElement.textContent = message;
    messageDisplay.appendChild(messageElement);
  }
})

window.api.updateUISetupMessageBox((_, address) => {
  const messagesContainer = document.getElementById('messages');
  // Clear existing content or manage multiple message boxes based on your app design
  messagesContainer.innerHTML = `<div class="message-display" id="messages-${address}"></div>
                                 <input type="text" id="message-input-${address}" placeholder="Type a message..." />
                                 <button id="send-message-${address}">Send</button>`;
  document.getElementById(`send-message-${address}`).onclick = () => {
    const inputElement = document.getElementById(`message-input-${address}`);
    const message = inputElement.value;
    window.api.sendMessage(message)
    inputElement.value = '';
  };
})

document.getElementById('main-handshake-initBtn').addEventListener('click', async () => {
  const address = document.getElementById('recipientAddress').value;
  if (address == "") {
    return
  }
  initiateHandshake(address)
});

document.getElementById('potential-connections').addEventListener('click', function(event) {
  // Check if the clicked element has the class 'accept-handshake-btn'
  if (event.target && event.target.matches('.accept-handshake-btn')) {
    const initiatorAddress = event.target.getAttribute('data-initiator');
    console.log("Accepting handshake from:", initiatorAddress);
    window.api.acceptHandshake(initiatorAddress);
  }
});

