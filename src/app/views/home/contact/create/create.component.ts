import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

//DEPENDENCIES
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";

//SERVICES
import { ContactService as CrudService } from 'src/app/services/administration/contact.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ClassicEditor, Bold, Essentials, Italic, Mention, Paragraph, Undo, Image, ImageToolbar, ImageUpload, ImageCaption, ImageStyle, Base64UploadAdapter, Table, TableToolbar, List } from 'ckeditor5';

@Component({
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.scss'],
    standalone: false
})
export class CreateComponent implements OnInit {

  public faArrowLeft = faArrowLeft;
  public faPlus = faPlus;

  public sendingForm: boolean = false;
  public is_mobile = this.sharedService.isMobile;


  public model = {
    editorData: ''
  };

  public Editor = ClassicEditor;
  public config = {
    toolbar: [
      'undo', 'redo', '|', 'bold', 'italic', '|', 'bulletedList', 'numberedList', '|', 'uploadImage', '|', 'insertTable'

    ],
    plugins: [
      Bold, Essentials, Italic, Mention, Paragraph, Undo,
      Image, ImageToolbar, ImageUpload, ImageCaption, ImageStyle, Base64UploadAdapter,
      Table, TableToolbar, List

    ],
    image: {
      toolbar: [
        'imageTextAlternative', '|',
        'imageStyle:inline', 'imageStyle:block', 'imageStyle:side'
      ]
    },
    table: {
      contentToolbar: [
        'tableColumn', 'tableRow', 'mergeTableCells'
      ]
    }

  }


  constructor(
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private _crudService: CrudService,
    private sharedService: SharedService

  ) {


  }

  ngOnInit(): void {
  }

  public async onSubmit(): Promise<void> {

    try {


      this.sendingForm = true;
      this.spinner.show();

      let resp=await this._crudService.store({data:this.model.editorData});

      this.clearForm();
      this.spinner.hide();
      this.toastr.success('Informacion enviada exitosamente', 'Mensaje');




    }
    finally {
      this.sendingForm = false;
      this.spinner.hide();

    }
  }

  private clearForm(): void {
    this.sendingForm = false;

    this.model.editorData='';

  }



}
