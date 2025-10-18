import { Injectable } from '@angular/core';
import { CrudService } from 'src/app/services/crud.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: null
})
export class ImageService extends CrudService {

  constructor(
    protected http: HttpClient

  ) {
    super(
      http,
      'administracion/imagenes'
    )
  }

  public addFiles(form: any) {
    let arr = []
    let formData = new FormData();
    let images = form.images;
    arr.push(images);
    arr[0].forEach((item, i) => {

      formData.append('images[]', item.resizedBlob.blob, item.resizedBlob.filename);
    })

    formData.append('order_id', form.order_id);



    return this.http.post(`${this.baseUrl}`, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      catchError(this.errorMgmt)
    )
  }


  errorMgmt(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }


}
