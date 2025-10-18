import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: null
  })
export class PaymentService {
    protected baseUrl: string;


  constructor(private http: HttpClient) {

            this.baseUrl = environment.administrationApiUrl;
    
   }

  
  public async getBankAmount(): Promise<any> {
    let data = {  };
    try {
      return await this.http.post<any>(`${this.baseUrl}/resources/get-dollar-price`, data).toPromise();
    }
    catch (error) {
      throw error;
    }
  }
}