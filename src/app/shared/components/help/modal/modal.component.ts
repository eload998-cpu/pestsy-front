import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { HelpService } from 'src/app/shared/services/help.service';
import { AuthUserService } from 'src/app/services/auth-user.service';
import { NgxSpinnerService } from "ngx-spinner";
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
    selector: 'help-modal',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.scss'],
    standalone: false
})
export class ModalComponent implements OnInit {

  public modal: any = {
    title: "",
    content: [],
    src: [],
    current: 0,
    status: 0
  };

  public isMobile = this.sharedService.isMobile;
  public role_name: string;
  public authUser: any;
  public faTimes = faTimes;


  constructor(
    private router: Router,
    private _helpService: HelpService,
    private _authUserService: AuthUserService,
    private spinner: NgxSpinnerService,
    private sharedService: SharedService

  ) {

    _helpService.changeEmitted$.subscribe(value => {

      if (value.action != null) {
        this.helpOptions(value.action);
      }

    });

    this._authUserService.userObservable.subscribe(
      (authUser: any) => {
        this.authUser = authUser;

        if (this.authUser) {
          this.role_name = this.authUser.roles[0].display_name;

        }
      }
    );
  }

  /*
  public ngOnChanges(changes: SimpleChanges) {
    
    if (changes["selected_option"].currentValue) {
      this.modal.status = 1;
      this.helpOptions(this.selected_option);
    }
  }*/


  public closeModal() {
    this.modal.status = 0;
    this.modal.src = [];
    this._helpService.emitChange({ action: null });

  }

  public async ngOnInit(): Promise<any> {


  }



  public helpOptions(value: string): void {


    switch (value) {

      case 'graphic':
        this.dashboardHelp(value);

        break;


      case 'user':

        this.clientHelp(value);


        break;

      case 'user_file':

        this.clientHelp(value);


        break;

      case 'operator':

        this.workerHelp(value);

        break;

      case 'resend_order':

        this.orderHelp(value);

        break;

      case 'download_order':

        this.orderHelp(value);

        break;

      case 'preview_order':

        this.orderHelp(value);

        break;

      case 'edit_order':

        this.orderHelp(value);

        break;

      case 'discard_order':

        this.orderHelp(value);

        break;

      case 'pending_order':

        this.orderHelp(value);

        break;

      case 'finish_order':

        this.orderHelp(value);

        break;

      case 'see_order_module':

        this.orderHelp(value);

        break;

    }


    //ORDERS



  }


  public orderHelp(value: string): void {

    switch (value) {
      case 'resend_order':

        this.modal.title = "¿Cómo reenvío una orden?"
        this.modal.content = [
          "Para reenviar una orden, haga clic en el botón con el icono de correo",
          "Luego haga clic en reenviar"
        ];
        this.modal.src =
          [
            "assets/images/help/list-orders/resend.webp",
            "assets/images/help/list-orders/resend-2.webp",

          ];

        this.spinner.show();
        this.modal.src.forEach((imgSrc: string) => {
          new Image().src = imgSrc;
        });
        this.spinner.hide();
        this.modal.status = 1;
        this.modal.current = 0;

        break;

      case 'download_order':

        this.modal.title = "¿Cómo descargo una orden?"
        this.modal.content = [
          "Para descargar una orden, haga clic en el botón con el icono de descarga",
          "Esto descargará el documento automáticamente a su dispositivo"
        ];

        if (this.role_name == "administrator" || this.role_name == "super_administrator" || this.role_name == "operator") {
          this.modal.src =
            [
              "assets/images/help/list-orders/download.webp",
            ];
        } else {
          this.modal.src =
            [
              "assets/images/help/list-orders/download-system-user-1.webp",
            ];
        }

        this.spinner.show();
        this.modal.src.forEach((imgSrc: string) => {
          new Image().src = imgSrc;
        });
        this.spinner.hide();
        this.modal.status = 1;

        this.modal.current = 0;

        break;


      case 'preview_order':

        this.modal.title = "¿Cómo puedo ver mi orden?"
        this.modal.content = [
          "Para visualizar una orden, haga clic en el botón con el icono de ojo",
          "Esto le permitirá previsualizar el documento"
        ];

        if (this.role_name == "administrator" || this.role_name == "super_administrator" || this.role_name == "operator") {
          this.modal.src =
            [
              "assets/images/help/list-orders/preview.webp",
            ];

        } else {
          this.modal.src =
            [
              "assets/images/help/list-orders/preview-system-user-1.webp",
            ];

        }

        this.spinner.show();
        this.modal.src.forEach((imgSrc: string) => {
          new Image().src = imgSrc;
        });
        this.spinner.hide();
        this.modal.status = 1;
        this.modal.current = 0;

        break;


      case 'edit_order':

        this.modal.title = "¿Cómo puedo editar mi orden?"
        this.modal.content = [
          "Para editar una orden, asegúrese de encontrarse en la pestaña 'Pendientes' y haga clic en el botón con el icono de lápiz",
        ];
        this.modal.src =
          [
            "assets/images/help/list-orders/edit.png",
          ];


        this.spinner.show();
        this.modal.src.forEach((imgSrc: string) => {
          new Image().src = imgSrc;
        });
        this.spinner.hide();
        this.modal.status = 1;

        this.modal.current = 0;

        break;

      case 'see_order_module':

        this.modal.title = "¿Cómo puedo ver mi orden?"
        this.modal.content = [
          "Para visualizar sus órdenes diríjase a la pestaña 'órdenes' en el menú de opciones",
        ];
        this.modal.src =
          [
            "assets/images/help/orders/see-order.png",
          ];


        this.spinner.show();
        this.modal.src.forEach((imgSrc: string) => {
          new Image().src = imgSrc;
        });
        this.spinner.hide();
        this.modal.status = 1;

        this.modal.current = 0;

        break;

      case 'discard_order':

        this.modal.title = "¿Cómo descarto una orden?"
        this.modal.content = [
          "Para descartar una orden presione el botón descartar, esto hará que la orden que está realizando sea desechada",
        ];
        this.modal.src =
          [
            "assets/images/help/orders/discard.png",
          ];


        this.spinner.show();
        this.modal.src.forEach((imgSrc: string) => {
          new Image().src = imgSrc;
        });
        this.spinner.hide();
        this.modal.status = 1;

        this.modal.current = 0;

        break;

      case 'pending_order':

        this.modal.title = "¿Cómo paso a pendiente una orden?"
        this.modal.content = [
          "Para pasar una orden a pendiente presione el botón 'pendiente'",
          "Esto hará que su orden sea enviada al módulo de listado de órdenes, podrá encontrarla en la pestaña 'pendientes'",
          "Esta opción es útil si desea terminar la orden en otro momento, cualquiera de sus operadores puede continuar con ella si así lo desea"
        ];
        this.modal.src =
          [
            "assets/images/help/orders/pending.png",
          ];


        this.spinner.show();
        this.modal.src.forEach((imgSrc: string) => {
          new Image().src = imgSrc;
        });
        this.spinner.hide();
        this.modal.status = 1;

        this.modal.current = 0;


        break;


      case 'finish_order':

        this.modal.title = "¿Cómo finalizo una orden?"
        this.modal.content = [
          "Para finalizar una orden, presione el botón 'finalizar'",
          "Esto hará que su orden sea enviada al módulo de listado de órdenes, podrá encontrarla en la pestaña de 'completadas'",
          "Una vez finalice la orden, esta seria enviada al correo de su cliente con todos los datos proporcionados"
        ];
        this.modal.src =
          [
            "assets/images/help/orders/finish.png",
          ];


        this.spinner.show();
        this.modal.src.forEach((imgSrc: string) => {
          new Image().src = imgSrc;
        });
        this.spinner.hide();
        this.modal.status = 1;

        this.modal.current = 0;

        break;




    }
  }

  public dashboardHelp(value: string): void {

    switch (value) {
      case 'graphic':

        this.modal.title = "¿Cómo  utilizo la gráfica?"
        this.modal.content = [
          "Para graficar primero deberá seleccionar el módulo y periodo que prefiera",
          "Luego, utilice el botón de búsqueda para ver los resultados"
        ];
        this.modal.src =
          [
            "assets/images/help/dashboard/graficar-1.webp",

          ];

        this.spinner.show();
        this.modal.src.forEach((imgSrc: string) => {
          new Image().src = imgSrc;
        });
        this.spinner.hide();
        this.modal.status = 1;

        this.modal.current = 0;

        break;


    }
  }


  public workerHelp(value: string): void {

    switch (value) {
      case 'operator':

        this.modal.title = "¿Cómo creo a un operador?"
        this.modal.content = [
          "Para crear un operador solo debe seleccionar el botón con el icono de usuario que se encuentra junto al botón de eliminar ",
          "Una vez pueda ver el modal, seleccione la opción crear",
          "Esta opción le permitirá a sus técnicos crear órdenes al igual que usted, permitiéndole agilizar su trabajo y trabajar con una mayor eficiencia"
        ];
        this.modal.src =
          [
            "assets/images/help/workers/operators-1.webp",
            "assets/images/help/workers/operators-2.webp"

          ];

        this.spinner.show();
        this.modal.src.forEach((imgSrc: string) => {
          new Image().src = imgSrc;
        });
        this.spinner.hide();
        this.modal.status = 1;

        this.modal.current = 0;

        break;

    }
  }


  public clientHelp(value: string): void {

    switch (value) {
      case 'user':

        this.modal.title = "¿Cómo creo a un usuario?"
        this.modal.content = [
          "Para crear un usuario solo debe seleccionar el botón con el icono de usuario que se encuentra junto al botón de eliminar ",
          "Una vez pueda ver el modal, seleccione la opción crear",
          "Esta opción le permitirá a sus clientes poder visualizar las órdenes que usted ha creado para ellos, así como poder descargar" +
          " los archivos que usted desee compartir"
        ];
        this.modal.src =
          [
            "assets/images/help/clients/users-1.webp",
            "assets/images/help/clients/users-2.webp"

          ];


        this.spinner.show();
        this.modal.src.forEach((imgSrc: string) => {
          new Image().src = imgSrc;
        });
        this.spinner.hide();
        this.modal.status = 1;

        this.modal.current = 0;

        break;


      case 'user_file':

        this.modal.title = "¿Cómo comparto archivos con mis clientes?"
        this.modal.content = [
          "Para compartir archivos, haga clic en el botón de la esquina derecha ",
          "Esta opción le permitirá compartir archivos tales como anuncios, noticias y actualizaciones"
        ];
        this.modal.src =
          [
            "assets/images/help/clients/files-1.webp",

          ];


        this.spinner.show();
        this.modal.src.forEach((imgSrc: string) => {
          new Image().src = imgSrc;
        });
        this.spinner.hide();
        this.modal.status = 1;

        this.modal.current = 0;

        break;


    }
  }






  public changeModal(value: string): void {

    switch (value) {
      case 'previous':
        this.modal.current = (this.modal.current > 0) ? (this.modal.current - 1) : 0;
        break;

      case 'next':
        this.modal.current = (this.modal.current >= (this.modal.content.length - 1)) ? (this.modal.current) : this.modal.current + 1;
        break;
    }
  }

}



