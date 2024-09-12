import { Injectable } from '@angular/core';
import { Devices } from './types/devices.interface';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  private devices: Devices = {};

  constructor() {}

  setDevices(devices: Devices) {
    this.devices = devices;
  }

  getDevices(): Devices {
    return this.devices;
  }
}
