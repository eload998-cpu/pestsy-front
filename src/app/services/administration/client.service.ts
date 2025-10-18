import { Injectable } from '@angular/core';
import { CrudService } from 'src/app/services/crud.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
@Injectable({
  providedIn: null
})
export class ClientService extends CrudService {

  constructor(
    protected http: HttpClient

  ) {
    super(
      http,
      'administracion/clientes'
    )
  }

  public addFiles(form: any) {
    let arr = []
    let formData = new FormData();
    let files = form.files;

    formData.append('name', form.name);
    files.forEach((item, i) => {
      formData.append('upfiles[]', item);

    })


    return this.http.post(`${this.baseUrl}-añadir-archivo`, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      catchError(this.errorMgmt)
    )
  }


  public errorMgmt(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
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
