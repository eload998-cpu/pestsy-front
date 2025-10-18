import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LocationCountriesService {

  private resources_url: string;
  constructor(
    protected httpClient: HttpClient

  ) {
    this.resources_url = environment.administrationApiUrl;

  }


  public  getCountries(page:number,term:string):Observable<any>
  {
    try {

      let params = new HttpParams().set('page', page).set('term', term);

      return  this.httpClient.get<any>(`${this.resources_url}/resources/countries`,{ params: params });
    }
    catch (error) {
      throw error;
    }
  }


  public getStates(page:number,id:number,term:string): Observable<any> {
    try {

      let params = new HttpParams().set('page', page).set('term', term);

      return  this.httpClient.get<any>(`${this.resources_url}/resources/country/${id}/states`,{ params: params });
    }
    catch (error) {
      throw error;
    }
  }


  public getCities(page:number,id:number,term:string): Observable<any> {
    try {

      let params = new HttpParams().set('page', page).set('term', term);

      return  this.httpClient.get<any>(`${this.resources_url}/resources/state/${id}/cities`,{ params: params });
    }
    catch (error) {
      throw error;
    }
  }


}
