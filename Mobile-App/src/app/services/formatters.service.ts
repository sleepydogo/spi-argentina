import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FormattersService {

  constructor(private datePipe: DatePipe) { }

  formatDateString(dateString: string): string {
    const date = new Date(dateString);
    const formattedDate = this.datePipe.transform(date, 'dd MMM yyyy - HH:mm');
    return formattedDate ? formattedDate : 'Fecha no válida';
  }
}
