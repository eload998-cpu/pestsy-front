import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: "root"
})
export class TokenService {

  private baseUrl: string;
  private token: string | null = null;

  constructor(
    private _http: HttpClient,
    private jwtHelper: JwtHelperService
  ) {
    this.baseUrl = environment.administrationApiUrl;
  }


  public checkToken(token: any, email: any): Observable<boolean> {
    let data = { token: token, email: email };
    return this._http.post<boolean>(`${environment.administrationApiUrl}/check-token`, data);

  }

  get isLoggedIn(): boolean {
    this.token = this.getToken();
    return this.token !== undefined && this.token !== null;
  }

  public setToken(token: string, refresh_token:string): void {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('refresh_token', refresh_token);

  }

  public getToken(): string | null {
    return localStorage.getItem('auth_token');

  }

  public getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');

  }

  public is_expired(): boolean {

    let token = this.getToken();
    return this.jwtHelper.isTokenExpired(token);
  }

  public clear(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');

  }
}
