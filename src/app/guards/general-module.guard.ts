import { Injectable, Injector } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, Route, UrlSegment } from '@angular/router';


@Injectable()
export class GeneralModuleGuard  {

    constructor
        (
            private injector: Injector,
            private router: Router

        ) {

    }

    async canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Promise<boolean> {
        const id = route.paramMap.get('id');
        const module = route.data['module'];
        let service: any;

        try {
            switch (module) {

                case 'corrective_action':
                    service = this.injector.get(
                        (await import('src/app/services/administration/corrective-action.service')).CorrectiveActionService
                    );
                    break;
                case 'affected_element':
                    service = this.injector.get(
                        (await import('src/app/services/administration/affected-element.service')).AffectedElementService
                    );
                    break;
                case 'aplication_place':
                    service = this.injector.get(
                        (await import('src/app/services/administration/aplication-place.service')).AplicationPlaceService
                    );
                    break;
                case 'aplication':
                    service = this.injector.get(
                        (await import('src/app/services/administration/aplication.service')).AplicationService
                    );
                    break;
                case 'applied_treatment':
                    service = this.injector.get(
                        (await import('src/app/services/administration/applied-treatment.service')).AppliedTreatmentService
                    );
                    break;
                case 'construction_type':
                    service = this.injector.get(
                        (await import('src/app/services/administration/construction-type.service')).ConstructionTypeService
                    );
                    break;
                case 'desinfection_method':
                    service = this.injector.get(
                        (await import('src/app/services/administration/desinfection.service')).DesinfectionService
                    );
                    break;
                case 'device':
                    service = this.injector.get(
                        (await import('src/app/services/administration/device.service')).DeviceService
                    );
                    break;
                case 'location':
                    service = this.injector.get(
                        (await import('src/app/services/administration/location.service')).LocationService
                    );
                    break;
                case 'pest':
                    service = this.injector.get(
                        (await import('src/app/services/administration/pest.service')).PestService
                    );
                    break;
                case 'product':
                    service = this.injector.get(
                        (await import('src/app/services/administration/product.service')).ProductService
                    );
                    break;
                default:
                    return true;
            }

            const model = await service.show(id);

            if (model.data.is_general) {
                this.router.navigate(['/home']);
                return false;
            }

            return true;

        } catch (error) {
            console.error(`Error resolving service for module '${module}'`, error);
            this.router.navigate(['/home']);
            return false;
        }
    }




}
