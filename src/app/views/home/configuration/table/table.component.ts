import { Component, OnInit, ViewChild, ElementRef, ViewChildren, QueryList } from '@angular/core';

import { PermissionService } from 'src/app/services/permission.service';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { AuthUserService } from 'src/app/services/auth-user.service';
import { AuthService } from 'src/app/services/auth.service';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
    templateUrl: './table.component.html',
    styleUrls: [
        './table.component.scss'
    ],
    standalone: false
})
export class TableComponent implements OnInit {


  @ViewChildren("orderArrow") orderArrow!: QueryList<any>
  public faArrowRight = faArrowRight;
  public authUser:any;

  public constructor(
    public _permissionService: PermissionService,
    public router: Router,
    private route: ActivatedRoute,
    private _authUserService: AuthUserService,
    private _authService: AuthService,
    private _sharedService: SharedService,

  ) {
    this._authUserService.userObservable.subscribe(
			(authUser:any) => this.authUser = authUser
		);
  }

  public async ngOnInit() {
    this._authService.getAuthUser();
    this._sharedService.emitChange({ action: "finish" });

  }


  public redirect(route:string)
  {
    this.router.navigate([route]);
  }



}
