import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import { NgForm, FormControl, FormGroup, Validators, FormBuilder, FormArray, AbstractControl } from '@angular/forms';
import { AuthUserService } from 'src/app/services/auth-user.service';

//DEPENDENCIES
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";
import { Router } from '@angular/router';

//SERVICES
import { ImageService as CrudService } from 'src/app/services/administration/image.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Device, DeviceInfo } from "@capacitor/device";

class NamedBlob {
  blob: Blob;
  filename: string;

  constructor(blob: Blob, filename: string) {
    this.blob = blob;
    this.filename = filename;
  }
}


@Component({
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.scss'],
    standalone: false
})


export class CreateComponent implements OnInit {

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


  public isMobile: boolean = false;


  constructor(
    private router: Router,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    public _crudService: CrudService,
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







}
