import { Component } from '@angular/core';
import { RecordingService } from '../recording.service';
import { HttpClient } from '@angular/common/http';
import { Recording } from '../types/recording.interface';

import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import { CommonModule } from '@angular/common';
import { LoaderService } from '../loader.service';
import { Router } from '@angular/router';
import { DeviceService } from '../device.service';
import { Devices } from '../types/devices.interface';
import { DistributionService } from '../distribution.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor(
    private recordingService: RecordingService,
    private deviceService: DeviceService,
    private distributionService: DistributionService,
    private http: HttpClient,
    private loaderService: LoaderService,
    private routes: Router
  ) {}

  form!: FormGroup;

  ngOnInit():void {
    this.form = new FormGroup({
      id: new FormControl('', Validators.required),
      key: new FormControl('', Validators.required)
    });
  }

  get id() {
    return this.form.get('id');
  }

  get key() {
    return this.form.get('key');
  }

  loading:boolean = false;
  success:boolean = false;
  error:string = "";

  submitHandler() {
    this.loaderService.setLoading(true);
      // this.http.post('http://127.0.0.1:5000/login', this.form.getRawValue()).subscribe(
      this.http.post('http://127.0.0.1:5000/login', {"id":"AKIA6ODUZ53V6RT7RCPO","key":"pi5ZANHMd9OQEvp8sZ24q1LgtTBzV7afG+Cd+xEh"}).subscribe(
        {
          next: (response:any) => {
            console.log(response);
            this.recordingService.setRecordings(response["recordings"] as Recording);
            this.deviceService.setDevices(response["devices"] as Devices);
            this.distributionService.setDistribution(response["distribution"]);
            this.success = true;
            console.log("finish loading");
            console.log(this.recordingService.getRecordings());
            console.log(this.deviceService.getDevices());
            this.loaderService.setLoading(false);
            this.routes.navigate(['/']);
          },
          error: (error) => {
            console.log(error);
            switch (error.status) {
              case 0:
                this.error = "Server is not responding";
                break;
              default:
                this.error = error.error;
                break;
            }
            this.loaderService.setLoading(false);
        }
      }
      );
  }
}
