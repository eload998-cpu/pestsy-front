import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import {Observable, of} from 'rxjs';

import { OrderService } from 'src/app/services/administration/order.service';

import { map,catchError } from 'rxjs/operators';
import { NgxSpinnerService } from "ngx-spinner";

@Injectable()
export class ShowResolverService 
{
  constructor(
  	private _model:OrderService,
    private spinner: NgxSpinnerService,
    private router: Router,

  ) { 


  }
  
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any>
  {

      this.spinner.show();
  		return this._model
  					   .checkOrder().then(resp=>{
                this.spinner.hide();
                return resp;
               });
  }





}

