import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RecordingService } from '../recording.service';
import { CommonModule } from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import { DistributionService } from '../distribution.service';
import { HttpClient } from '@angular/common/http';
import { VideoOverlayComponent } from '../video-overlay/video-overlay.component';

@Component({
  selector: 'app-videomenu',
  standalone: true,
  imports: [CommonModule, MatIconModule, VideoOverlayComponent],
  templateUrl: './videomenu.component.html',
  styleUrl: './videomenu.component.css'
})
export class VideomenuComponent {
  deviceID!: string;
  recordings: { [key: string]: string[] } = {};
  hide: boolean = true;
  activeURL: string = "";
  activeName: string = "";
  Object = Object;

  constructor(
    private route:ActivatedRoute,
    private recordingService: RecordingService,
    private distributionService: DistributionService,
    private http: HttpClient
  ) {}

  changeHide(val: boolean) {
    this.hide = val;
  }

  formatTime(date: string) {
    date = date.replace(/-/g, ":");
    date = date.substring(11, date.length);
    return date;
  }

  openRecording(recordingID: string) {
    console.log(recordingID);
    this.http.post('http://127.0.0.1:5000/sign',{"distribution":this.distributionService.getDistribution(),"key":recordingID}).subscribe(
      {
        next: (response:any) => {
          console.log(response);
          this.activeURL = response["url"];
          this.activeName = recordingID;
          this.hide = false;
        },
        error: (error:any) => {
          console.log(error);
        }
      }
    );
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.deviceID = params.get('deviceID')!;
      this.recordings = this.recordingService.getRecordings()[this.deviceID];
    });
  }
}
