import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faLongArrowUp } from '@fortawesome/free-solid-svg-icons';
import { faLongArrowDown } from '@fortawesome/free-solid-svg-icons';

//services
import { RodentControlService as CRUDService } from 'src/app/services/administration/rodent-control.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";
import { showPreconfirmMessage } from 'src/app/shared/helpers';
import { PaginatorComponent } from 'src/app/shared/components/paginator/paginator.component';
import { ActivatedRoute } from '@angular/router';

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
    private _crudService: CRUDService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private elRef: ElementRef,
    private route: ActivatedRoute

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
  public order_id: any = null;
  public mobile_asc: boolean = true;
  public page = 1;
  public orderSelect ="device_number";

  public async ngOnInit() {
    this.spinner.show();
    this.order_id = this.route.snapshot.params["id"];
    let resp = await this._crudService.index('', '', '', 1, this.order_id);

    this.records = resp.data;
    this.paginate_data = resp;

    this.spinner.hide();


  }

  public async getPage(event: any) {
    this.spinner.show();

    this.page = event;
    let resp = await this._crudService.index(this.search_input, '', '', this.page, this.order_id);
    this.records = resp.data;
    this.paginate_data = resp;
    this.spinner.hide();

  }


  public async delete(id: number) {
    const response = await showPreconfirmMessage(
      "Eliminar Control de roedor?",
      "Esta acción no es reversible."
    );

    if (response.isConfirmed) {
      this.spinner.show("Eliminando...");

      await this._crudService.delete(id);

      this.records = this.records.filter((_record: any) => _record.id !== id);
      let resp = await this._crudService.index('', '', '', 1, this.order_id);
      this.paginate_data = resp;

      this.toastr.success("Control de roedor eliminado.", "Mensaje");
    }
  }


  public async search(event: any) {

    this.is_searching = true;

    let resp = await this._crudService.index(event, '', '', 1, this.order_id);

    this.is_searching = false;

    this.records = resp.data;
    this.paginate_data = resp;

  }


  public async sort(attribute: string, sort: string, event: any) {


    this.changeArrowStatus();
    event.target.classList.add('selected');

    this.is_searching = true;

    let resp = await this._crudService.index(this.search_input, sort, attribute, this.page, this.order_id);

    this.is_searching = false;

    this.records = resp.data;
    this.paginate_data = resp;


  }

  public async sortResponsive() {

    this.is_searching = true;

    let resp = await this._crudService.index(this.search_input, (this.mobile_asc) ? 'ASC' : 'DESC', this.orderSelect, this.page, this.order_id);

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


}
