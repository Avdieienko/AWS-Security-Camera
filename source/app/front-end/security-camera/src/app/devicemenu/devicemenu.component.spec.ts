import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevicemenuComponent } from './devicemenu.component';

describe('DevicemenuComponent', () => {
  let component: DevicemenuComponent;
  let fixture: ComponentFixture<DevicemenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DevicemenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DevicemenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
