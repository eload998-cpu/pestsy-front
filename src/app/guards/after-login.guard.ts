import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, Route, UrlSegment } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { AuthUserService } from 'src/app/services/auth-user.service';
import { TokenService } from 'src/app/services/token.service';

@Injectable()
export class AfterLoginGuard 
{
  	private authUser:any;

	constructor(
		private _authService: AuthService,
		private _authUserService: AuthUserService,
		private _tokenService: TokenService,
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

		if( ! this._tokenService.isLoggedIn )
		{
			this.redirectToLogin(state);

		}

		return  this._tokenService.isLoggedIn;
	}

	canActivateChild(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): boolean | Observable<boolean> | Promise<boolean>
	{
		return this.canActivate(route, state);
	}
	
	canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean
	{
		return true;
	}

	private redirectToLogin(state:RouterStateSnapshot):boolean | Promise<boolean>
	{
		this._authService.redirect = state.url;

		this._authService.logoutByTokenExpiration();
		
		return this._tokenService.isLoggedIn;
	}
}
