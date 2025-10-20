import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import subscriptionCodes from '../../../entities/subscription-codes.json';

@Injectable({
  providedIn: 'root'
})
export class StateCodesService {


  constructor(private http: HttpClient) { }

  getStateCodes(statusType: string): Observable<any> {

    let stateCodes = [];
    switch (statusType) {
      case 'subscription':
        stateCodes = subscriptionCodes;

        break;

    }

    return of(stateCodes);
  }
}