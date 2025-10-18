import { Component, OnDestroy, OnInit, ElementRef, ViewChild, ViewChildren, QueryList, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import {
  faPlus, faEye, faPencil, faSearch, faTrash,
  faLongArrowUp, faLongArrowDown, faCloudDownload, faEnvelope, faRefresh
} from '@fortawesome/free-solid-svg-icons';
import { OrderService as CRUDService } from 'src/app/services/administration/order.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { showPreconfirmMessage } from 'src/app/shared/helpers';
import { PermissionService } from 'src/app/services/permission.service';
import { AuthUserService } from 'src/app/services/auth-user.service';
import { TourService } from 'src/app/shared/services/tour.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { AuthService } from 'src/app/services/auth.service';
import { Device, DeviceInfo } from '@capacitor/device';
import { NgZone } from '@angular/core';

import { Subject, of, from } from 'rxjs';
import {
  debounceTime, distinctUntilChanged, switchMap, catchError, finalize,
  takeUntil, tap, map
} from 'rxjs/operators';

@Component({
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss'],
    standalone: false
})
export class TableComponent implements OnInit, OnDestroy {

  @ViewChildren('orderArrow') orderArrow!: QueryList<any>;
  @ViewChild('lastRecord') lastRecordRef!: ElementRef<HTMLElement>;

  @ViewChild('scrollHost', { static: false }) scrollHost!: ElementRef<HTMLElement>;
  @ViewChild('bottomAnchor', { static: false }) bottomAnchor!: ElementRef<HTMLElement>;

  // icons
  public faPlus = faPlus;
  public faEye = faEye;
  public faPencil = faPencil;
  public faSearch = faSearch;
  public faTrash = faTrash;
  public faLongArrowUp = faLongArrowUp;
  public faLongArrowDown = faLongArrowDown;
  public faCloudDownload = faCloudDownload;
  public faEnvelope = faEnvelope;
  public faRefresh = faRefresh;



  // state
  public bsValue1 = new Date();
  public bsValue2 = new Date();

  public filteredBsValue1: string | Date = '';
  public filteredBsValue2: string | Date = '';
  public search_input = '';

  public records: any[] = [];
  public paginate_data: any = [];
  public is_searching = false;
  public status: string = 'completed';
  public mobile_asc = true;
  public page = 1;
  public isMobile = false;
  public orderSelect = 'order_number';
  public is_mobile = this._sharedService.isMobile;
  public downloadClassMobile: string[] = [];
  public downloadClassDesktop: string[] = [];
  public downloadClassDesktopOperator: string[] = [];
  public dClass = '';
  public tourStep = 1;

  // reactive
  private destroy$ = new Subject<void>();
  private search$ = new Subject<string>();


  // ===== Tour controls (used by template) =====
  goToNextStep = () => this.orderTutorialStep('add');
  goToPrevStep = () => this.orderTutorialStep('subtract');


  constructor(
    private _crudService: CRUDService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private elRef: ElementRef,
    public _permissionService: PermissionService,
    public _authService: AuthUserService,
    private _orderTourService: TourService,
    private _sharedService: SharedService,
    private _authUserService: AuthService,
    private zone: NgZone,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.spinner.show();

    // default date range: last 6 months
    this.bsValue1.setMonth(this.bsValue1.getMonth() - 6);

    // initial load
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

    // device info (don’t block init)
    from(Device.getInfo()).pipe(takeUntil(this.destroy$)).subscribe((info) => {
      const deviceInfo = info as unknown as DeviceInfo;
      this.isMobile = (deviceInfo.platform !== 'web');
      this.dClass = this._authService.hasRole('operator') ? 'fumigation-tab__1--operator' : ' fumigation-tab__1';
      this.downloadClassMobile = ['list__tutorial-4', 'tutorial', 'tutorial__item', 'show-tutorial', this.dClass];
      this.downloadClassDesktop = ['list__tutorial-2', 'tutorial', 'tutorial__item', 'show-tutorial', this.dClass];
      this.downloadClassDesktopOperator = [
        'list__tutorial-2', 'tutorial', 'tutorial__item', 'show-tutorial',
        this._authService.hasRole('operator') ? 'fumigation-tab__2--operator' : ' fumigation-tab__2'
      ];
    });

    // tour subscription
    this._orderTourService.currentOrderTourValue$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(({ component, step }) => {
      this.tourStep = step;
      if (step === 11) {
        if (this.is_mobile) {
          this.cdRef.detectChanges();
          this.zone.runOutsideAngular(() => {
            requestAnimationFrame(() => this.scrollContainerToBottom());
          });
        }

        this._authUserService.skipTutorial('order');
      }
    });

    // debounced, cancellable search
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

  // ===== UI actions =====

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

  public async delete(id: number, page: number, len: number): Promise<void> {
    const response = await showPreconfirmMessage('¿Eliminar Orden?', 'Esta acción no es reversible.');
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

  private orderTutorialStep(operation: 'add' | 'subtract'): void {
    let componentName: string | undefined;

    switch (operation) {
      case 'add':
        // Mobile: skip preview step
        if (this.tourStep === 11 && this.is_mobile) this.tourStep++;
        // Operator: skip end step
        if (this.tourStep === 12 && this._authService.hasRole('operator')) this.tourStep++;
        this.tourStep++;
        break;
      case 'subtract':
        this.tourStep--;
        break;
    }

    switch (this.tourStep) {
      case 1:
        componentName = 'create-order';
        break;
      case 3:
        componentName = 'order-tabs';
        break;
    }

    this._orderTourService.next({
      component: componentName,
      step: this.tourStep,
      showTutorial: true,
      disableBody: true,
    });
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

    this._crudService.filter$('', '', '', null, 0, this.status, this.bsValue1, this.bsValue2)
      .pipe(finalize(() => this.spinner.hide()))
      .subscribe(resp => {
        this.records = resp.data;
        this.paginate_data = resp;
      }, err => {
        console.error(err);
        this.toastr.error('No se pudo filtrar.', 'Error');
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

  public download(id: number): void {
    this._crudService.downloadFile(id);
  }

  public async resend(id: number): Promise<void> {
    const response = await showPreconfirmMessage(
      '¿Reenviar Correo?',
      'Esta acción no es reversible.',
      'warning',
      'Cancelar',
      'Reenviar',
    );
    if (!response.isConfirmed) return;

    this.spinner.show();
    try {
      await this._crudService.resend(id);
      this.toastr.success('Correo reenviado exitosamente.', 'Mensaje');
    } catch (err) {
      console.error(err);
      this.toastr.error('No se pudo reenviar el correo.', 'Error');
    } finally {
      this.spinner.hide();
    }
  }

  public preview(id: number): void {
    this._crudService.preview(id);
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



  public scrollContainerToBottom(tries = 20): void {
    (document.activeElement as HTMLElement | null)?.blur();

    const host = this.scrollHost?.nativeElement;
    if (!host) return;

    this.lastRecordRef?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
    if (tries > 0) setTimeout(() => this.scrollContainerToBottom(tries - 1), 16);

  }





}
