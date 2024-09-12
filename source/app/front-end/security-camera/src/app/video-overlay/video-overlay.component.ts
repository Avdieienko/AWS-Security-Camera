import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-video-overlay',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './video-overlay.component.html',
  styleUrl: './video-overlay.component.css'
})
export class VideoOverlayComponent {
  @Input("url") recordingURL!: string;
  @Input("name") recordingName!: string;

  @Output() onHide = new EventEmitter<boolean>();

  setHide(){
    this.onHide.emit(true);
  }

  constructor() {}

  closeOverlay() {
    this.recordingURL = "";
    this.recordingName = "";
  }

  ngOnInit() {}
}
