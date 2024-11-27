# Secure Blockchain-Based Messaging Application Front-End

This repository contains the front-end of a decentralized messaging application developed using **ElectronJS**. It interacts with the Ethereum blockchain to provide secure, encrypted communication through smart contracts.

## Features

- **Decentralized Messaging**: Messages are securely sent and retrieved from the Ethereum blockchain.
- **Key Exchange**: Uses an ECDH-based "Handshake" mechanism for secure key generation.
- **AES-256-GCM Encryption**: Ensures end-to-end encryption of all messages.
- **Cross-Platform Support**: Built with ElectronJS for compatibility with Windows, macOS, and Linux.

## Prerequisites

- Node.js (v20 or higher)
- npm or yarn
- Ganache

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Qowevisa/sbbma_front
   cd sbbma_front
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the application:
   ```bash
   npm run dev
   ```

## Usage

1. Connect to your Ethereum test wallet on Ganache.
2. Interact with the "Handshake" and "Message" smart contracts deployed on the Ethereum blockchain.
3. Send and retrieve encrypted messages securely.
