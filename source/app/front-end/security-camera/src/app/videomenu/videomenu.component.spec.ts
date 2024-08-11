import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideomenuComponent } from './videomenu.component';

describe('VideomenuComponent', () => {
  let component: VideomenuComponent;
  let fixture: ComponentFixture<VideomenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideomenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideomenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
