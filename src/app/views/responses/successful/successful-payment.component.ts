import { Component, OnInit, ViewChild } from '@angular/core';


@Component({
    templateUrl: './successful-payment.component.html',
    styleUrls: ['./successful-payment.component.scss'],
    standalone: false
})
export class SuccessfulPaymentComponent implements OnInit {
  public image_completed: boolean = false;

  public async ngOnInit() {


  }

  public imageCompleted() {
    this.image_completed = true;
  }


  public closeWindow() {
    window.close();
  }
}





