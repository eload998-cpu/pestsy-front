import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthUserService } from 'src/app/services/auth-user.service';

interface TourStep {
    component: string;
    step: number;
    showTutorial: boolean;
    disableBody: boolean;
}
@Injectable({ providedIn: 'root' })
export class TourService {

    public currentOrderTourValue$: BehaviorSubject<TourStep>;
    public currentOrderTourValueObservable: Observable<any>;

    constructor(
        private _authUserService: AuthUserService

    ) {


        let step: number = 1;
        if (this._authUserService.hasRole('system_user')) {
            step = 17;
        }

        if (this._authUserService.hasRoles(['administrator', 'super_administrator', 'fumigator'])) {
            step = 13;
        }

        if (this._authUserService.hasRoles(['operator'])) {
            step = 14;
        }
        this.currentOrderTourValue$ = new BehaviorSubject<TourStep>({
            component: "create-order",
            step: step,
            showTutorial: false,
            disableBody: true
        });
        this.currentOrderTourValueObservable = this.currentOrderTourValue$.asObservable();
    }

    get orderTourValue(): any {
        return this.currentOrderTourValue$.getValue();
    }


    set(value: TourStep): void {
        this.currentOrderTourValue$.next(value);

    }

    public next(data: TourStep): void {
        this.currentOrderTourValue$.next(data);

    }


    public clear(): void {
        this.currentOrderTourValue$.next(null);
    }


}