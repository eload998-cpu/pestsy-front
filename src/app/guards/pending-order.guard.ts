import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, Route, UrlSegment } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { AuthUserService } from 'src/app/services/auth-user.service';
import { PermissionService } from 'src/app/services/permission.service';
import { OrderService } from 'src/app/services/administration/order.service';
import { Observable, of, switchMap, combineLatest, filter, map } from 'rxjs';
import { StateCodesService } from 'src/app/services/resources/state-codes.service';

@Injectable()
export class PendingOrderGuard  {
	private authUser: any;

	constructor(
		private _model: OrderService,
		private _authService: AuthService,
		private _authUserService: AuthUserService,
		private _permissionService: PermissionService,
		private router: Router,
		private stateCodesService: StateCodesService
	) {
		this._authUserService.userObservable.subscribe(
			(authUser: any) => this.authUser = authUser
		);
	}

	canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): boolean | Observable<boolean> | Promise<boolean> {


		const id = Number(route.paramMap.get('id'));
		let order$ = this._model
			.Observableshow(id);

		let validation$ = order$.pipe(
			switchMap((orderValue) => {
				return combineLatest([
					this._authUserService.userObservable.pipe(filter((authUser: any) => !!authUser)),
					this.stateCodesService.getStateCodes('subscription'),
					of(orderValue)
				]).pipe(
					map(([authUser, stateCodes, orderData]) => {
						let subscription_status_id = authUser.subscription.pivot.status_id;

					
						let codes = stateCodes.filter(
							(code: any) => code.id === subscription_status_id
						);

						if (codes.length > 0) {
							codes = codes[0];

							if (codes.name === "inactive") {
								this.router.navigateByUrl('/home/listar-ordenes/completadas-tab');
								return false;
							}

							if (orderData.order.status_id == 5) {
								this.router.navigateByUrl('/home/listar-ordenes/completadas-tab');
								return false;
							}


							return true;
						} else {
							return true;
						}
					})
				)
			})
		)


		return validation$;




	}


}
