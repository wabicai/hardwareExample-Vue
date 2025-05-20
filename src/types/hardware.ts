import type { IDeviceType } from "@onekeyfe/hd-core";
// 设备信息接口
export interface DeviceInfo {
  id: string;
  name: string;
  deviceType?: IDeviceType;
  connectId?: string;
  uuid?: string;
  mac?: string;
  features?: any;
}

// SDK 通用参数接口

// API 响应接口
export interface ApiResponse<T = any> {
  success: boolean;
  payload?: T;
  error?: string;
}

// UI 事件类型
export type UIEventType =
  | "ui-request_pin"
  | "ui-request_passphrase"
  | "ui-request_passphrase_on_device"
  | "ui-button"
  | "ui-close_window";

// UI 响应类型
export type UIResponseType = "ui-receive_pin" | "ui-receive_passphrase";

// UI 事件消息
export interface UIEventMessage {
  type: UIEventType;
  payload?: any;
}

// Passphrase 参数
export interface PassphraseParams {
  value: string;
  passphraseOnDevice: boolean;
  save: boolean;
}

// 状态消息
export interface StatusMessage {
  text: string;
  type: "info" | "success" | "error" | "warning";
}

// BTC 地址参数
export interface BtcAddressParams {
  path: string;
  coin: string;
  showOnOneKey: boolean;
  passphraseState?: string;
}

// EVM 地址参数
export interface EvmAddressParams {
  path: string;
  chainId: number;
  showOnOneKey: boolean;
  passphraseState?: string;
}
