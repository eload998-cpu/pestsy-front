import { Injectable } from '@angular/core';
import { CrudService } from 'src/app/services/crud.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: null
})
export class WorkerService extends CrudService {

  constructor(
    protected http:HttpClient

  ) 
  {
    super(
      http,
      'administracion/obreros'
    )
  }


  public async createUser(id: number,role:string): Promise<any> {
    let data = { id: id,role:role };
    try {
      return await this.httpClient.post<any>(`${this.baseUrl}-crear-usuario`, data).toPromise();
    }
    catch (error) {
      throw error;
    }
  }
}
