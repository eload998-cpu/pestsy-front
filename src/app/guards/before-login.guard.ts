import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenService } from 'src/app/services/token.service';

@Injectable()
export class BeforeLoginGuard  {

  constructor(
    private _tokenService: TokenService,
    private router:Router
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean>
  {
    if (this._tokenService.isLoggedIn)
      this.router.navigateByUrl('/home');

    return ! this._tokenService.isLoggedIn;
  }
}
