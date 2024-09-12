import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {
  constructor() {}

  ngOnInit() {}

  openAWS(){
    window.open("https://aws.amazon.com/");
  }

  openGithub(){
    window.open("https://github.com/Avdieienko/AWS-Security-Camera");
  }

}
