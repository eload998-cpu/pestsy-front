import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import {AuthService} from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ChangePasswordGuard  {

  constructor(
    private router:Router,
    private _model:AuthService,
    private toastr: ToastrService

  ) { }

  public async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):Promise<any>
  {
    const token = decodeURIComponent(atob(route.paramMap.get('token')));

    let resp= await this._model
    .canChangePassword(token);

    if (!resp.data)
    {
      this.router.navigateByUrl('/home');
      this.toastr.error("El token ha expirado","Mensaje");

    }

    return true;
  }
}
