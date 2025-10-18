import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: "root"
})
export class AuthUserService {
  private userSubject: BehaviorSubject<any>;
  public userObservable: Observable<any>;

  constructor() {
    this.userSubject = new BehaviorSubject((null as any));
    this.userObservable = this.userSubject.asObservable();
  }

  get user(): any {
    return this.userSubject.getValue();
  }

  get permissions(): any {
    let permissions = this.userSubject.getValue();
    let arr_permissions = [];

    for (const key in permissions.roles) {
      for (const k2 in permissions.roles[key].permissions) {
        let obj =
        {
          id: permissions.roles[key].permissions[k2].id,
          name: permissions.roles[key].permissions[k2].name
        };

        arr_permissions.push(obj);
      }
    }

    return arr_permissions;
  }

  public hasRole(role: string) {
    let roles = this.user.roles;
    for (const i in roles) {
      if (roles[i].name == role) {
        return true;
      }
    }

    return false;
  }


  public hasRoles(roleNames: Array<string>): boolean {


    const useRoleNames = new Set(this.user.roles.map((r: any) => r.name));
    return roleNames.map(r => r.trim()).some(r => useRoleNames.has(r));
  }

  public next(data: any): void {
    if (data) {
      const user = data;
      this.userSubject.next(user);
    }
    else {
      this.userSubject.next((null as any));
    }
  }

  public clear(): void {
    this.next(null);
  }
}
