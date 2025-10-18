import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, Route, UrlSegment } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthUserService } from 'src/app/services/auth-user.service';

@Injectable()
export class SubscriptionGuard  {
	private authUser: any;

	constructor(
		private _authUserService: AuthUserService,
	) {
		this._authUserService.userObservable.subscribe(
			(authUser: any) => this.authUser = authUser
		);
	}

	canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): boolean | Observable<boolean> | Promise<boolean> {

		return this.authUser.active_subscription;
	}





}
