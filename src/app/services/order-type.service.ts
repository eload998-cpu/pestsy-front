import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OrderTypeService {

    private currentOrderType$: BehaviorSubject<string>;
    public currentOrderTypeObservable: Observable<any>;

    constructor() {
        this.currentOrderType$ = new BehaviorSubject<string>("General");
        this.currentOrderTypeObservable = this.currentOrderType$.asObservable();
    }

    get orderType(): any {
        return this.currentOrderType$.getValue();
    }


    set(value: string): void {
        this.currentOrderType$.next(value);

    }

    public next(data: string): void {
        this.currentOrderType$.next(data);

    }


    public clear(): void {
        this.currentOrderType$.next(null);
    }


}