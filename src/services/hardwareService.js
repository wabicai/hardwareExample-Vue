import { HardwareWebSdk as HardwareSDK } from "@onekeyfe/hd-web-sdk";

// UI event constants
export const UI_EVENT = "UI_EVENT";
export const UI_REQUEST = {
  REQUEST_PIN: "ui-request_pin",
  REQUEST_PASSPHRASE: "ui-request_passphrase",
  REQUEST_PASSPHRASE_ON_DEVICE: "ui-request_passphrase_on_device",
  REQUEST_BUTTON: "ui-button",
  CLOSE_UI_WINDOW: "ui-close_window",
};
export const UI_RESPONSE = {
  RECEIVE_PIN: "ui-receive_pin",
  RECEIVE_PASSPHRASE: "ui-receive_passphrase",
};

let isInitialized = false;

// Initialize the SDK
export async function initializeSDK() {
  if (isInitialized) {
    console.log("SDK already initialized");
    return HardwareSDK;
  }

  try {
    await HardwareSDK.init({
      debug: true,
      fetchConfig: true,
    });

    console.log("HardwareSDK initialized successfully");
    isInitialized = true;

    return HardwareSDK;
  } catch (error) {
    console.error("HardwareSDK initialization failed:", error);
    throw error;
  }
}

// Setup event listeners
export function setupEventListeners(
  onPinRequest,
  onPassphraseRequest,
  onButtonRequest,
  onCloseUI
) {
  HardwareSDK.on(UI_EVENT, (message) => {
    console.log("UI Event received:", message);

    if (message.type === UI_REQUEST.REQUEST_PIN) {
      onPinRequest && onPinRequest(message);
    }

    if (message.type === UI_REQUEST.REQUEST_PASSPHRASE) {
      onPassphraseRequest && onPassphraseRequest(message);
    }

    if (message.type === UI_REQUEST.REQUEST_BUTTON) {
      onButtonRequest && onButtonRequest(message);
    }

    if (message.type === UI_REQUEST.CLOSE_UI_WINDOW) {
      onCloseUI && onCloseUI(message);
    }
  });
}

// Submit PIN response
export function submitPin(pin) {
  return HardwareSDK.uiResponse({
    type: UI_RESPONSE.RECEIVE_PIN,
    payload: pin || "@@ONEKEY_INPUT_PIN_IN_DEVICE",
  });
}

// Submit Passphrase response
export function submitPassphrase(passphrase, onDevice = false, save = false) {
  return HardwareSDK.uiResponse({
    type: UI_RESPONSE.RECEIVE_PASSPHRASE,
    payload: {
      value: passphrase || "",
      passphraseOnDevice: onDevice,
      save: save,
    },
  });
}

// Search for devices
export async function searchDevices() {
  try {
    const result = await HardwareSDK.searchDevices();
    console.log("Search devices result:", result);
    return result;
  } catch (error) {
    console.error("Search devices error:", error);
    throw error;
  }
}

// Get BTC address
export async function btcGetAddress(
  connectId,
  deviceId,
  path,
  showOnOneKey = false,
  useEmptyPassphrase = true
) {
  try {
    const params = {
      path,
      coin: "btc",
      showOnOneKey,
      useEmptyPassphrase,
    };

    const result = await HardwareSDK.btcGetAddress(connectId, deviceId, params);
    console.log("BTC address result:", result);
    return result;
  } catch (error) {
    console.error("Get BTC address error:", error);
    throw error;
  }
}

// Get EVM address
export async function evmGetAddress(
  connectId,
  deviceId,
  path,
  chainId = 1,
  showOnOneKey = false,
  useEmptyPassphrase = true
) {
  try {
    const params = {
      path,
      chainId,
      showOnOneKey,
      useEmptyPassphrase,
    };

    const result = await HardwareSDK.evmGetAddress(connectId, deviceId, params);
    console.log("EVM address result:", result);
    return result;
  } catch (error) {
    console.error("Get EVM address error:", error);
    throw error;
  }
}

// Check firmware release
export async function checkFirmwareRelease(connectId, deviceId) {
  try {
    const result = await HardwareSDK.checkFirmwareRelease(connectId, deviceId);
    console.log("Firmware release result:", result);
    return result;
  } catch (error) {
    console.error("Check firmware release error:", error);
    throw error;
  }
}

// Check BLE firmware release
export async function checkBLEFirmwareRelease(connectId, deviceId) {
  try {
    const result = await HardwareSDK.checkBLEFirmwareRelease(
      connectId,
      deviceId
    );
    console.log("BLE firmware release result:", result);
    return result;
  } catch (error) {
    console.error("Check BLE firmware release error:", error);
    throw error;
  }
}
