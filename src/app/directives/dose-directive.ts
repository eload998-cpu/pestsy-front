import { Directive, HostListener, Optional, Output, EventEmitter, Input } from '@angular/core';
import { NgControl, FormControl } from '@angular/forms';

@Directive({
    selector: '[doseDirective]',
    standalone: false
})
export class DoseDirective {
  /** Allow denominators like /m², /m2, /m3, /L */
  @Input() doseAllowDenominator = true;

  /** Allowed base units (case-insensitive) */
  @Input() doseUnits: string[] = ['ml', 'g', 'l', 'cc'];

  @Output() emitFormControl = new EventEmitter<FormControl>();

  constructor(@Optional() private formControl: NgControl) {}

  @HostListener('input')
  onInput(): void {
    if (!this.formControl) return;

    const ctrl = this.formControl.control;
    let value: string = (ctrl.value ?? '').toString();

    // always normalize multiple spaces and force lowercase while typing
    value = value.replace(/\s+/g, ' ').toLowerCase();

    // Build allowed character class dynamically
    // base: digits, dot, comma, space
    let allowed = '0-9.,\\s';

    // Add letters used by allowed units (e.g., m,l,g,c for ['ml','g','l','cc'])
    const unitLetters = Array.from(new Set(this.doseUnits.join(''))).join('');
    if (unitLetters) allowed += unitLetters.replace(/[-\\^]/g, '\\$&');

    // Add denominator characters only if allowed
    if (this.doseAllowDenominator) {
      allowed += '\\/m²³23'; // slash + m + superscripts ²³ + plain 2/3
      allowed += 'l';         // allow '/L' denominator
    }

    const cleaned = value.replace(new RegExp(`[^${allowed}]`, 'gi'), '');

    if (cleaned !== value) {
      ctrl.setValue(cleaned, { emitEvent: true });
    }

    this.emitFormControl.emit(ctrl as FormControl);
  }
}
