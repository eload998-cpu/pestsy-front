import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesktopFileUploaderComponent } from './desktop-file-uploader.component';

describe('DesktopFileUploaderComponent', () => {
  let component: DesktopFileUploaderComponent;
  let fixture: ComponentFixture<DesktopFileUploaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DesktopFileUploaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DesktopFileUploaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
