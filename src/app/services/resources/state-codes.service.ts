import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StateCodesService {


  constructor(private http: HttpClient) { }

  getStateCodes(statusType: string): Observable<any> {

    let stateCodes = [];
    switch (statusType) {
      case 'subscription':
        stateCodes = require('../../../entities/subscription-codes.json');

        break;

    }

    return of(stateCodes);
  }
}