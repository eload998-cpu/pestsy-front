import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { NgForm, FormControl, FormGroup, Validators, FormBuilder, FormArray, AbstractControl } from '@angular/forms';

//DEPENDENCIES
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";
import { ActivatedRoute, Router } from '@angular/router';

//SERVICES
import { DeviceService as CrudService } from 'src/app/services/administration/device.service';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.scss'],
    standalone: false
})
export class EditComponent implements OnInit {
  public faArrowLeft = faArrowLeft;
  public faPlus = faPlus;

  public form_model: any;
  public model_form_control: any;

  public sendingForm: boolean = false;
  private model:any;
  public is_mobile = this.sharedService.isMobile;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private _crudService: CrudService,
    private sharedService: SharedService

  ) {

    this.form_model = new FormGroup({
      _method: new FormControl('POST'),
      name: new FormControl('',
        [Validators.required,
        Validators.maxLength(40)],
      ),
      id: new FormControl(null),

    });

    this.model_form_control = this.form_model.controls;
  }



  ngOnInit(): void 
  {

    this.route.data.subscribe((data: any) => {

    this.model = data.model.data;

  
      this.form_model.patchValue({
        _method: 'PUT',
        name: this.model.name,
        id:this.model.id

      });

    });
  }


  public async onSubmit(): Promise<void> {

    try {


      if (this.form_model.valid) {

        this.sendingForm = true;
        this.spinner.show();

        let resp = await this._crudService.update(this.form_model.get('id').value,this.form_model.value);



        this.spinner.hide();
        this.toastr.success('Dispositivo modificado exitosamente', 'Mensaje');



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

  validateInput(event) {
    const value = event.target.value;
    event.target.value = value.replace(/[^A-Za-zÀ-úñÑ ]/g, '');
}


}
