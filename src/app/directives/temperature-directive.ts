import { Directive, HostListener, Input, Optional, Output, EventEmitter } from '@angular/core';
import { FormControl, NgControl } from '@angular/forms';

@Directive({
    selector: '[temperatureDirective]',
    standalone: false
})
export class TemperatureDirective {
  /** Allowed decimals (e.g., 1 => 45.5). */
  @Input() tempDecimals = 1;
  /** Allowed range. */
  @Input() tempMin = 0;
  @Input() tempMax = 100;

  @Output() emitFormControl = new EventEmitter<FormControl>();

  constructor(@Optional() private formControl: NgControl) {}

  @HostListener('input')
  onInput(): void {
    if (!this.formControl) return;
    const ctrl = this.formControl.control;
    let v = (ctrl.value ?? '').toString();

    // normalize comma to dot
    v = v.replace(/,/g, '.');

    // allow only digits and dot
    v = v.replace(/[^0-9.]/g, '');

    // keep only the first dot
    const firstDot = v.indexOf('.');
    if (firstDot !== -1) {
      v = v.slice(0, firstDot + 1) + v.slice(firstDot + 1).replace(/\./g, '');
    }

    // limit decimals
    if (this.tempDecimals >= 0 && firstDot !== -1) {
      const [intP, decP = ''] = v.split('.');
      v = intP + '.' + decP.slice(0, this.tempDecimals);
    }

    if (v !== ctrl.value) ctrl.setValue(v, { emitEvent: true });
    this.emitFormControl.emit(ctrl as FormControl);
  }

  @HostListener('blur')
  onBlur(): void {
    if (!this.formControl) return;
    const ctrl = this.formControl.control;
    let num = parseFloat(((ctrl.value ?? '') + '').replace(',', '.'));
    if (isNaN(num)) { ctrl.setValue('', { emitEvent: true }); return; }

    // clamp
    if (num < this.tempMin) num = this.tempMin;
    if (num > this.tempMax) num = this.tempMax;

    // format with fixed decimals
    ctrl.setValue(num.toFixed(this.tempDecimals), { emitEvent: true });
  }
}