import { Injectable } from '@angular/core';
import { Recording } from './types/recording.interface';

@Injectable({
  providedIn: 'root'
})
export class RecordingService {
  private recordings: Recording = {};

  constructor() {}

  setRecordings(recordings: Recording) {
    this.recordings = recordings;
  }

  getRecordings(): Recording {
    return this.recordings;
  }
}
