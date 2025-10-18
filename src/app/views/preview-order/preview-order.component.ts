import { Component, OnInit,ViewChild, AfterViewInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';




@Component({
    selector: 'preview-order',
    templateUrl: './preview-order.component.html',
    styleUrls: ['./preview-order.component.scss'],
    standalone: false
})



export class PreviewOrderComponent implements OnInit,AfterViewInit {


  pdfSrc = "https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf";

  ngOnInit(): void {
  

  }

  ngAfterViewInit() {

  }





}
