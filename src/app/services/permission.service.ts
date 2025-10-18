import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthUserService } from 'src/app/services/auth-user.service';
import { delayExecution } from 'src/app/shared/helpers';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";
import { HttpHeaders } from '@angular/common/http';
import { TokenService } from 'src/app/services/token.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  public permissions = [];

  constructor(
    public authUserService: AuthUserService,
    protected httpClient: HttpClient,
    private router: Router,
    private _tokenService: TokenService,

  ) {

  }


  public hasPermission(component): any {


    if (this._tokenService.isLoggedIn) {

      let isSystemUser = this.checkRole(['system_user']);
      let permission = this.checkPermission(component.data.permission);

      if (!permission && isSystemUser) {
        this.router.navigateByUrl('/home/listar-ordenes/completadas-tab');

      } else {
        return this.checkPermission(component.data.permission);

      }

    }

  }

  public checkPermission(permission, role = null) {

    if (role) {
      let check_role = this.checkRole(role);

      if (!check_role) { return false; }
    }

    this.permissions = this.authUserService.permissions;

    let result = this.permissions.find(item => item.name == permission);
    return (result) ? true : false;

  }

  public checkRole(rol: string[]) {
    let result = this.authUserService.user.roles.find(item => rol == item.name);
    return (result) ? true : false;
  }



}
