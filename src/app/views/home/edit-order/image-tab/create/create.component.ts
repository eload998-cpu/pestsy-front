import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import { NgForm, FormControl, FormGroup, Validators, FormBuilder, FormArray, AbstractControl } from '@angular/forms';
import { AuthUserService } from 'src/app/services/auth-user.service';

//DEPENDENCIES
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";
import { ActivatedRoute, Router } from '@angular/router';

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
    private route: ActivatedRoute,
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
      order_id: new FormControl(this.route.snapshot.params['id']),
      images: new FormControl(''),

    });

    this.model_form_control = this.form_model.controls;


  }

  async ngOnInit(): Promise<any> {

    const deviceInfo = await Device.getInfo();

    if ((deviceInfo as unknown as DeviceInfo).platform != "web") {
      this.isMobile = true;
    }

  }



  public async onSubmit(): Promise<void> {

    try {


      if (this.form_model.valid) {

        this.sendingForm = true;
        this.spinner.show();

        let resp = await this._crudService.store(this.form_model.value);



        this.clearForm();
        this.spinner.hide();
        this.toastr.success('Lámpara añadida exitosamente', 'Mensaje');



      }
    }
    finally {
      this.sendingForm = false;
      this.spinner.hide();

    }
  }

  private clearForm(): void {
    this.form_model.reset();
    this.sendingForm = false;

  }





}
