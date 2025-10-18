import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faPlus, faClose } from '@fortawesome/free-solid-svg-icons';

import { NgForm, FormControl, FormGroup, Validators, FormBuilder, FormArray, AbstractControl } from '@angular/forms';

//DEPENDENCIES
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";
import { Router } from '@angular/router';

//SERVICES
import { ClientService } from 'src/app/services/administration/client.service';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.scss'],
    standalone: false
})
export class CreateComponent implements OnInit {

  public faArrowLeft = faArrowLeft;
  public faPlus = faPlus;
  public faClose = faClose;

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
    private _clientService: ClientService,
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
      emails: this.fb.array([]),
      date: new FormControl(),


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


  get emails(): FormArray {
    return this.form_model.get("emails") as FormArray
  }

  validateInput(event) {
    const value = event.target.value;
    event.target.value = value.replace(/[^A-Za-zÀ-úñÑ ]/g, '');
  }



  public async onSubmit(): Promise<void> {

    try {


      if (this.form_model.valid) {

        this.sendingForm = true;
        this.spinner.show();

        let resp = await this._clientService.store(this.form_model.value);



        this.clearForm();
        this.spinner.hide();
        this.toastr.success('Cliente registrado exitosamente', 'Mensaje');



      }else
      {
        this.toastr.error('Rellene todos los campos del formulario', 'Error');
   
      }
    }
    finally {
      this.sendingForm = false;
      this.spinner.hide();

    }
  }


  public newElement(): FormGroup {
    return this.fb.group({
      email: ''
    })
  }

  public addElement() {
    this.emails.push(this.newElement());

  }



  public removeElement() {

    this.emails.removeAt((this.emails.value.length - 1))
  }

  private clearForm(): void {
    this.form_model.reset();

    this.form_model.patchValue({
      identification_type: "physical_id",
    });

    const emailsFormArray = <FormArray>this.form_model.get('emails');
    emailsFormArray.clear();

    this.sendingForm = false;

  }


}
