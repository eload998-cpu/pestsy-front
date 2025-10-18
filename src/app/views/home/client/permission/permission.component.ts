import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import { NgForm, FormControl, FormGroup, Validators, FormBuilder, FormArray, AbstractControl } from '@angular/forms';

//DEPENDENCIES
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";
import { Router, ActivatedRoute } from '@angular/router';
//SERVICES
import { PermissionService } from 'src/app/services/administration/permission.service';

@Component({
    templateUrl: './permission.component.html',
    styleUrls: ['./permission.component.scss'],
    standalone: false
})
export class PermissionComponent implements OnInit {

  public faArrowLeft = faArrowLeft;
  public faPlus = faPlus;
  private route: ActivatedRoute;


  public form_model: any;
  public model_form_control: any;

  public sendingForm: boolean = false;

  public value_array = [
    {
      "name": "crear",
      "value": "create"
    },
    {
      "name": "editar",
      "value": "edit"
    },
    {
      "name": "eliminar",
      "value": "delete"
    }
  ];


  public selectedOrders: Array<string>;
  public selectedClients: Array<string>;
  public selectedWorkers: Array<string>;
  public selectedDevices: Array<string>;
  public selectedAplications: Array<string>;
  public selectedAplicationPlaces: Array<string>;
  public selectedLocations: Array<string>;
  public selectedProducts: Array<string>;
  public selectedPests: Array<string>;
  public client_id:number;



  constructor(
    private router: Router,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private _crudService: PermissionService,
    private acroute: ActivatedRoute

  ) {

  }

  ngOnInit(): void {


    this.acroute.data.subscribe((data: any) => {

      this.client_id=data.model.data.id;
    });

  }




  public async add(type: string, arr: Array<string>): Promise<void> {

    try {

      let data={
        type:type,
        id:this.client_id
      };

      this.spinner.show();
      let resp = await this._crudService.addPermissions(data, arr);

      this.spinner.hide();
      this.toastr.success('Permisos añadidos exitosamente', 'Mensaje');
    }
    finally {
      this.spinner.hide();

    }
  }





}
