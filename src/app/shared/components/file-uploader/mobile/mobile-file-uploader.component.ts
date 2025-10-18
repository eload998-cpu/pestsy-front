import { Component, OnInit, Input } from '@angular/core';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { AuthUserService } from 'src/app/services/auth-user.service';

//DEPENDENCIES
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";
import { Router } from '@angular/router';

//SERVICES
import { HttpEvent } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import pica from 'pica';
import { Device, DeviceInfo } from "@capacitor/device";
import { Camera, CameraResultType } from '@capacitor/camera';
import { CameraSource } from '@capacitor/camera';
import { HttpEventType, HttpResponse } from '@angular/common/http';

class NamedBlob {
  blob: Blob;
  filename: string;

  constructor(blob: Blob, filename: string) {
    this.blob = blob;
    this.filename = filename;
  }
}


@Component({
    selector: 'mobile-file-uploader',
    templateUrl: './mobile-file-uploader.component.html',
    styleUrls: ['./mobile-file-uploader.component.scss'],
    standalone: false
})
export class MobileFileUploaderComponent implements OnInit {

  public faArrowLeft = faArrowLeft;
  public faPlus = faPlus;

  public form_model: any;
  public model_form_control: any;
  public last_order: any;
  public sendingForm: boolean = false;

  public fileArr = [];
  public fileImageArr = [];

  public imgArr = [];
  public mobileImgArr = [];

  public fileObj = [];
  public msg: string = '';
  public progress: number = 0;

  public show_progress: boolean = false;

  public isMobile: boolean = false;
  public imageThumbnail: string = "";
  @Input() _crudService: any;
  @Input() order_id: number = 0;


  constructor(
    private router: Router,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private _authUserService: AuthUserService,
    private sanitizer: DomSanitizer

  ) {



    this.form_model = new FormGroup({
      _method: new FormControl('POST'),
      order_id: new FormControl(''),
      images: new FormControl(''),

    });

    this.model_form_control = this.form_model.controls;

    this._authUserService.userObservable.subscribe(
      (authUser: any) => {
        if (authUser) {
          this.form_model.patchValue({
            order_id: authUser.last_order.id
          });
        }
      }
    );
  }

  async ngOnInit(): Promise<any> {

    const deviceInfo = await Device.getInfo();

    if ((deviceInfo as unknown as DeviceInfo).platform != "web") {
      this.isMobile = true;
    }

  }


  public async takePicture() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt
    });


    this.mobileImgArr.push({ "url": image.dataUrl });
    this.upload(image);
  };






  async upload(image) {
    this.fileArr = [];
    this.fileObj = [];

    let format = image.format;
    // Create a blob from the base64 data
    const response = await fetch(image.dataUrl);
    const blob = await response.blob();
    const fileName = `photo_${new Date().getTime()}.${format}`;

    const file = new File([blob], fileName, { type: `image/${format}` });
    // Create an offscreen image, load the file data into it
    const offScreenImage = new Image();
    offScreenImage.src = URL.createObjectURL(file);
    await offScreenImage.decode(); // Wait for the image to be loaded

    // Set a maximum size for our resized images
    const MAX_WIDTH = 650;
    const MAX_HEIGHT = 650;

    // Calculate new image dimensions, maintaining aspect ratio
    let { width, height } = offScreenImage;
    if (width > height) {
      if (width > MAX_WIDTH) {
        height *= MAX_WIDTH / width;
        width = MAX_WIDTH;
      }
    } else {
      if (height > MAX_HEIGHT) {
        width *= MAX_HEIGHT / height;
        height = MAX_HEIGHT;
      }
    }

    // Create an offscreen canvas and context
    const offScreenCanvas = document.createElement('canvas');
    offScreenCanvas.width = Math.floor(width);
    offScreenCanvas.height = Math.floor(height);
    const context = offScreenCanvas.getContext('2d');

    // Use Pica to resize the image
    const picaResizer = pica();
    await picaResizer.resize(offScreenImage, offScreenCanvas);
    const JPEG_QUALITY = 0.7; // You can adjust this value. 0.7 is typically a good balance

    const resizedBlob = await new Promise<NamedBlob>((resolve) =>
      offScreenCanvas.toBlob((blob) => resolve(new NamedBlob(blob, file.name)), file.type, JPEG_QUALITY)
    );

    const url = URL.createObjectURL(file);
    this.fileImageArr.push({ file, url: url });
    this.fileArr.push({ resizedBlob });





    this.fileArr.forEach((item) => {
      this.fileObj.push(item)
    })

    // Set files form control
    this.form_model.patchValue({
      images: this.fileObj,
      order_id: this.order_id
    });

    this.form_model.get('images').updateValueAndValidity()


    // Upload to server
    this.spinner.show();
    this.show_progress = true;

    this._crudService.addFiles(this.form_model.value).subscribe(
      (event: HttpEvent<any>) => {
        if (event.type === HttpEventType.Response) {

          if (event.body.success) {
            this.toastr.success(event.body.message, 'Mensaje');

          } else {
            this.toastr.error(event.body.message, 'Mensaje');

          }
        }
      },
      (error) => {
        this.show_progress = false;
      },
      () => {
        // Complete progress when upload is done.
        this.progress = 100;
        this.spinner.hide();

        setTimeout(() => {
          this.show_progress = false;

        }, 3000);
      }
    );


    this.emulateProgress();
  }

  // Clean Url
  sanitize(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  private emulateProgress() {
    setTimeout(() => {
      if (this.progress < 100) {
        // Increment progress.
        this.progress += Math.floor(Math.random() * 10 + 1);

        // Make sure progress doesn't exceed 100.
        this.progress = Math.min(this.progress, 100);

        // Continue incrementing.
        this.emulateProgress();
      }
    }, 500);
  }





}