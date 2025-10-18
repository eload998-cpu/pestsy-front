import { Component, OnDestroy, OnInit, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { faPlus, faEye, faPencil, faSearch, faTrash, faLongArrowUp, faLongArrowDown } from '@fortawesome/free-solid-svg-icons';

import { ConstructionTypeService as CRUDService } from 'src/app/services/administration/construction-type.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { showPreconfirmMessage, showAction } from 'src/app/shared/helpers';
import { PermissionService } from 'src/app/services/permission.service';

import { Subject, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, catchError, finalize, takeUntil, tap, map } from 'rxjs/operators';

@Component({
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss'],
    standalone: false
})
export class TableComponent implements OnInit, OnDestroy {

  @ViewChildren('orderArrow') orderArrow!: QueryList<any>;

  // icons
  public faPlus = faPlus;
  public faEye = faEye;
  public faPencil = faPencil;
  public faSearch = faSearch;
  public faTrash = faTrash;
  public faLongArrowUp = faLongArrowUp;
  public faLongArrowDown = faLongArrowDown;

  public search_input = '';
  public records: any[] = [];
  public paginate_data: any = [];
  public is_searching = false;
  public mobile_asc = true;
  public page = 1;
  public orderSelect: string = 'name';

  private destroy$ = new Subject<void>();
  private search$ = new Subject<string>();

  constructor(
    private _crudService: CRUDService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private elRef: ElementRef,
    public _permissionService: PermissionService
  ) { }

  ngOnInit(): void {

    this.spinner.show();
    this._crudService.index$('', '', '', this.page).pipe(
      finalize(() => this.spinner.hide()),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (resp) => {
        this.records = resp.data;
        this.paginate_data = resp;
      },
      error: (err) => {
        console.error(err);
        this.toastr.error('No se pudieron cargar los datos.', 'Error');
      }
    });

    this.search$.pipe(
      debounceTime(300),
      map(v => (v ?? '').trim()),
      distinctUntilChanged(),
      tap(() => this.is_searching = true),
      switchMap(term =>
        this._crudService.index$(term, '', '', 1).pipe(
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

  public async delete(id: number, page: number, len: number): Promise<void> {
    const response = await showPreconfirmMessage(
      '¿Eliminar registro?',
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
      ).subscribe(resp => {
        this.search_input = nextSearch;
        this.page = nextPage;
        this.records = resp.data;
        this.paginate_data = resp;
        this.toastr.success('Registro eliminado.', 'Mensaje');
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

  public canShowAction(display: boolean | null = null): boolean {
    if (display != null) return display;

    const arr = [
      this._permissionService.checkPermission('delete_aplication'),
    ];

    return showAction(arr);
  }
}
