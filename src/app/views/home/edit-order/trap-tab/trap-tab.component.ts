import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import { NgForm, FormControl, FormGroup, Validators, FormBuilder, FormArray, AbstractControl } from '@angular/forms';

//DEPENDENCIES
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";
import { Router } from '@angular/router';

//SERVICES
import { AplicationService as CrudService } from 'src/app/services/administration/aplication.service';

@Component({
    templateUrl: './trap-tab.component.html',
    styleUrls: ['./trap-tab.component.scss'],
    standalone: false
})
export class TrapTabComponent implements OnInit {

  public faArrowLeft=faArrowLeft;
  public faPlus=faPlus;

  public form_model:any;
  public model_form_control:any;

  public sendingForm:boolean = false;


  constructor(
    private router: Router,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private _crudService: CrudService,

  ) {

 
 
    this.form_model = new FormGroup({
      _method: new FormControl('POST'),
      name: new FormControl('',
        [Validators.required,
        Validators.maxLength(50)],
      )

    });

    this.model_form_control = this.form_model.controls;
  }

 ngOnInit(): void {
  }

  public async onSubmit():Promise<void>
  {

    try
    {


      if (this.form_model.valid)
      {

       this.sendingForm = true;
       this.spinner.show();

       let resp=await this._crudService.store(this.form_model.value);
      

        
       this.clearForm();
       this.spinner.hide();
       this.toastr.success('Aplicación añadida exitosamente', 'Mensaje');



      }
    }
    finally
    {
      this.sendingForm = false;
      this.spinner.hide();

    }
  }

  private clearForm(): void {
    this.form_model.reset();
    this.sendingForm = false;

  }
  
  
}
