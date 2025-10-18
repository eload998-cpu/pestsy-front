import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthUserService } from 'src/app/services/auth-user.service';
import { AuthService } from 'src/app/services/auth.service';
import { faUsers, faCogs, faSignLanguage, faFlask, faSearch } from '@fortawesome/free-solid-svg-icons';
import { DashboardService } from 'src/app/services/administration/dashboard.service';
import { NgForm, FormControl, FormGroup, Validators, FormBuilder, FormArray, AbstractControl } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";
import { SubscriptionService } from 'src/app/services/administration/subscription.service';
import * as CryptoJS from 'crypto-js';
import { AES, enc, mode, pad } from 'crypto-js';
import { Utf8 } from 'crypto-js';
import { ToastrService } from 'ngx-toastr';
import { Device, DeviceInfo } from "@capacitor/device";

interface plan {
  id: number;
  name: string;
  price: number;
  period: string;
}


@Component({
    selector: 'subscription',
    templateUrl: './subscription.component.html',
    styleUrls: ['./subscription.component.scss'],
    standalone: false
})





export class SubscriptionComponent implements OnInit, AfterViewInit {

  public encryptedString: string;
  public encryptionKey = 'successful';
  public authUser: any;
  public is_phone: boolean = false;


  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private _authUserService: AuthUserService,
    private _subscriptionService: SubscriptionService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private _authService: AuthService,
  ) {

    this._authUserService.userObservable.subscribe(
      (authUser: any) => {
        this.authUser = authUser
      }
    );

  }

  public fumigator_plan: plan;
  public premium_plan: plan;

  public CryptoJSAesJson = {
    stringify: function (cipherParams: any) {
      var j: any = { ct: cipherParams.ciphertext.toString(CryptoJS.enc.Base64) };
      if (cipherParams.hasOwnProperty("iv")) j.iv = cipherParams.iv.toString();
      if (cipherParams.hasOwnProperty("salt")) j.s = cipherParams.salt.toString();
      return JSON.stringify(j);
    },
    parse: function (jsonStr: string) {
      var j = JSON.parse(jsonStr);
      var cipherParams = CryptoJS.lib.CipherParams.create({ ciphertext: CryptoJS.enc.Base64.parse(j.ct) });
      if (j.hasOwnProperty("iv")) cipherParams.iv = CryptoJS.enc.Hex.parse(j.iv) as any;
      if (j.hasOwnProperty("s")) cipherParams.salt = CryptoJS.enc.Hex.parse(j.s) as any;
      return cipherParams;
    }
  };

  async ngOnInit(): Promise<any> {

    this.route.queryParams.subscribe(params => {

      this.encryptedString = params["response"];
      let value = window.atob(this.encryptedString);

      switch (value) {
        case "success":
          this.toastr.success('Pago realizado satisfactoriamente', 'Mensaje');

          break;

        case "cancel":
          this.toastr.error('Pago abortado', 'Mensaje');

          break;
      }

    });


    this.spinner.show();
    let data = await this._subscriptionService.getPlans();
    this.spinner.hide();

    this.fumigator_plan = data.fumigator_plan;
    this.premium_plan = data.premium_plan;

    const deviceInfo = await Device.getInfo();
    if ((deviceInfo as unknown as DeviceInfo).platform != "web") {

      this.is_phone = true;
    }

 

  }




  public async ngAfterViewInit(): Promise<any> {



  }

  public Encrypt(word, key = 'share') {
    let encJson = CryptoJS.AES.encrypt(JSON.stringify(word), key).toString()
    let encData = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(encJson))
    return encData
  }

  //解密方法aes
  public Decrypt(word, key = 'share') {
    let decData = CryptoJS.enc.Base64.parse(word).toString(CryptoJS.enc.Utf8)
    let bytes = CryptoJS.AES.decrypt(decData, key).toString(CryptoJS.enc.Utf8)
    return JSON.parse(bytes)
  }



}
