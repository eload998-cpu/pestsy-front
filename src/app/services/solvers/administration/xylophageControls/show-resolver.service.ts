import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { XylophageControlService } from 'src/app/services/administration/xylophage-control.service';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ShowResolverService  {
  constructor(
    private _model: XylophageControlService,
    private spinner: NgxSpinnerService,
    private router: Router,

  ) { }

  async resolve(route: ActivatedRouteSnapshot): Promise<any> {
    const id = Number(route.paramMap.get('id'));
    this.spinner.show();

    try {
      return await firstValueFrom(this._model.Observableshow(id));
    } catch (err) {
      console.error('Resolver failed', err);
      this.router.navigate(['/home/clientes']);
      return null;
    } finally {
      this.spinner.hide();
    }
  }





}

