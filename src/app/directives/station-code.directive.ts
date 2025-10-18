import { Directive, HostListener, Optional, Output, EventEmitter } from '@angular/core';
import { NgControl, FormControl } from '@angular/forms';

@Directive({
    selector: '[stationCodeDirective]',
    standalone: false
})
export class StationCodeDirective {
  @Output() emitFormControl = new EventEmitter<FormControl>();

  constructor(@Optional() private formControl: NgControl) {}

  @HostListener('input')
  onInput(): void {
    if (!this.formControl) return;

    let rawValue = this.formControl.control.value || '';
    rawValue = rawValue.toUpperCase();

    // Clean: allow only A-Z, 0-9, and dash
    let cleaned = rawValue.replace(/[^A-Z0-9\-]/g, '');

    // Build step-by-step structure
    let formatted = '';
    let letterPart = cleaned.match(/^[A-Z]{0,2}/)?.[0] ?? '';
    formatted += letterPart;

    if (letterPart.length === 2) {
      const dashMatch = cleaned.charAt(2) === '-' ? '-' : '';
      formatted += dashMatch;

      const digitMatch = cleaned.slice(3).match(/^\d{0,3}/)?.[0] ?? '';
      formatted += digitMatch;
    }

    this.formControl.control.setValue(formatted, { emitEvent: false });
    this.emitFormControl.emit(this.formControl.control as FormControl);
  }
}
