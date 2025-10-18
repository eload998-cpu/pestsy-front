import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenService } from 'src/app/services/token.service';

@Injectable()
export class VerifyTokenGuard  {

  constructor(
    private tokenService: TokenService,
    private router:Router
  ) { }

  public token:any;
  public email:any;

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean>
  {
    
      this.token= route.queryParams['token'];
      this.email=route.queryParams['user'];
    
        let resp= await this.tokenService.checkToken(this.token,this.email).toPromise();

        if(!resp)
        {
         this.router.navigateByUrl('/login')
 
        }
      
      

       return resp as boolean;
  }
}
