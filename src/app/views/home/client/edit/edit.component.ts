import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faPlus, faClose } from '@fortawesome/free-solid-svg-icons';
import { NgForm, FormControl, FormGroup, Validators, FormBuilder, FormArray, AbstractControl } from '@angular/forms';

//DEPENDENCIES
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";
import { ActivatedRoute, Router } from '@angular/router';

//SERVICES
import { ClientService } from 'src/app/services/administration/client.service';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.scss'],
    standalone: false
})
export class EditComponent implements OnInit {
  public faArrowLeft = faArrowLeft;
  public faPlus = faPlus;
  public faClose = faClose;
  public readOnly = false;

  bsValue = new Date();
  bsRangeValue: Date[];
  maxDate = new Date();
  minDate = new Date();

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
    private _clientService: ClientService,
    private sharedService: SharedService


  ) {
    this.minDate.setDate(this.minDate.getDate() - 1);
    this.maxDate.setDate(this.maxDate.getDate() + 7);
    this.bsRangeValue = [this.bsValue, this.maxDate];

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
      id: new FormControl(null),
      emails: this.fb.array([]),
      date: new FormControl(),
      administrators: new FormControl([])


    });

    this.model_form_control = this.form_model.controls;
  }


  get emails(): FormArray {
    return this.form_model.get("emails") as FormArray
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


  ngOnInit(): void {

    this.route.data.subscribe((data: any) => {
      this.model = data.model.data;

      this.bsValue = new Date(this.model.date);
      this.form_model.patchValue({
        _method: 'PUT',
        first_name: this.model.first_name,
        last_name: this.model.last_name,
        email: this.model.email,
        identification_number: this.model.identification_number,
        cellphone: this.model.cellphone,
        direction: this.model.direction,
        identification_type: this.model.identification_type,
        id: this.model.id,
        administrators: this.model.administrators

      });

      this.readOnly = (this.model.administrators.length) ? true : false;


      for (const key in this.model.emails) {
        this.form_model.get("emails").push(this.fb.group({
          email: this.model.emails[key].email
        }))
      }

    });
  }


  public async onSubmit(): Promise<void> {

    try {

      if (this.form_model.valid) {

        this.sendingForm = true;
        this.spinner.show();

        const order_date = new Date(this.bsValue);
        order_date.setHours(0, 0, 0);

        this.form_model.patchValue({
          date: order_date,
        });

        let resp = await this._clientService.update(this.form_model.get('id').value, this.form_model.value);



        this.spinner.hide();
        this.toastr.success('Cliente modificado exitosamente', 'Mensaje');



      } else {
        this.toastr.error('Rellene todos los campos del formulario', 'Error');

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
