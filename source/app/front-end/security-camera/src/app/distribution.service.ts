import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DistributionService {
  private distribution: string = "";

  constructor() { }

  setDistribution(distribution: string) {
    this.distribution = distribution;
  }

  getDistribution(): string {
    return this.distribution;
  }
}
