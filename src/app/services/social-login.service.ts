import { Injectable } from '@angular/core';
import { SocialLogin } from "@capgo/capacitor-social-login";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class SocialLoginService {


  constructor() { }


  async initialize() {
    await SocialLogin.initialize({
      google: {
        webClientId: environment.googleClientId,
        mode: 'online'
      }
    });
  }

  async signInWithGoogle() {
    const user: any = await SocialLogin.login({
      provider: 'google',
      options: {
        scopes: ['email', 'profile']
      }
    });
    return user.result.profile;
  }


}
