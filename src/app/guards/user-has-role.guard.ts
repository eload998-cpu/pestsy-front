import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanLoad, Route, RouterStateSnapshot, UrlSegment, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthUserService } from 'src/app/services/auth-user.service';

@Injectable({
  providedIn: 'root'
})
export class UserHasRoleGuard implements CanActivate, CanActivateChild, CanLoad {
  
  public constructor(
    private _authUserService:AuthUserService,
    private _router:Router
  ){}

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree 
  {
		return this.canActivate(childRoute, state);
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
  {


    const role = route.data["role"];

    let user_roles=this._authUserService.user.roles.filter((el:any)=>el.name==role);

    let can_access=(user_roles.length)?true:false;

    if(!can_access )
    {
      this._router.navigateByUrl("/home/no-autorizado");

    }

    return true;
  }

  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
    {
      let role = route.data!["role"];

      let user_roles=this._authUserService.user.roles.filter((el:any)=>el.name==role);
  
      let can_access=(user_roles.length)?true:false;
  
      if(!can_access )
      {
        this._router.navigateByUrl("/home/no-autorizado");
  
      }
  
      return true;
    }

}
