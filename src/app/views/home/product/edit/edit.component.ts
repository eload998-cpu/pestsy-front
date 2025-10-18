import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { NgForm, FormControl, FormGroup, Validators, FormBuilder, FormArray, AbstractControl } from '@angular/forms';

//DEPENDENCIES
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";
import { ActivatedRoute, Router } from '@angular/router';

//SERVICES
import { ProductService as CrudService } from 'src/app/services/administration/product.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { CustomValidators } from 'src/app/providers/CustomValidators';
@Component({
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.scss'],
    standalone: false
})
export class EditComponent implements OnInit {
  public faArrowLeft = faArrowLeft;
  public faPlus = faPlus;
  bsValue = new Date();

  public form_model: any;
  public model_form_control: any;

  public sendingForm: boolean = false;
  private model: any;
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
      registration_code: new FormControl('', [Validators.maxLength(40)]),
      active_ingredient: new FormControl('', [Validators.maxLength(40)]),
      concentration: new FormControl('', [Validators.max(999), Validators.min(0), CustomValidators.MaxDigitsValidator(3)]),
      batch: new FormControl(''),
      expiration_date: new FormControl(''),
      name: new FormControl('',
        [Validators.required,
        Validators.maxLength(40)],
      ),
      id: new FormControl(null),

    });

    this.model_form_control = this.form_model.controls;
  }



  ngOnInit(): void {

    this.route.data.subscribe((data: any) => {

      this.model = data.model.data;
      const utcString = this.model.expiration_date ? this.model.expiration_date + 'T00:00:00' : null;
      this.bsValue = utcString ? new Date(utcString) : null;

      this.form_model.patchValue({
        _method: 'PUT',
        registration_code: this.model.registration_code,
        active_ingredient: this.model.active_ingredient,
        concentration: this.model.concentration,
        batch: this.model.batch,
        name: this.model.name,
        id: this.model.id

      });

    });
  }


  public async onSubmit(): Promise<void> {

    try {


      if (this.form_model.valid) {

        this.sendingForm = true;
        this.spinner.show();


        const expiration_date = new Date(this.bsValue);
        expiration_date.setHours(0, 0, 0);

        this.form_model.patchValue({
          expiration_date: expiration_date,
        });


        let resp = await this._crudService.update(this.form_model.get('id').value, this.form_model.value);



        this.spinner.hide();
        this.toastr.success('Producto modificado exitosamente', 'Mensaje');



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
