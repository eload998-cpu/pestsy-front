import { Injectable } from '@angular/core';
import { CrudService } from 'src/app/services/crud.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: null
})
export class DesinfectionService extends CrudService {

  constructor(
    protected http:HttpClient

  ) 
  {
    super(
      http,
      'administracion/metodos-de-desinfeccion'
    )
  }
}
