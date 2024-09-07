import { Routes } from '@angular/router';
import { DevicemenuComponent } from './devicemenu/devicemenu.component';
import { LoginComponent } from './login/login.component';
import { VideomenuComponent } from './videomenu/videomenu.component';
import { AboutComponent } from './about/about.component';


export const routes: Routes = [
  {
    path: '',
    component: DevicemenuComponent
  },
  {
    path:'login',
    component: LoginComponent
  },
  {
    path: 'recordings/:deviceID',
    component: VideomenuComponent
  },
  {
    path: 'about',
    component: AboutComponent
  }
];