import { Injectable } from '@angular/core';
import { CrudService } from 'src/app/services/crud.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: null
})
export class ConfigurationService extends CrudService {

  constructor(
    protected http: HttpClient,

  ) {
    super(
      http,
      'administracion/configuraciones'
    )
  }

  public async deleteAccount(reason: string) {
    try {


      return await this.httpClient.post<any>(`${this.baseUrl}/eliminar-cuenta`, { reason }).toPromise();
    }
    catch (error) {
      throw error;
    }
  }


  public async cancelSubscription(reason: string) {
    try {


      return await this.httpClient.post<any>(`${this.baseUrl}/cancelar-suscripcion`, { reason: reason }).toPromise();
    }
    catch (error) {
      throw error;
    }
  }

}
