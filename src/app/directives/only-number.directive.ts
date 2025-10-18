import { Directive, HostListener, Optional, Output, EventEmitter } from '@angular/core';
import { NgControl, FormControl } from '@angular/forms';

@Directive({
    selector: '[appOnlyNumber]',
    standalone: false
})
export class OnlyNumberDirective {

  @Output() emitFormControl = new EventEmitter<FormControl>();

  constructor(@Optional() private formControl: NgControl) {
  }

  @HostListener('input')
  onInput(): void {
    if (this.formControl) {
      const inputValue = this.formControl.control.value;
      const nonNumericValue = inputValue.replace(/\D/g, '');  

      if (inputValue !== nonNumericValue) {
        this.formControl.control.setValue(nonNumericValue);
      }

    }


  }


}