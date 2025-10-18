import { Component, OnDestroy, OnInit, ElementRef, ViewChildren, ViewChild, QueryList, ChangeDetectorRef } from '@angular/core';
import { faPlus, faEye, faPencil, faSearch, faTrash, faLongArrowUp, faLongArrowDown, faUser } from '@fortawesome/free-solid-svg-icons';

// services
import { WorkerService as CRUDService } from 'src/app/services/administration/worker.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { showPreconfirmMessage, showAction } from 'src/app/shared/helpers';
import { PermissionService } from 'src/app/services/permission.service';

// rxjs
import { Subject, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, catchError, finalize, takeUntil, tap, map } from 'rxjs/operators';
import { SharedService } from 'src/app/shared/services/shared.service';
import { AuthUserService } from 'src/app/services/auth-user.service';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';
import { NgZone } from '@angular/core';


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

  // state
  public search_input = '';
  public records: any[] = [];
  public paginate_data: any = [];
  public is_searching = false;
  public mobile_asc = true;
  public page = 1;
  public orderSelect = 'name';


  public tourStep: number = 1;
  public showTutorial: boolean = false;

  // reactive
  private destroy$ = new Subject<void>();
  private search$ = new Subject<string>();
  public is_mobile = this._sharedService.isMobile;
  public authUserServiceSubscription!: Subscription;
  public authUser: any;

  constructor(
    private _crudService: CRUDService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private elRef: ElementRef,
    public _permissionService: PermissionService,
    private _sharedService: SharedService,
    private _authUserService: AuthUserService,
    private _authService: AuthService,
    private zone: NgZone,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {


    this.authUserServiceSubscription = this._authUserService.userObservable.subscribe(
      (authUser: any) => {
        this.authUser = authUser;
        this.showTutorial = (!this.authUser.tutorials.worker_tutorial && (this.authUser.roles[0].name != "operator" && this.authUser.roles[0].name != "fumigator")) ? true : false;

      }
    );
    // Initial load
    this.spinner.show();
    this._crudService.index$('', '', '', this.page).pipe(
      finalize(() => this.spinner.hide()),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (resp) => {
        this.records = resp.data;

        if (this.records.length != 0 && this.showTutorial) {

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
        this._crudService.index$(term, '', '', 1).pipe( // reset to page 1 on new search
          catchError(err => {
            console.error(err);
            this.toastr.error('Búsqueda fallida.', 'Error');
            return of({ data: [], total: 0 });
          }),
          finalize(() => this.is_searching = false)
        )
      ),
      takeUntil(this.destroy$)
    ).subscribe((resp) => {
      this.page = 1;
      this.records = resp.data;
      this.paginate_data = resp;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ===== UI Actions =====

  // template: (input)="onSearch($any($event.target).value)"
  public onSearch(term: string): void {
    this.search_input = term;
    this.search$.next(term);
  }

  public getPage(event: number): void {
    this.spinner.show();
    this.page = event;

    this._crudService.index$(this.search_input, '', '', this.page).pipe(
      finalize(() => this.spinner.hide()),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (resp) => {
        this.records = resp.data;
        this.paginate_data = resp;
      },
      error: (err) => {
        console.error(err);
        this.toastr.error('No se pudo cambiar de página.', 'Error');
      }
    });
  }

  public async createUser(worker: any, role: string, page: number, len: number) {


    if (worker.email.includes('@mail.com')) {
      this.toastr.error("Asigne un correo valido al técnico.", "error");
      return;
    }

    let user_message = '';
    switch (role) {
      case "operator":
        user_message = 'operador'
        break;
    }
    const response = await showPreconfirmMessage(
      `Desea crear una cuenta de ${user_message}?`,
      "",
      "question",
      "Cancelar",
      "Crear"
    );

    if (response.isConfirmed) {
      this.spinner.show();

      await this._crudService.createUser(worker.id, role);

      this.search_input = (len > 1) ? this.search_input : '';
      let resp = await this._crudService.index((len > 1) ? this.search_input : '', '', '', (len > 1) ? page : null);
      this.records = resp.data;
      this.paginate_data = resp;
      this.spinner.hide();

      this.toastr.success("Cuenta creada exitosamente!.", "Mensaje");
    }
  }

  public async delete(id: number, page: number, len: number): Promise<void> {
    const response = await showPreconfirmMessage(
      '¿Eliminar Técnico?',
      'Esta acción no es reversible.'
    );
    if (!response.isConfirmed) return;

    this.spinner.show();
    try {
      await this._crudService.delete(id);

      const nextSearch = (len > 1) ? this.search_input : '';
      const nextPage = (len > 1) ? page : 1;

      this._crudService.index$(nextSearch, '', '', nextPage).pipe(
        finalize(() => this.spinner.hide()),
        takeUntil(this.destroy$)
      ).subscribe((resp) => {
        this.search_input = nextSearch;
        this.page = nextPage;
        this.records = resp.data;
        this.paginate_data = resp;
        this.toastr.success('Técnico eliminado.', 'Mensaje');
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
    this._crudService.index$(this.search_input, sort, attribute, this.page).pipe(
      finalize(() => this.is_searching = false),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (resp) => {
        this.records = resp.data;
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
    const nextSort: 'ASC' | 'DESC' = this.mobile_asc ? 'ASC' : 'DESC';

    this._crudService.index$(this.search_input, nextSort, this.orderSelect, this.page).pipe(
      finalize(() => {
        this.is_searching = false;
        this.mobile_asc = !this.mobile_asc;
      }),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (resp) => {
        this.records = resp.data;
        this.paginate_data = resp;
      },
      error: (err) => {
        console.error(err);
        this.toastr.error('No se pudo ordenar.', 'Error');
      }
    });
  }

  // ===== Helpers =====

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

  public canShowAction() {
    const arr = [
      this._permissionService.checkPermission('delete_worker'),
    ];
    return showAction(arr);
  }
  public scrollContainerToBottom(tries = 50): void {
    (document.activeElement as HTMLElement | null)?.blur();

    const host = this.scrollHost?.nativeElement;

    if (!host) return;

    this.lastRecordRef?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
    if (tries > 0) setTimeout(() => this.scrollContainerToBottom(tries - 1), 16);

  }

  async finish(): Promise<void> {
    this.showTutorial = false;
    await this._authService.skipTutorial("worker");
    this._sharedService.emitChange({ action: 'enableBody' });
    await this._authService.getAuthUser();

  }

  goToNextStep() {
    this.tutorialStep('add');
  }

  goToPrevStep() {
    this.tutorialStep('subtract');
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

}
