import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faLongArrowUp } from '@fortawesome/free-solid-svg-icons';
import { faLongArrowDown } from '@fortawesome/free-solid-svg-icons';

//services
import { DesinfectionService as CrudService } from 'src/app/services/administration/desinfection.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";
import { showPreconfirmMessage, showAction } from 'src/app/shared/helpers';
import { PaginatorComponent } from 'src/app/shared/components/paginator/paginator.component';
import { PermissionService } from 'src/app/services/permission.service';

@Component({
    templateUrl: './table.component.html',
    styleUrls: [
        './table.component.scss'
    ],
    standalone: false
})
export class TableComponent implements OnInit {


  @ViewChildren("orderArrow") orderArrow!: QueryList<any>


  public constructor(
    private _crudService: CrudService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private elRef: ElementRef,
    public _permissionService: PermissionService

  ) {

  }

  public faPlus = faPlus;
  public faEye = faEye;
  public faPencil = faPencil;
  public faSearch = faSearch;
  public faTrash = faTrash;
  public faLongArrowUp = faLongArrowUp;
  public faLongArrowDown = faLongArrowDown;

  public search_input: string = '';

  public records: any = [];
  public is_searching: boolean = false;
  public paginate_data: any = [];
  public mobile_asc: boolean = true;
  public page = 1;
  public orderSelect = "name";

  public async ngOnInit() {
    this.spinner.show();

    let resp = await this._crudService.index();

    this.records = resp.data;
    this.paginate_data = resp;

    this.spinner.hide();


  }

  public async getPage(event: any) {
    this.spinner.show();

    this.page = event;
    let resp = await this._crudService.index(this.search_input, '', '', this.page);
    this.records = resp.data;
    this.paginate_data = resp;
    this.spinner.hide();

  }


  public async delete(id: number, page: number, len: number) {
    const response = await showPreconfirmMessage(
      "Eliminar Metodo de desinfección?",
      "Esta acción no es reversible."
    );

    if (response.isConfirmed) {
      this.spinner.show();

      await this._crudService.delete(id);
      this.search_input = (len > 1) ? this.search_input : '';
      let resp = await this._crudService.index((len > 1) ? this.search_input : '', '', '', (len > 1) ? page : null);
      this.records = resp.data;
      this.paginate_data = resp;
      this.spinner.hide();

      this.toastr.success("Metodo de desinfección eliminado.", "Mensaje");
    }
  }


  public async search(event: any) {

    this.is_searching = true;

    let resp = await this._crudService.index(event);

    this.is_searching = false;

    this.records = resp.data;
    this.paginate_data = resp;

  }


  public async sort(attribute: string, sort: string, event: any) {


    this.changeArrowStatus();
    event.target.classList.add('selected');

    this.is_searching = true;

    let resp = await this._crudService.index(this.search_input, sort, attribute, this.page);

    this.is_searching = false;

    this.records = resp.data;
    this.paginate_data = resp;


  }

  public async sortResponsive() {

    this.is_searching = true;

    let resp = await this._crudService.index(this.search_input, (this.mobile_asc) ? 'ASC' : 'DESC', this.orderSelect, this.page);

    this.is_searching = false;
    this.mobile_asc = !this.mobile_asc;

    this.records = resp.data;
    this.paginate_data = resp;


  }


  private changeArrowStatus() {

    let elements = this.elRef.nativeElement.getElementsByClassName(`order-arrow`);


    for (const i in elements) {

      if (elements[i].classList) {
        elements[i].classList.remove('selected');
        elements[i].classList.add('unselected');

      }

    }



  }

  public canShowAction(display: boolean | null = null) {


    if (display != null) {
      return display;
    }

    let arr = [
      this._permissionService.checkPermission('delete_aplication'),

    ]

    return showAction(arr)
  }


}
