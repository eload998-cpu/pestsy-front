import { Component, OnInit, ViewChild } from '@angular/core';


@Component({
    templateUrl: './unsuccessful-payment.component.html',
    styleUrls: ['./unsuccessful-payment.component.scss'],
    standalone: false
})
export class UnSuccessfulPaymentComponent implements OnInit {

  public imgCompleted: boolean = false;

  public async ngOnInit() {


  }

  public imageCompleted() {
    this.imgCompleted = true;

  }

  public imageFailed(): void {
    this.imgCompleted = false; // Ensure shimmer effect is shown if image fails
    console.log('Image failed to load:', this.imgCompleted);
  }

  public closeWindow() {
    window.close();
  }

}





