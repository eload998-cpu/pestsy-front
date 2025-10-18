import { Injectable } from '@angular/core';
import { CrudService } from 'src/app/services/crud.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionService {

  constructor(
    protected httpClient: HttpClient

  ) {
    this.publicUrl = environment.publicUrl;

  }
  protected publicUrl: string;


  public async verifyCreatedPlanMobile(token: any, planId: any): Promise<any> {
    try {

      return await this.httpClient.post<any>(`${this.publicUrl}/paypal/capture-order`, { token: token, planId: planId }).toPromise();
    } catch (error) {
      throw error;

    }
  }

  public async createMobileSubscription(id: number): Promise<any> {
    try {
      return await this.httpClient.post<any>(`${this.publicUrl}/paypal/create-subscription`, { id: id }).toPromise();
    }
    catch (error) {
      throw error;
    }
  }


  public async createMobileOrder(id: number): Promise<any> {
    try {
      return await this.httpClient.post<any>(`${this.publicUrl}/paypal/create-order`, { id: id }).toPromise();
    }
    catch (error) {
      throw error;
    }
  }

  public async getPlans(): Promise<any> {
    try {
      return await this.httpClient.post<any>(`${this.publicUrl}/resources/get-plans`, {}).toPromise();
    }
    catch (error) {
      throw error;
    }
  }

  public async getPlanDetail(id: number): Promise<any> {
    try {
      return await this.httpClient.post<any>(`${this.publicUrl}/resources/get-plan/${id}`, {}).toPromise();
    }
    catch (error) {
      throw error;
    }
  }


  public async storeBankTransfer(reference: string, plan_id: number, extra = {}): Promise<any> {
    try {
      return await this.httpClient.post<any>(`${this.publicUrl}/payment/transferencia-bancaria`, { reference: reference, plan_id: plan_id, extra: extra }).toPromise();
    }
    catch (error) {
      throw error;
    }

  }

  public async storeZinliTransfer(reference: string, plan_id: number): Promise<any> {
    try {
      return await this.httpClient.post<any>(`${this.publicUrl}/payment/zinli`, { reference: reference, plan_id: plan_id }).toPromise();
    }
    catch (error) {
      throw error;
    }

  }

  public async getSubscriptionDetail(id: string):Promise<any>{
    try {
      return await this.httpClient.post<any>(`${this.publicUrl}/paypal/get-subscription-detail`, { id: id }).toPromise();
    }
    catch (error) {
      throw error;
    }
  }


  


}
