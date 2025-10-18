import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { faPlus, faTrash, faCheckSquare } from '@fortawesome/free-solid-svg-icons';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthUserService } from 'src/app/services/auth-user.service';
import { AuthService } from 'src/app/services/auth.service';

import { showPreconfirmMessage } from 'src/app/shared/helpers';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';
import { OrderService as CrudService } from 'src/app/services/administration/order.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { Subscription } from 'rxjs';


@Component({
    selector: 'app-order',
    templateUrl: './order.component.html',
    styleUrls: ['./order.component.scss'],
    standalone: false
})



export class OrderComponent implements OnInit, AfterViewInit, OnDestroy {




  public order_id: any = null;
  public order_type: string = "";
  public routeSubscription!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private _authUserService: AuthUserService,
    private _authService: AuthService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private _crudService: CrudService,
    private _sharedService: SharedService,
    private router: Router,


  ) {

  }
  public faPlus = faPlus;
  public faTrash = faTrash;
  public faCheckSquare = faCheckSquare;


  ngOnInit(): void {
    this.order_id = this.route.snapshot.params["id"];

    this.routeSubscription = this.route.data.subscribe((resp: any) => {

      if (resp.data.order) {
        let order = resp.data.order;
        this.order_type = order.service_type;

      }



    });
  }

  ngAfterViewInit() {

  }


  public async finish() {
    const response = await showPreconfirmMessage(
      "Finalizar orden?",
      "Esta acción no es reversible.",
      "warning",
      "Cancelar",
      "Finalizar"
    );

    if (response.isConfirmed) {

      let data = { order_id: this.order_id };

      this.spinner.show();

      await this._crudService.finish(data);
      await this._authService.getAuthUser();
      this._sharedService.emitChange({ action: "finish" });

      this.spinner.hide();



      this.toastr.success("Orden finalizada con exito.", "Mensaje");
      this.router.navigateByUrl('/home/listar-ordenes');


    }
  }


  public async discard() {
    const response = await showPreconfirmMessage(
      "Descartar orden?",
      "Esta acción no es reversible.",
      "warning",
      "Cancelar",
      "Descartar"
    );

    if (response.isConfirmed) {

      this.spinner.show();

      await this._crudService.delete(this.order_id);
      await this._authService.getAuthUser();
      this._sharedService.emitChange({ action: "discard" });

      this.spinner.hide();


      this.toastr.success("Orden descartada con exito.", "Mensaje");
      this.router.navigateByUrl('/home/listar-ordenes');

    }
  }

  ngOnDestroy() {
    this.routeSubscription?.unsubscribe();

  }

}
