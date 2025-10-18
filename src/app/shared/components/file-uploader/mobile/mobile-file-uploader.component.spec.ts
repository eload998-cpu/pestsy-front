import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileFileUploaderComponent } from './mobile-file-uploader.component';

describe('MobileFileUploaderComponent', () => {
  let component: MobileFileUploaderComponent;
  let fixture: ComponentFixture<MobileFileUploaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MobileFileUploaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileFileUploaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
