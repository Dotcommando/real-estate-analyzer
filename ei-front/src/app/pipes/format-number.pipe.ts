import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
  name: 'formatNumber',
  standalone: true,
})
export class FormatNumberPipe implements PipeTransform {
  public transform(value: number | undefined | null, selectedCulture: string = navigator.language): string {
    if (!value && value !== 0) {
      return '';
    }

    return Intl.NumberFormat(selectedCulture).format(value);
  }
}
