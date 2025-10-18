import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, Route, UrlSegment } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthUserService } from 'src/app/services/auth-user.service';
import { OrderService } from 'src/app/services/administration/order.service';
import { NgxSpinnerService } from "ngx-spinner";

@Injectable()
export class OrderTypeGuard  {
    private authUser: any;

    constructor(
        private _authUserService: AuthUserService,
        private _model: OrderService,
        private spinner: NgxSpinnerService,
        private router: Router,

    ) {
        this._authUserService.userObservable.subscribe(
            (authUser: any) => this.authUser = authUser
        );
    }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): boolean | Observable<boolean> | Promise<boolean> {

        const normalize = (s?: string) => s?.trim().toLowerCase() ?? '';
        const action = route.data['action'] as string;
        const id = route.paramMap.get('id');
        const orderType = route.data['orderType'] as string[] | undefined;
        if (action == "edit") {
            this.spinner.show();
            return this._model
                .show(id).then(t => {
                    this.spinner.hide();
                    let isOk = orderType.some((value) => normalize(value) == normalize(t.order.service_type));

                    return isOk ? isOk : this.router.navigateByUrl('/home/listar-ordenes/completadas-tab');
                });
        } else {
            let isOk = orderType.some((value) => normalize(value) == normalize(this.authUser.last_order.service_type));
            return isOk ? isOk : this.router.navigateByUrl('/home/listar-ordenes/completadas-tab');

        }

    }





}
