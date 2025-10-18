import { Directive, HostListener, Input, Optional, Output, EventEmitter } from '@angular/core';
import { FormControl, NgControl } from '@angular/forms';

@Directive({
    selector: '[chlorineDirective]',
    standalone: false
})
export class ChlorineDirective {
  /** Allowed decimals (chlorine usually 2 decimals). */
  @Input() clDecimals = 2;
  /** Allowed range in mg/L (ppm). */
  @Input() clMin = 0;
  @Input() clMax = 5; // adjust if your program uses different limits

  @Output() emitFormControl = new EventEmitter<FormControl>();

  constructor(@Optional() private formControl: NgControl) {}

  @HostListener('input')
  onInput(): void {
    if (!this.formControl) return;
    const ctrl = this.formControl.control;
    let v = (ctrl.value ?? '').toString();

    v = v.replace(/,/g, '.');          // comma -> dot
    v = v.replace(/[^0-9.]/g, '');     // only digits and dot

    const firstDot = v.indexOf('.');
    if (firstDot !== -1) {
      v = v.slice(0, firstDot + 1) + v.slice(firstDot + 1).replace(/\./g, '');
    }

    if (this.clDecimals >= 0 && firstDot !== -1) {
      const [intP, decP = ''] = v.split('.');
      v = intP + '.' + decP.slice(0, this.clDecimals);
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

    if (num < this.clMin) num = this.clMin;
    if (num > this.clMax) num = this.clMax;

    ctrl.setValue(num.toFixed(this.clDecimals), { emitEvent: true });
  }
}
