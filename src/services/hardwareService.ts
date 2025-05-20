// 导入需要的方法和常量
import HardwardSdk from "@onekeyfe/hd-web-sdk";
import {
  ApiResponse,
  UIEventMessage,
  BtcAddressParams,
  EvmAddressParams,
  PassphraseParams,
} from "../types/hardware";
import { CommonParams } from "@onekeyfe/hd-core";
const { HardwareWebSdk } = HardwardSdk;

// UI event constants
export const UI_EVENT = "UI_EVENT";
export const UI_REQUEST = {
  REQUEST_PIN: "ui-request_pin",
  REQUEST_PASSPHRASE: "ui-request_passphrase",
  REQUEST_PASSPHRASE_ON_DEVICE: "ui-request_passphrase_on_device",
  REQUEST_BUTTON: "ui-button",
  CLOSE_UI_WINDOW: "ui-close_window",
} as const;

export const UI_RESPONSE = {
  RECEIVE_PIN: "ui-receive_pin",
  RECEIVE_PASSPHRASE: "ui-receive_passphrase",
} as const;

let isInitialized = false;

// Initialize the SDK
export async function initializeSDK() {
  if (isInitialized) {
    console.log("SDK already initialized");
    return HardwareWebSdk;
  }

  try {
    await HardwareWebSdk.init({
      debug: true,
      fetchConfig: true,
    });

    console.log("HardwareWebSdk initialized successfully");
    isInitialized = true;

    return HardwareWebSdk;
  } catch (error) {
    console.error("HardwareWebSdk initialization failed:", error);
    throw error;
  }
}

// Setup event listeners
export function setupEventListeners(
  onPinRequest?: (message: UIEventMessage) => void,
  onPassphraseRequest?: (message: UIEventMessage) => void,
  onButtonRequest?: (message: UIEventMessage) => void,
  onCloseUI?: (message: UIEventMessage) => void
): void {
  HardwareWebSdk.on(UI_EVENT, (message: UIEventMessage) => {
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
export function submitPin(pin: string | null): void {
  return HardwareWebSdk.uiResponse({
    type: UI_RESPONSE.RECEIVE_PIN,
    payload: pin || "@@ONEKEY_INPUT_PIN_IN_DEVICE",
  });
}

// Submit Passphrase response
export function submitPassphrase(
  passphrase: string,
  onDevice: boolean = false,
  save: boolean = false
): void {
  return HardwareWebSdk.uiResponse({
    type: UI_RESPONSE.RECEIVE_PASSPHRASE,
    payload: {
      value: passphrase || "",
      passphraseOnDevice: onDevice,
      save: save,
    } as PassphraseParams,
  });
}

// Search for devices
export async function searchDevices(): Promise<ApiResponse> {
  try {
    const result = await HardwareWebSdk.searchDevices();
    console.log("Search devices result:", result);
    return result;
  } catch (error) {
    console.error("Search devices error:", error);
    throw error;
  }
}

// Get passphrase state
export async function getPassphraseState(
  connectId: string
): Promise<ApiResponse> {
  try {
    const result = await HardwareWebSdk.getPassphraseState(connectId);
    console.log("Passphrase state result:", result);
    return result;
  } catch (error) {
    console.error("Get passphrase state error:", error);
    throw error;
  }
}

// Get BTC address
export async function btcGetAddress(
  connectId: string,
  deviceId: string,
  commonParams: CommonParams
): Promise<ApiResponse> {
  try {
    const params = {
      coin: "btc",
      showOnOneKey: false,
      ...commonParams,
    };

    const result = await HardwareWebSdk.btcGetAddress(
      connectId,
      deviceId,
      params
    );
    console.log("BTC address result:", result);
    return result;
  } catch (error) {
    console.error("Get BTC address error:", error);
    throw error;
  }
}

// Get EVM address
export async function evmGetAddress(
  connectId: string,
  deviceId: string,
  commonParams: CommonParams
): Promise<ApiResponse> {
  try {
    const params = {
      chainId: 1, // 默认以太坊主网
      showOnOneKey: false,
      ...commonParams,
    };

    const result = await HardwareWebSdk.evmGetAddress(
      connectId,
      deviceId,
      params
    );
    console.log("EVM address result:", result);
    return result;
  } catch (error) {
    console.error("Get EVM address error:", error);
    throw error;
  }
}

// Check firmware release
export async function checkFirmwareRelease(
  connectId: string,
  deviceId: string,
  commonParams?: CommonParams
): Promise<ApiResponse> {
  try {
    // 修正参数
    const result = await HardwareWebSdk.checkFirmwareRelease(connectId);
    console.log("Firmware release result:", result);
    return result;
  } catch (error) {
    console.error("Check firmware release error:", error);
    throw error;
  }
}

// Check BLE firmware release
export async function checkBLEFirmwareRelease(
  connectId: string,
  deviceId: string,
  commonParams?: CommonParams
): Promise<ApiResponse> {
  try {
    // 修正参数
    const result = await HardwareWebSdk.checkBLEFirmwareRelease(connectId);
    console.log("BLE firmware release result:", result);
    return result;
  } catch (error) {
    console.error("Check BLE firmware release error:", error);
    throw error;
  }
}
