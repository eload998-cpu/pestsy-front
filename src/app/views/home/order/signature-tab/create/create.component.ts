import { Component, OnInit, ViewChild, ElementRef,ChangeDetectorRef } from '@angular/core';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faUndo } from '@fortawesome/free-solid-svg-icons';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

import { NgForm, FormControl, FormGroup, Validators, FormBuilder, FormArray, AbstractControl } from '@angular/forms';
import { AuthUserService } from 'src/app/services/auth-user.service';

//DEPENDENCIES
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";
import { Router } from '@angular/router';

//SERVICES
import { SignatureService as CrudService } from 'src/app/services/administration/signature.service';
import { SignaturePadComponent, NgSignaturePadOptions } from '@almothafar/angular-signature-pad';
import { SharedService } from 'src/app/shared/services/shared.service';
import { Device, DeviceInfo } from "@capacitor/device";

@Component({
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.scss'],
    standalone: false
})
export class CreateComponent implements OnInit {

  public faArrowLeft = faArrowLeft;
  public faPlus = faPlus;
  public faUndo = faUndo;
  public faTimes = faTimes;

  public form_model: any;
  public model_form_control: any;
  public last_order: any;
  public sendingForm: boolean = false;

  @ViewChild('signatureClient')
  public signaturePadClient: SignaturePadComponent;


  @ViewChild('signatureWorker')
  public signaturePadWorker: SignaturePadComponent;

  @ViewChild('container')
  public container: any;

  public dark_color: boolean;

  public signaturePadOptions: NgSignaturePadOptions;


  public is_mobile = this.sharedService.isMobile;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private _crudService: CrudService,
    private _authUserService: AuthUserService,
    private sharedService: SharedService,
    private cdr: ChangeDetectorRef

  ) {



    this.form_model = new FormGroup({
      _method: new FormControl('POST'),
      order_id: new FormControl(''),
      signature_pad_client: new FormControl(''),
      signature_pad_worker: new FormControl(''),

    });

    this.model_form_control = this.form_model.controls;

    this._authUserService.userObservable.subscribe(
      (authUser: any) => {
        if (authUser) {
          this.form_model.patchValue({
            order_id: authUser.last_order.id
          });
        }
      }
    );
  }

  public async ngOnInit() {

    this.signaturePadOptions = { // passed through to szimek/signature_pad constructor
      minWidth: 5,
      canvasWidth: 500,
      canvasHeight: 200,
      backgroundColor:'white'
    };

    this.cdr.detectChanges();

  }

  public ngAfterViewInit() {
    // this.signaturePad is now available
    this.signaturePadClient.set('minWidth', 5); // set szimek/signature_pad options at runtime
    this.signaturePadClient.set('canvasWidth', (this.container.nativeElement.offsetWidth - 50)); // set szimek/signature_pad options at runtime

    this.signaturePadClient.clear(); // invoke functions from szimek/signature_pad API

    this.signaturePadWorker.set('minWidth', 5); // set szimek/signature_pad options at runtime
    this.signaturePadWorker.set('canvasWidth', (this.container.nativeElement.offsetWidth - 50)); // set szimek/signature_pad options at runtime

    this.signaturePadWorker.clear(); // invoke functions from szimek/signature_pad API

  }

  public drawComplete(event: MouseEvent | Touch) {
    // will be notified of szimek/signature_pad's onEnd event

  }

  public drawStart(event: MouseEvent | Touch) {
    // will be notified of szimek/signature_pad's onBegin event
  }


  public undo(element: SignaturePadComponent) {
    let data = element.toData();


    if (data) {
      data.pop(); // remove the last dot or line
      element.fromData(data);
    }
  }



  public clear(element: SignaturePadComponent) {
    element.clear();

  }

  public async onSubmit(): Promise<void> {

    try {



      if (this.signaturePadClient.isEmpty()) {
        this.toastr.error('Añada una firma para el cliente', 'Mensaje');

      }

      if (this.signaturePadWorker.isEmpty()) {
        this.toastr.error('Añada una firma para el Trabajador', 'Mensaje');

      }

      this.form_model.patchValue({
        signature_pad_client: this.signaturePadClient.toDataURL('image/png'),
        signature_pad_worker: this.signaturePadWorker.toDataURL('image/png')

      });
      

      this.sendingForm = true;
      this.spinner.show();

      let resp = await this._crudService.store(this.form_model.value);



      this.clearForm();
      this.spinner.hide();
      this.toastr.success('Firmas añadidas exitosamente', 'Mensaje');




    }
    finally {
      this.sendingForm = false;
      this.spinner.hide();

    }
  }

  private clearForm(): void {
    this.signaturePadClient.clear();
    this.signaturePadWorker.clear();

  }




}
