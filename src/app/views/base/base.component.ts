import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
    selector: 'app-base',
    template: `
    <p>
      base works!
    </p>
  `,
    styles: [],
    standalone: false
})
export class BaseComponent  {

  constructor(
    private location: Location

  ) { }


  public goBack() {
    this.location.back(); // Navigates back in the platform's history
  }
}
