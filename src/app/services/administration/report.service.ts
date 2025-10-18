import { Injectable } from '@angular/core';
import { CrudService } from 'src/app/services/crud.service';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { parse } from "content-disposition-attachment";
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';
import { Device, DeviceInfo } from "@capacitor/device";
import { downloadAndroidFile } from 'src/app/shared/helpers';


import { AuthUserService } from 'src/app/services/auth-user.service';
import { StateCodesService } from 'src/app/services/resources/state-codes.service';
import { combineLatest } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';

@Injectable({
  providedIn: null
})
export class ReportService extends CrudService {

  public subscription_status_id: number;
  public stateCodes: any;
  public authUser: any;

  constructor(
    protected http: HttpClient,
    protected spinner: NgxSpinnerService,
    private toastr: ToastrService,
    public _authService: AuthUserService,
    private stateCodesService: StateCodesService,

  ) {
    super(
      http,
      'administracion/informes'
    )
  }

  public addFiles(form: any) {
    let formData = new FormData();
    let files = form.files;

    formData.append('client_id',form.client_id);
    files.forEach((item: any, i) => {
      formData.append('files[]', item);

    })


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
    console.log(errorMessage);
    return throwError(errorMessage);
  }


  public downloadAllFile(id:number):void
  {

    this.spinner.show();

    this.http.get<Blob>(`${environment.publicUrl}/pdf/descargar-todo-informes/${id}`, { observe: 'response', responseType: 'blob' as 'json' }).subscribe(
     (response: HttpResponse<Blob>) => {

       let filename: string = this.getFileName(response)
       let binaryData = [];
       binaryData.push(response.body);
       let downloadLink = document.createElement('a');
       downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, { type: 'blob' }));
       downloadLink.setAttribute('download', filename);
       document.body.appendChild(downloadLink);
       downloadLink.click();
       this.spinner.hide();

     }
   )

  }


  public async downloadFile(id: number): Promise<any> {

    this.spinner.show();
    const deviceInfo = await Device.getInfo();

    if ((deviceInfo as unknown as DeviceInfo).platform === "web") {

      try {

        this.http.get<Blob>(`${this.baseUrl}/descargar-informes/${id}`, { observe: 'response', responseType: 'blob' as 'json' })
          .pipe(
            catchError(error => {
              this.toastr.error("Cuenta expirada, por favor renueva tu plan", "Mensaje");


              this.spinner.hide();
              // Re-throw the error so it can be caught by the caller
              return throwError(error);
            })
          )
          .subscribe(

            (response: HttpResponse<Blob>) => {
              if (response && response.body) {

                let filename: string = this.getFileName(response)
                let binaryData = [];
                binaryData.push(response.body);
                let downloadLink = document.createElement('a');
                downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, { type: 'blob' }));
                downloadLink.setAttribute('download', filename);
                document.body.appendChild(downloadLink);
                downloadLink.click();
                this.spinner.hide();

              }
            }
          )
      }
      catch (error) {

        throw error;
      }

    } else {
      try {


        // Combine the observables
        combineLatest([this._authService.userObservable.pipe(
          filter((authUser: any) => !!authUser),
          take(1)
        ),
        this.stateCodesService.getStateCodes('subscription')])
          .pipe(
            map(([authUser, stateCodes]) => {

              this.authUser = authUser;
              this.subscription_status_id = authUser.subscription.pivot.status_id;

              this.stateCodes = stateCodes.filter(
                (code: any) => code.id === this.subscription_status_id
              );

            })
          )
          .subscribe(
            () => {
              this.stateCodes = this.stateCodes[0];

              if (this.stateCodes.name != 'inactive') {

                downloadAndroidFile(this.http, `${this.baseUrl}/descargar-informes/${id}`).then((data) => {
                  this.spinner.hide();
                  this.toastr.success("Archivo almacenado con exito en : Documents")

                })
              } else {

                this.spinner.hide();

                let message = "";

                switch (this.authUser.roles[0].name) {
                  case "administrator":
                    message = "Cuenta expirada, por favor renueva tu plan";

                    break;

                  case "fumigator":
                    message = "Cuenta expirada, por favor renueva tu plan";

                    break;

                  default:
                    message = 'Cuenta expirada, por favor comuniquese con el administrador';

                    break;
                }

                this.toastr.error(message);

              }
            },
            (error) => {
              console.error('Error:', error);
            }
          );




      } catch (error) {
        console.log(error);
        this.toastr.error("Hubo un error, contacte al administrador")

      }
    }




  }






  public getFileName(response: HttpResponse<Blob>) 
  {


      const contentDisposition = response.headers.get('content-disposition');
      const val= parse(contentDisposition)
      return val["filename"];

  }




}
