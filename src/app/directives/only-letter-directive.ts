import { Directive, HostListener, Optional, Output, EventEmitter } from '@angular/core';
import { NgControl, FormControl } from '@angular/forms';

@Directive({
    selector: '[appOnlyLetters]',
    standalone: false
})
export class OnlyLettersDirective {

  @Output() emitFormControl = new EventEmitter<FormControl>();

  constructor(@Optional() private formControl: NgControl) {
  }

  @HostListener('input')
  onInput(): void {
    if (this.formControl) {
      const inputValue = this.formControl.control.value;
      // Regular expression to match only letters (both uppercase and lowercase) and spaces
      const lettersOnlyValue = inputValue.replace(/[^a-zA-Z\s]/g, '');

      if (inputValue !== lettersOnlyValue) {
        this.formControl.control.setValue(lettersOnlyValue);
      }

      this.emitFormControl.emit(this.formControl.control as FormControl);
    }
  }
}