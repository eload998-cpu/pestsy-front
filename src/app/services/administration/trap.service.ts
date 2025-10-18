import { Injectable } from '@angular/core';
import { CrudService } from 'src/app/services/crud.service';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: null
})
export class TrapService extends CrudService {

  constructor(
    protected http: HttpClient

  ) {
    super(
      http,
      'administracion/trampas'
    )
  }


}
