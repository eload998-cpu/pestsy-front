import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import { NgForm, FormControl, FormGroup, Validators, FormBuilder, FormArray, AbstractControl } from '@angular/forms';

//DEPENDENCIES
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";
import { Router } from '@angular/router';

//SERVICES
import { WorkerService as CrudService } from 'src/app/services/administration/worker.service';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.scss'],
    standalone: false
})
export class CreateComponent implements OnInit {

  public faArrowLeft = faArrowLeft;
  public faPlus = faPlus;

  bsValue = new Date();
  bsRangeValue: Date[];
  maxDate = new Date();
  minDate = new Date();


  public form_model: any;
  public model_form_control: any;

  public sendingForm: boolean = false;
  public is_mobile = this.sharedService.isMobile;


  constructor(
    private router: Router,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private _crudService: CrudService,
    private sharedService: SharedService


  ) {
    this.minDate.setDate(this.minDate.getDate() - 1);
    this.maxDate.setDate(this.maxDate.getDate() + 7);
    this.bsRangeValue = [this.bsValue, this.maxDate];


    this.form_model = new FormGroup({
      _method: new FormControl('POST'),
      first_name: new FormControl('',
        [Validators.required,
        Validators.maxLength(20)],
      ),
      last_name: new FormControl('',
        [Validators.required,
        Validators.maxLength(20)],
      ),
      email: new FormControl('',
        [Validators.required,
        Validators.maxLength(30)],
      ),
      identification_type: new FormControl('physical_id',
        [Validators.required,
        Validators.maxLength(40)]),
      identification_number: new FormControl('',
        [Validators.required,
        Validators.maxLength(40)],
      ),
      cellphone: new FormControl('',
        [Validators.required,
        Validators.maxLength(30)],
      ),
      direction: new FormControl('',
        [Validators.required,
        Validators.maxLength(200)],
      ),
      date: new FormControl(),
      certification_title: new FormControl('',
        [Validators.required],
      ),
      certification_date: new FormControl(),
      certifying_entity: new FormControl('',
        [Validators.required]),

    });

    this.model_form_control = this.form_model.controls;
  }

  ngOnInit(): void {
  }

  public format() {
    let inputDate = new Date();
    let date, month, year;
    date = inputDate.getDate();
    month = inputDate.getMonth() + 1;
    year = inputDate.getFullYear();
    date = date.toString().padStart(2, '0');
    month = month.toString().padStart(2, '0');
    return `${date}/${month}/${year}`;
  }




  public async onSubmit(): Promise<void> {

    try {


      if (this.form_model.valid) {

        this.sendingForm = true;
        this.spinner.show();

        let resp = await this._crudService.store(this.form_model.value);



        this.clearForm();
        this.spinner.hide();
        this.toastr.success('Técnico registrado exitosamente', 'Mensaje');



      }
    }
    finally {
      this.sendingForm = false;
      this.spinner.hide();

    }
  }

  private clearForm(): void {
    this.form_model.reset();

    this.form_model.patchValue({
      identification_type: "physical_id",
    });

    this.sendingForm = false;

  }
  validateInput(event) {
    const value = event.target.value;
    event.target.value = value.replace(/[^A-Za-zÀ-úñÑ ]/g, '');
  }


}
