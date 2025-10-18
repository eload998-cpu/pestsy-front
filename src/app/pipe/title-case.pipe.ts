import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'titleCase',
    standalone: false
})
export class TitleCasePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return null;

    return value.replace(/\w\S*/g, (txt => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }));
  }
}
