import { Injectable } from '@angular/core';
import { CrudService } from 'src/app/services/crud.service';
import { HttpClient, HttpErrorResponse, HttpResponse, HttpParams } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { NgxSpinnerService } from "ngx-spinner";
import { parse } from "content-disposition-attachment";
import { ToastrService } from 'ngx-toastr';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Device, DeviceInfo } from "@capacitor/device";
import { downloadAndroidFile } from 'src/app/shared/helpers';
import { AuthUserService } from 'src/app/services/auth-user.service';
import { StateCodesService } from 'src/app/services/resources/state-codes.service';
import { combineLatest } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';

@Injectable({
  providedIn: null
})
export class OrderService extends CrudService {


  private resources_url: string;
  public subscription_status_id: number;
  public stateCodes: any;
  public authUser: any;

  constructor(
    protected http: HttpClient,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    public _authService: AuthUserService,
    private stateCodesService: StateCodesService,

  ) {
    super(
      http,
      'administracion/orders'
    );

    this.resources_url = environment.administrationApiUrl + 'administracion/orders';

  }


  public async checkOrder() {
    try {


      return await this.httpClient.post<any>(`${this.baseUrl}/check-order`, {}).toPromise();

    }
    catch (error) {
      throw error;
    }
  }


  public async finish(data): Promise<any> {
    try {
      return await this.httpClient.post<any>(`${this.baseUrl}/finalizar`, data).toPromise();
    }
    catch (error) {
      throw error;
    }
  }


  public async resend(id): Promise<any> {
    try {
      return await this.httpClient.post<any>(`${this.baseUrl}/reenviar/${id}`, {}).toPromise();
    }
    catch (error) {
      throw error;
    }
  }

  public filter$(
    search: string = '',
    sort: string = '',
    sortBy: string = '',
    page: number = 1,
    order_id: number = 0,
    condition: string | null = null,
    date_1?: Date | string | null,
    date_2?: Date | string | null
  ): Observable<any> {
    const payload = {
      search,
      sort,
      sortBy,
      page,
      order_id,
      condition,
      date_1: date_1,
      date_2: date_2,
    };

    return this.httpClient.post<any>(`${this.baseUrl}/daily-orders`, payload);
  }

  public async filter(search: string = '', sort: string = '', sortBy: string = '', page = 1, order_id = 0, condition = null, date_1: any, date_2: any): Promise<any> {

    try {


      let data = {
        search: search,
        sort: sort,
        sortBy: sortBy,
        page: page,
        order_id: order_id,
        condition: condition,
        date_1: date_1,
        date_2: date_2
      };

      return await this.httpClient.post<any>(`${this.baseUrl}/daily-orders`, data).toPromise();
    }
    catch (error) {
      throw error;
    }
  }



  public async pending(data) {
    try {
      return await this.httpClient.post<any>(`${this.baseUrl}/pendiente`, data).toPromise();
    }
    catch (error) {
      throw error;
    }
  }


  public preview(id: number): void {

    this.spinner.show();
    this.http.get(`${environment.publicUrl}/pdf/descargar-orden/${id}`, { responseType: 'blob' })
      .pipe(
        catchError(error => {
          this.toastr.error("Cuenta expirada, por favor renueva tu plan", "Mensaje");

          this.spinner.hide();
          // Re-throw the error so it can be caught by the caller
          return throwError(error);
        })
      )
      .subscribe(
        (response: any) => {

          let dataType = response.type;
          let binaryData = [];
          binaryData.push(response);
          let downloadLink = document.createElement('a');
          downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, { type: 'application/pdf' }));
          let filename = "test.pdf";
          if (filename) {
            downloadLink.setAttribute('target', '_blank');

          }
          document.body.appendChild(downloadLink);
          downloadLink.click();

          this.spinner.hide();

        }
      )

  }


  /*
  public downloadFile(id:number): void {
    // const baseUrl = 'http://myserver/index.php/api';   

    this.spinner.show();
    this.http.get(`${environment.publicUrl}/pdf/descargar-orden/${id}`, { responseType: 'blob' }).subscribe(
      (response: any) => {


        let dataType = response.type;
        let binaryData = [];
        binaryData.push(response);
        let downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, { type: dataType }));
        let filename="test.pdf";
        if (filename) {
          downloadLink.setAttribute('download', filename);
        }
        document.body.appendChild(downloadLink);
        downloadLink.click();

        this.spinner.hide();

      }
    )
  }*/


  public async downloadFile(id: number): Promise<any> {

    this.spinner.show();
    const deviceInfo = await Device.getInfo();

    if ((deviceInfo as unknown as DeviceInfo).platform === "web") {

      this.http.get<Blob>(`${environment.publicUrl}/pdf/descargar-orden/${id}`, { observe: 'response', responseType: 'blob' as 'json' })
        .pipe(
          catchError(error => {
            this.toastr.error("Cuenta expirada, por favor renueva tu plan", "Mensaje");
            console.log(error)

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

              // Cleanup
              document.body.removeChild(downloadLink);
              window.URL.revokeObjectURL(downloadLink.href);
            } else {
              console.error('Invalid response:', response);
            }



          },
          error => {
            console.error('Download error:', error);
            // Handle download error, e.g., show error message
          }
        )
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

                downloadAndroidFile(this.http, `${environment.publicUrl}/pdf/descargar-orden/${id}`).then((data) => {
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
        this.spinner.hide();

      }

    }


  }



  public getFileName(response: HttpResponse<Blob>) {
    const contentDisposition = response.headers.get('content-disposition');
    const val = parse(contentDisposition)
    return val["filename"];
  }


}
