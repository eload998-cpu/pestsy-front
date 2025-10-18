import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { NgSelectModule, NgSelectConfig } from '@ng-select/ng-select';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDatepickerModule, BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
defineLocale('es', esLocale);
import { ModalModule, BsModalService } from 'ngx-bootstrap/modal';
import { PaginatorComponent } from 'src/app/shared/components/paginator/paginator.component';
import { MobileFileUploaderComponent } from 'src/app/shared/components/file-uploader/mobile/mobile-file-uploader.component';
import { DesktopFileUploaderComponent } from 'src/app/shared/components/file-uploader/desktop/desktop-file-uploader.component';

import { DragDropFileUploadDirective } from 'src/app/directives/drag-drop-file-upload.directive';
import { CountUpDirective } from 'src/app/directives/count-up.directive';
import { TitleCasePipe } from 'src/app/pipe/title-case.pipe';
import { OnlyNumberDirective } from 'src/app/directives/only-number.directive';
import { OnlyLettersDirective } from 'src/app/directives/only-letter-directive';
import { DoseDirective } from 'src/app/directives/dose-directive';
import { CodeDirective } from 'src/app/directives/code-directive';
import { StationCodeDirective } from 'src/app/directives/station-code.directive';
import { TourComponent } from './components/tour/desktop/order/tour.component';
import { MobileTourComponent } from './components/tour/mobile/order/mobile-tour.component';
import { TemperatureDirective } from '../directives/temperature-directive';
import { ChlorineDirective } from '../directives/chlorine-directive';

@NgModule({
  declarations: [
    PaginatorComponent,
    MobileFileUploaderComponent,
    DesktopFileUploaderComponent,
    TourComponent,
    MobileTourComponent,
    DragDropFileUploadDirective,
    CountUpDirective,
    OnlyNumberDirective,
    OnlyLettersDirective,
    DoseDirective,
    TemperatureDirective,
    ChlorineDirective,
    TitleCasePipe,
    CodeDirective,
    StationCodeDirective

  ],
  imports: [
    CommonModule,
    ModalModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot({
      timeOut: 5000,
      preventDuplicates: true,
      enableHtml: true
    }),
    CollapseModule.forRoot(),
    BsDatepickerModule.forRoot(),
    TimepickerModule.forRoot(),

  ],
  exports: [
    CommonModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule,
    CollapseModule,
    BsDatepickerModule,
    TimepickerModule,
    PaginatorComponent,
    MobileFileUploaderComponent,
    DesktopFileUploaderComponent,
    TourComponent,
    MobileTourComponent,
    ModalModule,
    DragDropFileUploadDirective,
    CountUpDirective,
    OnlyNumberDirective,
    OnlyLettersDirective,
    TitleCasePipe,
    DoseDirective,
    TemperatureDirective,
    ChlorineDirective,
    CodeDirective,
    StationCodeDirective

  ],
  providers: [
    BsDatepickerConfig,
    BsModalService
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class SharedModule {
  constructor(
    private bsLocaleService: BsLocaleService,
    private _ngCongifService: NgSelectConfig
  ) {
    this.bsLocaleService.use('es');//fecha en español, datepicker
    this._ngCongifService.addTagText = 'Enter para agregar opción';
    this._ngCongifService.notFoundText = 'Sin opciones';
    this._ngCongifService.placeholder = 'Seleccione una opción';
    this._ngCongifService.loadingText = "Espere...";
    this._ngCongifService.clearAllText = "Limpiar";
  }
}