import { Component, OnDestroy, OnInit, ElementRef, ViewChildren, QueryList } from '@angular/core';
import {
  faPlus, faEye, faPencil, faSearch, faTrash,
  faLongArrowUp, faLongArrowDown, faCloudDownload, faCheckSquare, faRefresh
} from '@fortawesome/free-solid-svg-icons';

// services
import { OrderService as CRUDService } from 'src/app/services/administration/order.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { showPreconfirmMessage } from 'src/app/shared/helpers';
import { Router } from '@angular/router';
import { PermissionService } from 'src/app/services/permission.service';
import { AuthUserService } from 'src/app/services/auth-user.service';
import { StateCodesService } from 'src/app/services/resources/state-codes.service';

// rxjs
import { Subject, combineLatest, of } from 'rxjs';
import {
  catchError, debounceTime, distinctUntilChanged, finalize,
  map, switchMap, take, takeUntil, tap, filter as rxFilter
} from 'rxjs/operators';

@Component({
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss'],
    standalone: false
})
export class TableComponent implements OnInit, OnDestroy {

  @ViewChildren('orderArrow') orderArrow!: QueryList<any>;
  stateCodes: any;

  // icons
  public faPlus = faPlus;
  public faEye = faEye;
  public faPencil = faPencil;
  public faSearch = faSearch;
  public faTrash = faTrash;
  public faLongArrowUp = faLongArrowUp;
  public faLongArrowDown = faLongArrowDown;
  public faCloudDownload = faCloudDownload;
  public faCheckSquare = faCheckSquare;
  public faRefresh = faRefresh;

  // state
  public bsValue1 = new Date();
  public bsValue2 = new Date();

  public filteredBsValue1: string | Date = '';
  public filteredBsValue2: string | Date = '';

  public search_input = '';

  public records: any[] = [];
  public is_searching = false;
  public paginate_data: any = [];
  public status: string = 'pending';
  public mobile_asc = true;
  public page = 1;
  public subscription_status_id: number;
  public orderSelect = 'order_number';
  public authUser: any;

  // reactive
  private destroy$ = new Subject<void>();
  private search$ = new Subject<string>();

  constructor(
    private _crudService: CRUDService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private elRef: ElementRef,
    private router: Router,
    public _permissionService: PermissionService,
    public _authService: AuthUserService,
    private stateCodesService: StateCodesService,
  ) { }

  ngOnInit(): void {
    // Load auth + state code once
    combineLatest([
      this._authService.userObservable.pipe(
        rxFilter((u: any) => !!u),
        take(1)
      ),
      this.stateCodesService.getStateCodes('subscription')
    ]).pipe(
      map(([authUser, stateCodes]) => {
        this.authUser = authUser;
        this.subscription_status_id = authUser.subscription.pivot.status_id;
        this.stateCodes = (stateCodes as any[]).find(c => c.id === this.subscription_status_id);
      }),
      takeUntil(this.destroy$)
    ).subscribe({ error: err => console.error('Error:', err) });

    // default date range: last 6 months
    this.bsValue1.setMonth(this.bsValue1.getMonth() - 6);

    // Initial load
    this.spinner.show();
    this._crudService.index$('', '', '', this.page, 0, this.status).pipe(
      finalize(() => this.spinner.hide()),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (resp) => {
        this.records = resp.data;
        this.paginate_data = resp;
      },
      error: (err) => {
        console.error(err);
        this.toastr.error('No se pudieron cargar las órdenes.', 'Error');
      }
    });

    // Debounced, cancellable search
    this.search$.pipe(
      debounceTime(300),
      map(v => (v ?? '').trim()),
      distinctUntilChanged(),
      tap(() => this.is_searching = true),
      switchMap(term =>
        this._crudService.index$(term, '', '', 1, 0, this.status, this.filteredBsValue1, this.filteredBsValue2).pipe(
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
      this.records = resp.data;
      this.paginate_data = resp;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ========== UI actions ==========

  // template: (input)="onSearch($any($event.target).value)"
  public onSearch(term: string): void {
    this.search_input = term;
    this.search$.next(term);
  }

  public getPage(event: number): void {
    this.spinner.show();
    this.page = event;

    this._crudService.index$(this.search_input, '', '', this.page, 0, this.status, this.filteredBsValue1, this.filteredBsValue2).pipe(
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

  public edit(id: number): void {
    this.router.navigateByUrl('home/ordenes/orden-tab', { state: { order_id: id } });
  }

  public async finish(id: number, page: number, len: number): Promise<void> {
    const response = await showPreconfirmMessage(
      '¿Finalizar orden?',
      'Esta acción no es reversible.',
      'warning',
      'Cancelar',
      'Finalizar'
    );
    if (!response.isConfirmed) return;

    this.spinner.show();
    try {
      await this._crudService.finish({ order_id: id });

      const nextSearch = (len > 1) ? this.search_input : '';
      const nextPage = (len > 1) ? page : 1;

      this._crudService.index$(nextSearch, '', '', nextPage, 0, this.status).pipe(
        finalize(() => this.spinner.hide()),
        takeUntil(this.destroy$)
      ).subscribe(resp => {
        this.search_input = nextSearch;
        this.page = nextPage;
        this.records = resp.data;
        this.paginate_data = resp;
        this.toastr.success('Orden finalizada exitosamente.', 'Mensaje');
      });
    } catch (err) {
      console.error(err);
      this.spinner.hide();
      this.toastr.error('No se pudo finalizar la orden.', 'Error');
    }
  }

  public async delete(id: number, page: number, len: number): Promise<void> {
    const response = await showPreconfirmMessage('¿Eliminar orden?', 'Esta acción no es reversible.');
    if (!response.isConfirmed) return;

    this.spinner.show();
    try {
      await this._crudService.delete(id);

      const nextSearch = (len > 1) ? this.search_input : '';
      const nextPage = (len > 1) ? page : 1;

      this._crudService.index$(nextSearch, '', '', nextPage, 0, this.status).pipe(
        finalize(() => this.spinner.hide()),
        takeUntil(this.destroy$)
      ).subscribe(resp => {
        this.search_input = nextSearch;
        this.page = nextPage;
        this.records = resp.data;
        this.paginate_data = resp;
        this.toastr.success('Orden eliminada.', 'Mensaje');
      });
    } catch (err) {
      console.error(err);
      this.spinner.hide();
      this.toastr.error('No se pudo eliminar la orden.', 'Error');
    }
  }

  public reset(): void {
    this.spinner.show();

    this.search_input = '';
    this.bsValue1 = new Date();
    this.bsValue2 = new Date();
    this.bsValue1.setMonth(this.bsValue1.getMonth() - 6);


    this.filteredBsValue1 = '';
    this.filteredBsValue2 = '';


    this._crudService.index$('', '', '', null, 0, this.status, '', '')
      .pipe(finalize(() => this.spinner.hide()))
      .subscribe(resp => {
        this.records = resp.data;
        this.paginate_data = resp;
      }, err => {
        console.error(err);
        this.toastr.error('No se pudo filtrar.', 'Error');
      });
  }

  public filter(_event?: Event): void {
    this.spinner.show();

    this.filteredBsValue1 = this.bsValue1;
    this.filteredBsValue2 = this.bsValue2;

    this._crudService.filter$('', '', '', null, 0, this.status, this.bsValue1, this.bsValue2).pipe(
      finalize(() => this.spinner.hide()),
      takeUntil(this.destroy$),
      catchError(err => {
        console.error(err);
        this.toastr.error('No se pudo filtrar.', 'Error');
        return of({ data: [], total: 0 });
      })
    ).subscribe(resp => {
      this.records = resp.data;
      this.paginate_data = resp;
    });
  }

  public sort(attribute: string, sort: 'ASC' | 'DESC', event: any): void {
    this.changeArrowStatus();
    event.target.classList.add('selected');

    this.is_searching = true;
    this._crudService.index$(this.search_input, sort, attribute, this.page, 0, this.status).pipe(
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

    this._crudService.index$(this.search_input, nextSort, this.orderSelect, this.page, 0, this.status).pipe(
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

  // ===== helpers =====

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

  public download(id: number): void {
    this._crudService.downloadFile(id);
  }

  public preview(id: number): void {
    this._crudService.preview(id);
  }
}
