import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute } from '@angular/router';
import { Observable, of, switchMap } from 'rxjs';

import { OrderService } from 'src/app/services/administration/order.service';

import { map, catchError, filter } from 'rxjs/operators';
import { NgxSpinnerService } from "ngx-spinner";
import { combineLatest } from 'rxjs';
import { AuthUserService } from 'src/app/services/auth-user.service';
import { StateCodesService } from 'src/app/services/resources/state-codes.service';

@Injectable()
export class ShowResolverService  {

  public modelData: any;

  constructor(
    private _model: OrderService,
    private spinner: NgxSpinnerService,
    private router: Router,
    public _authService: AuthUserService,

  ) {


  }

  


  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any>
  {

    const id = Number(route.paramMap.get('id'));
    return this._model
    .show(id)

  }

}

