interface Device {
  deviceName: string;
  deviceType: string;
  cameraType: string;
}

export interface Devices{
  [key: string]: Device;
}