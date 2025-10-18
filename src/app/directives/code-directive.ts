import { Directive, HostListener, Optional, Output, EventEmitter } from '@angular/core';
import { NgControl, FormControl } from '@angular/forms';

@Directive({
    selector: '[codeDirective]',
    standalone: false
})
export class CodeDirective {
    @Output() emitFormControl = new EventEmitter<FormControl>();

    constructor(@Optional() private formControl: NgControl) { }

    @HostListener('input')
    onInput(): void {
        if (this.formControl) {
            const inputValue: string = this.formControl.control.value;

            // Allow only numbers, dot, m, l, g (case insensitive), and spaces
            const cleanedValue = inputValue.replace(/[^a-zA-Z0-9\-\s]/g, '');

            if (inputValue !== cleanedValue) {
                this.formControl.control.setValue(cleanedValue);
            }

            this.emitFormControl.emit(this.formControl.control as FormControl);
        }
    }
}
