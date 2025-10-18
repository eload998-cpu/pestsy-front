import { Component, Input, HostBinding, OnInit } from "@angular/core";
import { TourService } from 'src/app/shared/services/tour.service';
import { AuthUserService } from 'src/app/services/auth-user.service';
import { AuthService } from 'src/app/services/auth.service';


@Component({
    selector: 'app-mobile-tour',
    templateUrl: './mobile-tour.component.html',
    styleUrls: ['./mobile-tour.component.scss'],
    standalone: false
})

export class MobileTourComponent implements OnInit {

    constructor(
        private _tourService: TourService,
        private _authUserService: AuthUserService,
        private _authService: AuthService,

    ) { }

    @Input() step: number = 1;
    @Input() classes: string[] = [];
    @Input() text: string = '';
    @Input() componentName: string = '';
    @Input() showPrevButton: boolean = true;
    @Input() hiddeButton: boolean = false;

    @Input() finishTour: boolean = false;
    @Input() notAllowedRoles: string = '';

    public showTutorial: boolean = true;

    @HostBinding('class')
    get hostClasses(): string {
        return [
            'tour-step',
            this.componentName ? `component-${this.componentName}` : ''
        ].join(' ');
    }

    @Input() onNext!: () => void;
    @Input() onPrev!: () => void;
    @Input() onFinish!: () => void;

    public ngOnInit(): void {

        this.showTutorial = !this._authUserService.hasRoles(this.notAllowedRoles.split(','));
    }


    get classList(): string {
        return this.classes.join(' ');
    }

}
