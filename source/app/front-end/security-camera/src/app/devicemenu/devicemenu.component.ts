import { Component } from '@angular/core';
import { RecordingService } from '../recording.service';
import { Recording } from '../types/recording.interface';
import { DeviceService } from '../device.service';
import { Devices } from '../types/devices.interface';
import { CommonModule, KeyValuePipe, NgIf } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-devicemenu',
  standalone: true,
  imports: [CommonModule, KeyValuePipe, NgIf],
  templateUrl: './devicemenu.component.html',
  styleUrl: './devicemenu.component.css'
})
export class DevicemenuComponent {
  recordings : Recording = {}
  devices : Devices = {};
  Object = Object;
  filteredDevices : Devices = {};

  // length of devices

  searchDevices(text: string) {
    this.filteredDevices = {};
    if (text === '') {
      this.filteredDevices = this.devices;
    } else {
      Object.keys(this.devices).forEach((key, i) => {
        if (this.devices[key].deviceName.toLowerCase().includes(text.toLowerCase())) {
          this.filteredDevices[key] = this.devices[key];
        }
        if (key.toLowerCase().includes(text.toLowerCase())) {
          this.filteredDevices[key] = this.devices[key];
        }
      });
    }
    return;
  }

  openDevice(deviceID: string) {
    this.router.navigate(['/recordings', deviceID]);
  }

  constructor(
    private recordingService: RecordingService,
    private deviceService: DeviceService,
    private router: Router
  ) {}

  ngOnInit() {
    this.recordings = this.recordingService.getRecordings();
    this.devices = this.deviceService.getDevices();
    this.filteredDevices = this.devices;
  }
}
