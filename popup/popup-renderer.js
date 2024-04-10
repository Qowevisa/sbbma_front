document.getElementById('popup-connect-connectBtn').addEventListener('click', async () => {
  const privKey = document.getElementById('popup-connect-walletAddress').value;
  console.log("privKey = ", privKey)
  if (privKey == "") {
    return
  }
  await window.web3.connect(privKey)
});

