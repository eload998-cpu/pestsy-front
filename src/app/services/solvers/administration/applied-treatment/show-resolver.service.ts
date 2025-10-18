import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AppliedTreatmentService } from 'src/app/services/administration/applied-treatment.service';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ShowResolverService implements Resolve<any> {
  constructor(
    private _model: AppliedTreatmentService,
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

