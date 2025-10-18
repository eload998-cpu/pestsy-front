import { Component, AfterViewInit, ElementRef, ViewChild, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SubscriptionService } from 'src/app/services/administration/subscription.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";

declare var paypal: any; // Declare PayPal global object

@Component({
    selector: 'credit-card-paypal-button',
    templateUrl: './credit-card.component.html',
    standalone: false
})
export class CreditCardComponent implements AfterViewInit {
    @ViewChild('paypalContainer', { static: false }) paypalContainer!: ElementRef;

    @Input() plan: any;

    constructor(
        private router: Router,
        private _subscriptionService: SubscriptionService,
        private toastr: ToastrService,
        private _authService: AuthService,
        private _sharedService: SharedService,
        private spinner: NgxSpinnerService,

    ) {

    }

    ngAfterViewInit(): void {
        this.loadPaypalButton();
    }

    loadPaypalButton(): void {
        paypal.Buttons({
            locale: 'es_ES',
            fundingSource: paypal.FUNDING.CARD,
            style: {
                shape: 'pill',
                label: 'pay',
            },
            createOrder: async (data: any, actions: any) => {

                try {
                    const order = await actions.order.create({
                        purchase_units: [
                            {
                                amount: {
                                    value: this.plan.price,
                                    currency_code: 'USD',
                                },
                            },
                        ],
                    });

                    return order;
                } catch (error) {
                    console.error('Error creating order:', error);
                    this.spinner.hide();
                }



            },
            onApprove: async (data: any, actions: any) => {

                try {

                    const order = await actions.order.capture();

                    if (order.status === 'COMPLETED') {
                        await this._subscriptionService.createMobileOrder(this.plan.id);

                    }

                    this.router.navigateByUrl('/home/tablero');
                    this.toastr.success('Su pago fue exitoso', 'Mensaje');
                    this._authService.getAuthUser();
                    this._sharedService.emitChange({ action: "finish" });
                } catch (err: any) {
                    console.error('PayPal Error:', err);


                }

            },
            onError: (err: any) => {
                console.error('PayPal Error:', err);

            },
        }).render(this.paypalContainer.nativeElement);
    }
}