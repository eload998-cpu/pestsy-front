import { Injectable } from '@angular/core';
import { CrudService } from 'src/app/services/crud.service';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';

@Injectable({
  providedIn: null
})
export class DashboardService extends CrudService {

  constructor(
    protected http: HttpClient

  ) {
    super(
      http,
      'administracion/dashboard'
    )
  }


  public async getDashboardData() {
    return await this.httpClient.get<any>(`${this.baseUrl}`).toPromise();

  }

  public async filterDates(data = null) {
    data.date_1 = this.formatDateToISO(data.date_1);
    data.date_2 = this.formatDateToISO(data.date_2);

    return await this.httpClient.post<any>(`${this.baseUrl}/filter-dates`, data).toPromise();

  }


  public formatDateToISO(dateStr: string) {


    const momentDate = moment(dateStr, [
      "YYYY-MM-DDTHH:mm:ss.SSSZ", // ISO 8601 format
      "DD/MM/YYYY", // custom format
      "MM/DD/YYYY", // custom format
      "YYYY/MM/DD", // custom format
    ], true);

    if (!momentDate.isValid()) {
      throw new Error('Invalid date string');
    }

    return momentDate.toISOString();
  }


}
