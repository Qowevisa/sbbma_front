const fs = require('fs');
const path = require('path');

function getContractDetails(contractFilePath) {
  const contractJson = JSON.parse(fs.readFileSync(contractFilePath, 'utf8'));

  return contractJson;
}

function getContractABIAndAddress(contractJson, networkId) {
  const abi = contractJson.abi;
  if (!abi) {
    throw new Error(`Can't load abi`)
  }

  const networkData = contractJson.networks[networkId];
  if (!networkData) {
    throw new Error(`Contract not deployed on network with ID ${networkId}`);
  }
  const address = networkData.address;

  return { abi, address };
}

function getHandshakeContract() {
  const contractFilePath = path.join(__dirname, './buildContracts/Handshake.json');
  try {
    const contractJson = getContractDetails(contractFilePath);
    const networkId = '1';
    const { abi, address } = getContractABIAndAddress(contractJson, networkId);

    return { abi, address }

  } catch (error) {
    console.error('Failed to load contract details:', error);
  }
}

function getMessageContract() {
  const contractFilePath = path.join(__dirname, './buildContracts/Message.json');
  try {
    const contractJson = getContractDetails(contractFilePath);
    const networkId = '1';
    const { abi, address } = getContractABIAndAddress(contractJson, networkId);

    return { abi, address }

  } catch (error) {
    console.error('Failed to load contract details:', error);
  }
}

module.exports = { getHandshakeContract, getMessageContract };

