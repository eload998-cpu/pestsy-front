import { Component, OnDestroy, OnInit, ElementRef, ViewChildren, ViewChild, QueryList, ChangeDetectorRef } from '@angular/core';
import { faPlus, faEye, faPencil, faSearch, faTrash, faLongArrowUp, faLongArrowDown, faUser, faFile, faCogs } from '@fortawesome/free-solid-svg-icons';

// services
import { ClientService as CRUDService } from 'src/app/services/administration/client.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { showPreconfirmMessage, showAction } from 'src/app/shared/helpers';
import * as AOS from 'aos';
import { PermissionService } from 'src/app/services/permission.service';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/shared/services/shared.service';
import { AuthUserService } from 'src/app/services/auth-user.service';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';
import { NgZone } from '@angular/core';

// rxjs
import { Subject, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, catchError, finalize, takeUntil, tap, map } from 'rxjs/operators';
import { TourService } from 'src/app/shared/services/tour.service';
@Component({
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss'],
    standalone: false
})
export class TableComponent implements OnInit, OnDestroy {

  @ViewChild('scrollHost', { static: false }) scrollHost!: ElementRef<HTMLElement>;
  @ViewChildren('orderArrow') orderArrow!: QueryList<any>;
  @ViewChild('lastRecord') lastRecordRef!: ElementRef<HTMLElement>;


  // icons
  public faPlus = faPlus;
  public faEye = faEye;
  public faPencil = faPencil;
  public faSearch = faSearch;
  public faTrash = faTrash;
  public faLongArrowUp = faLongArrowUp;
  public faLongArrowDown = faLongArrowDown;
  public faUser = faUser;
  public faFile = faFile;
  public faCogs = faCogs;
  public tourStep: number = 1;
  public showTutorial: boolean = false;

  // state
  public search_input = '';
  public clients: any[] = [];
  public is_searching = false;
  public mobile_asc = true;
  public paginate_data: any = [];
  public page = 1;
  public orderSelect = 'name';

  // reactive controls
  private destroy$ = new Subject<void>();
  private search$ = new Subject<string>();
  public is_mobile = this._sharedService.isMobile;
  public authUser: any;
  public authUserServiceSubscription!: Subscription;


  constructor(
    private _clientService: CRUDService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private elRef: ElementRef,
    public _permissionService: PermissionService,
    private router: Router,
    private _sharedService: SharedService,
    private _authUserService: AuthUserService,
    private _authService: AuthService,
    private zone: NgZone,
    private cdRef: ChangeDetectorRef

  ) {


  }



  ngOnInit(): void {



    this.authUserServiceSubscription = this._authUserService.userObservable.subscribe(
      (authUser: any) => {
        this.authUser = authUser;
        this.showTutorial = (!this.authUser.tutorials.client_tutorial && (this.authUser.roles[0].name != "operator" && this.authUser.roles[0].name != "fumigator")) ? true : false;

      }
    );

    AOS.init({ once: false });
    // Initial load
    this.spinner.show();
    this._clientService.index$('', '', '', this.page).pipe(
      finalize(() => this.spinner.hide()),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (resp) => {
        this.clients = resp.data;

        if (this.clients.length != 0 && this.showTutorial) {

          this._sharedService.emitChange({ action: 'disableBody' });
          this.cdRef.detectChanges();
          this.zone.runOutsideAngular(() => {
            requestAnimationFrame(() => this.scrollContainerToBottom());
          });
        }

        this.paginate_data = resp;
      },
      error: (err) => {
        console.error(err);
        this.toastr.error('No se pudieron cargar los datos.', 'Error');
      }
    });

    // Debounced, cancellable search
    this.search$.pipe(
      debounceTime(300),
      map(v => (v ?? '').trim()),
      distinctUntilChanged(),
      tap(() => this.is_searching = true),
      switchMap(term =>
        this._clientService.index$(term, '', '', 1).pipe( // reset page on new search
          catchError(err => {
            console.error(err);
            this.toastr.error('Búsqueda fallida.', 'Error');
            return of({ data: [], total: 0 });
          }),
          finalize(() => this.is_searching = false)
        )
      ),
      takeUntil(this.destroy$)
    ).subscribe(resp => {
      this.page = 1;
      this.clients = resp.data;
      this.paginate_data = resp;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.authUserServiceSubscription?.unsubscribe();

  }

  // ======================
  // UI Actions
  // ======================

  public onSearch(term: string): void {
    this.search_input = term;
    this.search$.next(term);
  }

  public getPage(event: number): void {
    this.spinner.show();
    this.page = event;

    this._clientService.index$(this.search_input, '', '', this.page).pipe(
      finalize(() => this.spinner.hide()),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (resp) => {
        this.clients = resp.data;
        this.paginate_data = resp;
      },
      error: (err) => {
        console.error(err);
        this.toastr.error('No se pudo cambiar de página.', 'Error');
      }
    });
  }

  public async delete(id: number, page: number, len: number): Promise<void> {
    const response = await showPreconfirmMessage(
      '¿Eliminar cliente?',
      'Esta acción no es reversible.'
    );

    if (!response.isConfirmed) return;

    this.spinner.show();
    try {
      await this._clientService.delete(id);

      const nextSearch = (len > 1) ? this.search_input : '';
      const nextPage = (len > 1) ? page : 1;

      this._clientService.index$(nextSearch, '', '', nextPage).pipe(
        finalize(() => this.spinner.hide()),
        takeUntil(this.destroy$)
      ).subscribe(resp => {
        this.search_input = nextSearch;
        this.page = nextPage;
        this.clients = resp.data;
        this.paginate_data = resp;
        this.toastr.success('Cliente eliminado.', 'Mensaje');
      });
    } catch (err) {
      console.error(err);
      this.spinner.hide();
      this.toastr.error('No se pudo eliminar.', 'Error');
    }
  }

  public sort(attribute: string, sort: 'ASC' | 'DESC', event: any): void {
    this.changeArrowStatus();
    event.target.classList.add('selected');

    this.is_searching = true;
    this._clientService.index$(this.search_input, sort, attribute, this.page).pipe(
      finalize(() => this.is_searching = false),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (resp) => {
        this.clients = resp.data;
        this.paginate_data = resp;
      },
      error: (err) => {
        console.error(err);
        this.toastr.error('No se pudo ordenar.', 'Error');
      }
    });
  }

  public sortResponsive(): void {
    this.is_searching = true;
    const nextSort: 'ASC' | 'DESC' = this.mobile_asc ? 'DESC' : 'ASC'; // keep your original mobile toggle

    this._clientService.index$(this.search_input, nextSort, this.orderSelect, this.page).pipe(
      finalize(() => {
        this.is_searching = false;
        this.mobile_asc = !this.mobile_asc;
      }),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (resp) => {
        this.clients = resp.data;
        this.paginate_data = resp;
      },
      error: (err) => {
        console.error(err);
        this.toastr.error('No se pudo ordenar.', 'Error');
      }
    });
  }

  public async createUser(client: any, role: string, page: number, len: number): Promise<void> {
    if (client.email.includes('@mail.com')) {
      this.toastr.error('Asigne un correo válido al cliente.', 'Error');
      return;
    }

    let user_message = '';
    switch (role) {
      case 'system_user':
        user_message = 'usuario de sistema';
        break;
      default:
        user_message = 'usuario';
    }

    const response = await showPreconfirmMessage(
      `¿Desea crear una cuenta de ${user_message}?`,
      '',
      'question',
      'Cancelar',
      'Crear'
    );

    if (!response.isConfirmed) return;

    this.spinner.show();
    try {
      await this._clientService.createUser(client.id, role);

      const nextSearch = (len > 1) ? this.search_input : '';
      const nextPage = (len > 1) ? page : 1;

      this._clientService.index$(nextSearch, '', '', nextPage).pipe(
        finalize(() => this.spinner.hide()),
        takeUntil(this.destroy$)
      ).subscribe(resp => {
        this.search_input = nextSearch;
        this.page = nextPage;
        this.clients = resp.data;
        this.paginate_data = resp;
        this.toastr.success('¡Cuenta creada exitosamente!', 'Mensaje');
      });
    } catch (err) {
      console.error(err);
      this.spinner.hide();
      this.toastr.error('No se pudo crear la cuenta.', 'Error');
    }
  }

  public async redirectToFiles(client: any): Promise<void> {
    const routerLink = `/home/clientes/${client.id}/ficheros-de-cliente`;
    this.router.navigateByUrl(routerLink);
  }

  public canShowAction() {
    const arr = [
      this._permissionService.checkPermission('create_client'),
      this._permissionService.checkPermission('edit_client'),
      this._permissionService.checkPermission('delete_client'),
      this._permissionService.checkPermission('create_operator'),
      this._permissionService.checkPermission('create_system_user'),
    ];
    return showAction(arr);
  }

  public tutorialStep(operation: string): void {

    switch (operation) {
      case 'add':
        this.tourStep++;
        break;

      case 'subtract':
        this.tourStep--
        break;
    }

  }

  goToNextStep() {
    this.tutorialStep('add');
  }

  goToPrevStep() {
    this.tutorialStep('subtract');
  }

  async finish(): Promise<void> {
    this.showTutorial = false;
    await this._authService.skipTutorial("client");
    this._sharedService.emitChange({ action: 'enableBody' });
    await this._authService.getAuthUser();

  }


  // ======================
  // Helpers
  // ======================

  private changeArrowStatus(): void {
    const elements = this.elRef.nativeElement.getElementsByClassName('order-arrow');
    for (const i in elements) {
      if (Object.prototype.hasOwnProperty.call(elements, i)) {
        const el = elements[i];
        if (el?.classList) {
          el.classList.remove('selected');
          el.classList.add('unselected');
        }
      }
    }
  }

  public scrollContainerToBottom(tries = 50): void {
    (document.activeElement as HTMLElement | null)?.blur();

    const host = this.scrollHost?.nativeElement;

    if (!host) return;

    this.lastRecordRef?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
    if (tries > 0) setTimeout(() => this.scrollContainerToBottom(tries - 1), 16);

  }
}
