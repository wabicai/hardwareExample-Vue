# OneKey Hardware Demo - Vue 3

This is a Vue 3 demo application that demonstrates how to integrate with OneKey hardware wallets using the `@onekeyfe/hd-web-sdk` package.

## Features

- Search for OneKey devices
- Connect to selected device
- PIN code input (both on computer and device)
- Passphrase input (both on computer and device)
- Button confirmation handling
- Get BTC addresses
- Get EVM addresses (Ethereum, etc.)
- Check firmware and BLE firmware release information

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- OneKey hardware wallet

## Getting Started

1. Install dependencies:

```bash
npm install
# or
yarn
```

2. Start the development server:

```bash
npm run dev
# or
yarn dev
```

3. Open your browser and navigate to http://localhost:3000

## Usage

1. Click "Search Devices" to find available OneKey hardware wallets
2. Select a device from the list
3. Use the action buttons to interact with the device:
   - Get Features: Retrieves device information
   - Get BTC Address: Generates a Bitcoin address using the standard derivation path
   - Get ETH/EVM Address: Generates an Ethereum address using the standard derivation path 
   - Check Firmware: Checks if firmware updates are available
   - Check BLE Firmware: Checks if BLE firmware updates are available (for compatible devices)

## PIN and Passphrase Handling

The demo application includes custom PIN and passphrase input dialogs:

- PIN Input: Shows a PIN pad with the same layout as the OneKey device (7-8-9, 4-5-6, 1-2-3)
- Passphrase Input: Allows entering a custom passphrase or choosing to enter it directly on the device

## Built With

- [Vue 3](https://v3.vuejs.org/) - The web framework
- [OneKey Hardware SDK](https://github.com/OneKeyHQ/hardware-js-sdk) - SDK for OneKey hardware wallet integration

## License

This project is licensed under the ISC License. 