import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, Route, UrlSegment } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { AuthUserService } from 'src/app/services/auth-user.service';
import { PermissionService } from 'src/app/services/permission.service';

@Injectable()
export class PermissionGuard 
{
  	private authUser:any;

	constructor(
		private _authService: AuthService,
		private _authUserService: AuthUserService,
		private _permissionService: PermissionService,
		private router: Router
	)
	{
		this._authUserService.userObservable.subscribe(
			(authUser:any) => this.authUser = authUser
		);
	}

	canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): boolean | Observable<boolean> | Promise<boolean>
	{	
		const id = route.paramMap.get('plan_id');

		let userRole = this.checkPlan(id);
		let permission = this._permissionService.hasPermission(route);

		if(userRole && permission)
		{
			return true;
		}

		return false;
	}



	checkPlan(id:any)
	{
		if((id==this.authUser.subscription.id) && this.authUser.active_subscription)
		{
			return false;
		}

		return true;
	}


}
