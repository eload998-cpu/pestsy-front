import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import { NgForm, FormControl, FormGroup, Validators, FormBuilder, FormArray, AbstractControl } from '@angular/forms';
import { AuthUserService } from 'src/app/services/auth-user.service';

//DEPENDENCIES
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";
import { Router, ActivatedRoute } from '@angular/router';

//SERVICES
import { MipService as CrudService } from 'src/app/services/administration/mip.service';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';

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
  public fileObj = [];
  public msg: string = '';
  public progress: number = 0;
  public show_progress: boolean = false;



  constructor(
    private router: Router,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private _crudService: CrudService,
    private _authUserService: AuthUserService,
    private sanitizer: DomSanitizer,
    private active_route: ActivatedRoute,

  ) {



    this.form_model = new FormGroup({
      _method: new FormControl('POST'),
      files: new FormControl(''),
      client_id: new FormControl(this.active_route.snapshot.params['id']),
    });

    this.model_form_control = this.form_model.controls;

  }

  ngOnInit(): void {

  }




  public async onSubmit(): Promise<void> {

    try {


      if (this.form_model.valid) {

        this.sendingForm = true;
        this.spinner.show();
        this.show_progress = true;

        let resp = await this._crudService.store(this.form_model.value);

        setTimeout(() => {
          this.show_progress = false;

        }, 3000);

        this.emulateProgress();
        this.clearForm();
        this.spinner.hide();
        this.toastr.success('Archivo añadido exitosamente', 'Mensaje');



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

  upload(e) {
    this.fileArr = [];
    this.fileObj = [];

    const fileListAsArray = Array.from(e);
    fileListAsArray.forEach((item, i) => {
      const file = (e as HTMLInputElement);

      const url = URL.createObjectURL(file[i]);


      this.fileArr.push({ item, url: url });

    })
    this.fileArr.forEach((item) => {
      this.fileObj.push(item.item)
    })

    // Set files form control
    this.form_model.patchValue({
      files: this.fileObj
    })

    this.form_model.get('files').updateValueAndValidity()

    // Upload to server
    this._crudService.addFiles(this.form_model.value).subscribe(
      (event: HttpEvent<any>) => {
        // Rest of the code...
      },
      (error) => {
        this.progress = 0;

      },
      () => {
        // Complete progress when upload is done.
        this.progress = 100;
        this.spinner.hide();
        setTimeout(() => {
          this.progress = 0;

        }, 3000);

        this.toastr.success('Archivos añadidos exitosamente', 'Mensaje');
      }
    );
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
