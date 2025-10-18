import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthUserService } from 'src/app/services/auth-user.service';
import { AuthService } from 'src/app/services/auth.service';

import { showPreconfirmMessage } from 'src/app/shared/helpers';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';
import { OrderService as CrudService } from 'src/app/services/administration/order.service';
import { SharedService } from 'src/app/shared/services/shared.service';


@Component({
    selector: 'list-order',
    templateUrl: './list-order.component.html',
    styleUrls: ['./list-order.component.scss'],
    standalone: false
})



export class ListOrderComponent implements OnInit, AfterViewInit {




  public order_id: any = null;
  constructor(
    private route: ActivatedRoute,
    private _authUserService: AuthUserService,
    private _authService: AuthService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private _crudService: CrudService,
    private _sharedService: SharedService,


  ) {


  }
  public faPlus = faPlus;
  public faTrash = faTrash;
  public role: string = "";

  public authUser = this._authUserService.userObservable.subscribe(
    (authUser: any) => {

      if (authUser) {
        this.order_id = (authUser.last_order) ? authUser.last_order.id : null;
        this.role = authUser.roles[0].name;

      }

    }
  );

  ngOnInit(): void {


  }

  ngAfterViewInit() {

  }





}
