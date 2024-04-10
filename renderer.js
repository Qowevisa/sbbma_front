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

window.api.onHandshakeAcceptEvent((_, data) => {
  console.log("onHandshakeAcceptEvent = ", data)
  const establishedConnectionsElement = document.getElementById('established-connections');
  const li = document.createElement('li');
  li.textContent = `Connection with ${data.recipient} established.`;
  establishedConnectionsElement.appendChild(li);
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

