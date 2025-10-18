import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';

import { ContactRoutingModule } from './contact-routing.module';
import { CreateComponent } from './create/create.component';
import { ShowResolverService } from 'src/app/services/solvers/administration/aplications/show-resolver.service';
import { PermissionGuard } from 'src/app/guards/permission.guard';

import { ContactService } from 'src/app/services/administration/contact.service';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

@NgModule({
  declarations: [
    CreateComponent,
  ],
  imports: [
    CommonModule,
    ContactRoutingModule,
    FontAwesomeModule,
    SharedModule,
    CKEditorModule
  ],
  providers: [
    ShowResolverService,
    PermissionGuard,
    ContactService
  ]
})
export class ContactModule { }