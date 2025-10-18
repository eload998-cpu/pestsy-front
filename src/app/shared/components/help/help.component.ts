import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { HelpService } from 'src/app/shared/services/help.service';
import { AuthUserService } from 'src/app/services/auth-user.service';
import { filter } from 'rxjs/operators';
import { Device, DeviceInfo } from "@capacitor/device";


interface MessageOptions {
  name: string;
  value: string;
}
@Component({
    selector: 'app-help',
    templateUrl: './help.component.html',
    styleUrls: ['./help.component.scss'],
    standalone: false
})


export class HelpComponent implements OnInit {


  public current_route: string;

  public help_items: Array<MessageOptions> = [];

  public show_options: boolean = false;

  public is_necessary: boolean = false;
  public role_name: string;
  public authUser: any;



  constructor(
    private router: Router,
    private _helpService: HelpService,
    private _authUserService: AuthUserService,
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.current_route = event.urlAfterRedirects;

        this.show_options = false;
        this.showHelpIcon(this.current_route);

        if (this.show_options) {
          this.helpOptions(this.current_route);

        }
      }
    });


    this._authUserService.userObservable.subscribe(
      (authUser: any) => {
        this.authUser = authUser;
        if (this.authUser) {
          this.role_name = this.authUser.roles[0].name;

        }
      }
    );

  }


  public ngOnInit(): void { }

  public showOptions(): void {
    this.show_options = !this.show_options;

    if (this.show_options) {
      this.helpOptions(this.current_route);

    }
  }


  public selectOption(value: string): void {
    this._helpService.emitChange({ action: value });
  }


  public async helpOptions(route: string): Promise<any> {

    let arr = route.split('/')
    let switch_route = arr[arr.length - 1];
    const deviceInfo = await Device.getInfo();


    switch (switch_route) {

      case 'tablero':

        this.help_items = [
          { name: "¿Cómo  utilizo la gráfica?", value: "graphic" }
        ];

        break;


      case 'clientes':

        if (this.role_name == "administrator" || this.role_name == "super_administrator" || this.role_name == "operator") {

          this.help_items = [
            { name: "¿Cómo creo a un usuario?", value: "user" },
            { name: "¿Cómo comparto archivos con mis clientes?", value: "user_file" }

          ];
        }
        break;

      case 'obreros':
        if (this.role_name == "administrator" || this.role_name == "super_administrator" || this.role_name == "operator") {

          this.help_items = [
            { name: "¿Cómo creo a un operador?", value: "operator" }
          ];
        }

        break;


    }


    //ORDERS


    if (route.includes('ordenes/')) {

      if (this.role_name == "administrator" || this.role_name == "super_administrator" || this.role_name == "operator") {
        this.help_items = [
          { name: "¿Cómo finalizo una orden?", value: "finish_order" },
          { name: "¿Cómo paso a pendiente una orden?", value: "pending_order" },
          { name: "¿Cómo descarto una orden?", value: "discard_order" },

        ];


        if ((deviceInfo as unknown as DeviceInfo).platform === "web") {
          this.help_items.push(
            { name: "¿Cómo puedo ver mi orden?", value: "see_order_module" }
          );
        }

      }
    }

    if (route.includes('listar-ordenes')) {

      let arr = [
        { name: "¿Cómo descargo una orden?", value: "download_order" },
      ]


      if ((deviceInfo as unknown as DeviceInfo).platform === "web") {
        arr.push(
          { name: "¿Cómo puedo ver mi orden?", value: "preview_order" }

        );
      }

      if (this.role_name == "administrator" || this.role_name == "super_administrator" || this.role_name == "operator") {
        this.help_items = [
          { name: "¿Cómo reenvío una orden?", value: "resend_order" },

        ];

        arr.push({ name: "¿Cómo reenvío una orden?", value: "resend_order" });

      }

      this.help_items = arr;

    }

    if (route.includes('ficheros-de-cliente')) {
      this.help_items = [
        { name: "¿Cómo añado un archivo?", value: "add_client_file" },
        { name: "¿Cómo elimino un archivo?", value: "delete_client_file" }

      ];
    }


  }


  public showHelpIcon(route: string): void {

    let arr = route.split('/')
    let switch_route = arr[arr.length - 1];


    switch (switch_route) {

      case 'tablero':

        this.is_necessary = true;
        break;


      case 'clientes':

        this.is_necessary = (this.role_name == "administrator" || this.role_name == "super_administrator") ? true : false;
        break;

      case 'obreros':

        this.is_necessary = (this.role_name == "administrator" || this.role_name == "super_administrator") ? true : false;
        break;

      case 'plagas':

        this.is_necessary = false;

        break;

      case 'dispositivos':

        this.is_necessary = false;
        break;

      case 'productos':

        this.is_necessary = false;
        break;

      case 'ubicaciones':

        this.is_necessary = false;
        break;

      case 'aplicaciones':

        this.is_necessary = false;
        break;


      case 'lugares-de-aplicacion':

        this.is_necessary = false;
        break;

      case 'permiso':

        this.is_necessary = false;

        break;

      case 'permisos-tab':

        this.is_necessary = false;

        break;

      case 'ficha-tecnica':

        this.is_necessary = false;

        break;
      case 'fichas-tecnicas-tab':

        this.is_necessary = false;

        break;
      case 'etiqueta':

        this.is_necessary = false;

        break;

      case 'etiqueta-tab':

        this.is_necessary = false;

        break;

      case 'croquis':

        this.is_necessary = false;

        break;

      case 'msds':

        this.is_necessary = false;

        break;

      case 'msds-tab':

        this.is_necessary = false;

        break;

      case 'personal-tecnico':

        this.is_necessary = false;

        break;

      case 'personal-tecnico-tab':

        this.is_necessary = false;

        break;

      case 'min-salud':

        this.is_necessary = false;


        break;

      case 'min-salud-tab':

        this.is_necessary = false;


        break;


      case 'mip':

        this.is_necessary = false;


        break;

      case 'informes':

        this.is_necessary = false;


        break;

      case 'tendencias':

        this.is_necessary = false;


        break;


      case 'planes':

        this.is_necessary = false;


        break;

      default:
        this.is_necessary = false;
        break;

    }



    //ORDERS


    if (route.includes('ordenes/')) {
      this.is_necessary = false;

    }

    if (route.includes('listar-ordenes')) {
      this.is_necessary = true;

    }

    if (route.includes('ficheros-de-cliente')) {
      this.is_necessary = false;

    }


  }
}
