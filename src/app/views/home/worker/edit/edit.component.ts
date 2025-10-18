import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { NgForm, FormControl, FormGroup, Validators, FormBuilder, FormArray, AbstractControl } from '@angular/forms';

//DEPENDENCIES
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";
import { ActivatedRoute, Router } from '@angular/router';

//SERVICES
import { WorkerService as CrudService } from 'src/app/services/administration/worker.service';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.scss'],
    standalone: false
})
export class EditComponent implements OnInit {
  public faArrowLeft = faArrowLeft;
  public faPlus = faPlus;
  public readOnly = false;

  bsValue = new Date();
  bsCertificationDate = new Date();
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
    private _crudService: CrudService,
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
      date: new FormControl(),
      administrators: new FormControl([]),
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

    this.route.data.subscribe((data: any) => {
      this.model = data.model.data;

      this.bsValue = new Date(this.model.date);
      const utcString = this.model.certification_date + 'T00:00:00';

      this.bsCertificationDate = new Date(this.model.certification_date ? utcString : this.model.date);
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
        administrators: this.model.administrators,
        certification_title: this.model.certification_title,
        certifying_entity: this.model.certifying_entity,

      });

      this.readOnly = (this.model.administrators.length) ? true : false;


      if (this.model.administrators.length) {
        this.form_model.get('email').disable();

      }

    });
  }

  public format(order_date = null) {
    let inputDate = (order_date) ? new Date(order_date) : new Date();
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
        const order_date = new Date(this.bsValue);
        order_date.setHours(0, 0, 0);

        const certification_date = new Date(this.bsCertificationDate);
        certification_date.setHours(0, 0, 0);

        this.form_model.patchValue({
          date: order_date,
          certification_date: certification_date
        });


        let resp = await this._crudService.update(this.form_model.get('id').value, this.form_model.value);



        this.spinner.hide();
        this.toastr.success('Técnico modificado exitosamente', 'Mensaje');



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
