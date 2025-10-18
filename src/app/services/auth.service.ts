import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthUserService } from 'src/app/services/auth-user.service';
import { TokenService } from 'src/app/services/token.service';
import { delayExecution } from 'src/app/shared/helpers';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";
import { HttpHeaders } from '@angular/common/http';
import { takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  private resources_url: string;
  public redirect: string = '';
  private cancelRequests$ = new Subject<void>();

  constructor(
    public authUserService: AuthUserService,
    protected httpClient: HttpClient,
    private _tokenService: TokenService,
    private router?: Router,
    private toastr?: ToastrService,
    private spinner?: NgxSpinnerService,
  ) {
    this.resources_url = environment.administrationApiUrl;

  }


  public cancelPendingRequests(): void {
    this.cancelRequests$.next();
  }

  public async logoutByTokenExpiration(): Promise<void> {
    try {
      if (this._tokenService.getToken()) {
        this.toastr.error("Sesión expirada.", "Mensaje");

      }

      this.authUserService.clear();

      this.flushAuthUserDataOnTheBrowser();

      await this.router.navigateByUrl("/login");

    }
    catch (error) {
      throw error;
    }
  }



  public async skipTutorial(type = "all"): Promise<void> {
    try {

      await this.httpClient.post(`${environment.administrationApiUrl}/administracion/skip-tutorial`, { type }).toPromise();
    }
    catch (error) {
      throw error;
    }
  }

  public async logout(): Promise<boolean> {
    try {

      this.spinner.show();
      await this.httpClient.post(`${environment.administrationApiUrl}/logout`, {}).toPromise();

      this.flushAuthUserDataOnTheBrowser();

      this.authUserService.clear();

      return this.router.navigateByUrl("/login");
    }
    catch (error) {
      throw error;
    }
    finally {
      this.spinner.hide();
    }
  }


  public async login(data: any): Promise<any> {

    try {

      let response = await this.httpClient.post<any>(`${this.resources_url}/login`, data).toPromise();

      this.authUserService.next(response?.user);


      //set token
      this._tokenService.setToken(response.authorization.token, response.authorization.refresh_token);

      return response;
    }
    catch (error) {
      throw error;
    }
  }

  public async preLogin(data: any): Promise<any> {

    try {

      let response = await this.httpClient.post<any>(`${this.resources_url}/pre-login`, data).toPromise();
      this.authUserService.next(response?.user);


      //set token
      this._tokenService.setToken(response.authorization.token, response.authorization.refresh_token);

      return response;
    }
    catch (error) {
      throw error;
    }
  }


  public refreshToken(): Observable<any> {

    try {

      let refresh_token = this._tokenService.getRefreshToken();

      let response = this.httpClient.post<any>(`${this.resources_url}/refreshing-token`, { token: refresh_token });


      return response;
    }
    catch (error) {
      throw error;
    }
  }



  public async register(data: any): Promise<any> {

    try {

      let response = await this.httpClient.post<any>(`${this.resources_url}/register`, data).toPromise();

      this.authUserService.next(response?.user);


      //set token
      this._tokenService.setToken(response.authorization.token, response.authorization.refresh_token);

      return response;
    }
    catch (error) {
      throw error;
    }
  }


  public async canChangePassword(token: any): Promise<any> {

    try {

      let response = await this.httpClient.post<any>(`${environment.administrationApiUrl}/can-change-password/${token}`, {}).toPromise();
      return response;
    }
    catch (error) {
      throw error;
    }
  }

  public async resetPassword(data: any): Promise<any> {

    try {

      let response = await this.httpClient.post<any>(`${environment.administrationApiUrl}/reset-password`, data).toPromise();
      return response;
    }
    catch (error) {
      throw error;
    }
  }


  public async changePassword(data: any): Promise<any> {

    try {

      let response = await this.httpClient.post<any>(`${environment.administrationApiUrl}/change-password`, data).toPromise();
      return response;
    }
    catch (error) {
      throw error;
    }
  }


  public async update(data: any): Promise<any> {

    try {

      return await this.httpClient.post<any>(`${this.resources_url}/administracion/modificar-perfil`, data).toPromise();
    }
    catch (error) {
      throw error;
    }
  }


  public async verifySubscription(): Promise<any> {
    try {
      let headers = new HttpHeaders();
      headers = headers.set('Authorization', `Bearer ${this._tokenService.getToken()}`);


      return await this.httpClient.post<any>(`${environment.administrationApiUrl}/verificar-suscripcion`, {}, { headers: headers }).toPromise();


    }
    catch (error) {
      throw error;
    }
  }


  public async getAuthUser(verifySubscription = false): Promise<void> {
    try {
      let headers = new HttpHeaders();
      headers = headers.set('Authorization', `Bearer ${this._tokenService.getToken()}`);

      const response = await this.httpClient.post<any>(
        `${environment.administrationApiUrl}/autenticacion/usuario`,
        { verifySubscription: verifySubscription },
        { headers: headers }
      ).pipe(
        takeUntil(this.cancelRequests$)
      ).toPromise();

      this.authUserService.next(response);
    }
    catch (error) {
      this.logoutByTokenExpiration();
      throw error;
    }
  }

  private flushAuthUserDataOnTheBrowser(): void {
    this._tokenService.clear();
  }



}
