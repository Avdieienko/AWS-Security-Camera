import { Routes } from '@angular/router';
import { DevicemenuComponent } from './devicemenu/devicemenu.component';
import { LoginComponent } from './login/login.component';
import { VideomenuComponent } from './videomenu/videomenu.component';


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
    path: 'recording',
    component: VideomenuComponent
  }
];